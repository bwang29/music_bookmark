// Author 1: borui@stanford.edu
// Author 2: Tony
var sound_source = [];//["sample.mp3"];
for(var i=0; i< raw_data.length; i++){
  sound_source.push("https://s3.amazonaws.com/tourfy_mount_001/songs/"+raw_data[i].title);
}
var loading_progress = 0;
var loading_progress_inc = 100/sound_source.length;
var html5_audios_playable = [];
var html5_audios_load = {};
var html5_current_idx = 0;
var html5_current_segment_id = "";
var total_song_checked = 0;
var switch_lock = false;
var play_mode = parseInt(getQueryParams(document.location.search).mode); // mode 1 means sgmented (bookmarked ux), 2 there is no bookmark
var first_mode = play_mode;
$(document).ready(function(){
  fire_up();
});

var time_started;
var time_ended;


// Support the newer Google Chrome only !
function fire_up(){
    console.log("Audio context initiated");
    for(var i=0; i<sound_source.length;i++){
      var audio = new Audio();
      audio.src = sound_source[i];
      audio.controls = true;
      audio.autoplay = false;
      audio.preload = "none";
      var audio_wrapper = document.createElement("div");
      audio_wrapper.setAttribute("class","audio_wrapper");
      audio_wrapper.setAttribute("style","display:none; width: 350px; margin: 0 auto;")
      audio_wrapper.appendChild(audio);
      document.body.appendChild(audio_wrapper); 
      html5_audios_playable.push(audio);
    }
    enter_mode(first_mode);
    time_started = new Date().getTime();
}

// enter a particular mode of our app
function enter_mode(mode){
  play_mode = mode;
  if(play_mode == 1){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      loading_progress = 0;
      total_song_checked = 0;
      msg("Welcome to the Calming Tech Music Store!");
      l("Click on the color segments to preview parts of songs. Please use the check-boxes to select up to five songs that you want to purchase. Once you're done, click 'Go to the next step'.");
      $("#next_step").show();
      build_ui();
      $(".mode1").show();
      $(".mode2").hide();
      $("#next_step").unbind().click(function(){
        if(first_mode == 1){
          enter_mode(2);
        }else{
          enter_mode(3);
        }
      });
  }else if(play_mode == 2){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      loading_progress = 0;
      total_song_checked = 0;
      msg("Welcome to the Calming Tech Music Store");
      l("Click on each strip to preview that song. Please select up to 5 songs using the check-boxes you want to purchase. Once you're done, click 'Go to the next step'.");
      $("#next_step").show().html("Go to the next step");
      build_ui();
      $(".mode2").show();
      $(".mode1").hide();
      $("#next_step").unbind().click(function(){
        if(first_mode == 1){
          enter_mode(3);
        }else{
          enter_mode(1);
        }
      });
  }else if(play_mode == 3){
      // Record total time spent, tt: total time
      time_ended = new Date().getTime();
      log_data.push({tt:time_ended - time_started});

      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      $("#next_step").hide();
      l("Thanks for your participation!");

      $("#music_seg").html("<div class='survey_code'><h2 style='margin-top:0'>Please copy the code below into the survey.</h2><div id='data_code' style='border:1px dashed; width:746px; padding:5px; margin:-10px 0 30px 0; background-color:#fafafa; font-size:75%; line-height:1;'>"+Base64.encode(JSON.stringify(log_data))+"</div></div><h2>Survey:</h2><div><iframe src=\"https://docs.google.com/forms/d/1ULt-fNqC37AtlaS_-d5_Opqp1cppuy5MCvYuqMjfFMM/viewform?embedded=true\" width=\"760\" height=\"864\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe></div>");

    }
}

// build bookmark ui
function build_ui(){
  $("#music_seg").empty();
  for(var s=0; s<raw_data.length;s++){
    var sid = raw_data[s].id;
    var segs = raw_data[s].segment.split(" ");
    var d = time_to_sec(raw_data[s].duration);

    if(s < raw_data.length/2){
      var seg_html = "<div class='seg_bar mode1'><div class='sound_title'>"+raw_data[s].title.split(".mp3")[0]+"</div>";
    }else{
      var seg_html = "<div class='seg_bar mode2'><div class='sound_title'>"+raw_data[s].title.split(".mp3")[0]+"</div>";
    }
   
    var pt = 0; // start time of a segment
    var c_p = 0; // type of a segment
    // mode 1 is segmented
    if(play_mode == 1){
      for(var i=0; i<segs.length; i++){
        var c_t = time_to_sec(segs[i].split("_")[0])+1; // end time of a segment, increase 1 to fit
        if(i != 0){
          c_p = segs[i-1].split("_")[1];
        }
        seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:"+100*((c_t - pt)/d)+"%;background-color:"+sample_color_map[c_p]+"'></div>";
        pt = c_t;
      }
      seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:"+100*((d - pt)/d)+"%;background-color:"+sample_color_map[segs[segs.length-1].split("_")[1]]+"'></div>";
    }else if(play_mode == 2){
      seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:100%;background-color:#999'></div>";
    }
    // append checkboxes
    seg_html += '<input type="checkbox" class="ckbox" id="c_'+sid+'" value="'+raw_data[s].title.split(".")[0]+'"><br>';
    seg_html += "</div>";
    $("#music_seg").append(seg_html);
  }
  $("#music_seg").append("<div class='choose_5'>Choose 5 songs</div>");
  // attach check box event
  $(".ckbox").unbind().click(function(){
    if($(this).is(":checked")){
      if(total_song_checked == 5){
        alert("You can check at most 5 songs!");
        $(this).prop('checked', false);
        return;
      }
      total_song_checked += 1;
      log_gen("s",this.id,$(this).attr("value"));
    }else{
      total_song_checked -= 1;
      log_gen("us",this.id,$(this).attr("value"));
    }
  });
  // play music buffer when click
  $(".seg_part").unbind().click(function(){
    if(switch_lock){
      return;
    }
    var id_info = this.id.split("_");
    if(html5_current_segment_id == this.id){
      pause_previous_html_audio();
      $(".seg_part").removeClass("sel");
      return;
    }
    $(".seg_part").removeClass("sel");
    $(this).addClass("sel");
    html5_current_segment_id = this.id;
    pause_previous_html_audio();
    html5_current_idx = parseInt(id_info[0]);
    if(typeof html5_audios_load[html5_current_idx] === "undefined"){
      html5_audios_playable[html5_current_idx].load();
      html5_audios_load[html5_current_idx] = true;
    }  
    setTimeout(function(){
      console.log(id_info);
      html5_audios_playable[html5_current_idx].currentTime = parseInt(id_info[1]);
      html5_audios_playable[html5_current_idx].play();
    },300);
  });

}

// t: time, a: action, d: data, m: play mode
function log_gen(act,d){
  log_data.push({
    t:new Date(),
    a:act,
    d:d,
    m:play_mode
  });
}
// show message to user
function msg(str){$("#instruction").html(str); } 
// pause the previous played audio
function pause_previous_html_audio(){html5_audios_playable[html5_current_idx].pause(); } // generate a log entry
// quick logging (also appear on the ui)
function l(msg){console.log(msg); $("#status").html(msg); }
// transform 4:30 to 4*60 + 30
function time_to_sec(t){var t_s = t.split(":"); return t_s[0]*60 + parseInt(t_s[1]); }
// query js parameters 
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}
