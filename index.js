// Author 1: borui@stanford.edu
// Author 2: Tony
var sound_source = [];//["sample.mp3"];
for(var i=0; i< raw_data.length; i++){
  sound_source.push("songs/"+raw_data[i].title);
}
var loading_progress = 0;
var loading_progress_inc = 100/sound_source.length;
var html5_audios_playable = [];
var html5_current_idx = 0;
var total_song_checked = 0;
var switch_lock = false;
var play_mode = 1; // mode 1 means sgmented (bookmarked ux), 2 there is no bookmark, 3 survey page
$(document).ready(function(){
  fire_up();
});

// Support the newer Google Chrome only !
function fire_up(){
    console.log("Audio context initiated");
    for(var i=0; i<sound_source.length;i++){
      var audio = new Audio();
      audio.src = sound_source[i];
      audio.controls = true;
      audio.autoplay = false;
      audio.preload = "auto";
      var audio_wrapper = document.createElement("div");
      audio_wrapper.setAttribute("class","audio_wrapper");
      audio_wrapper.setAttribute("style","display:none; width: 350px; margin: 0 auto;")
      audio_wrapper.appendChild(audio);
      document.body.appendChild(audio_wrapper); 
      html5_audios_playable.push(audio);
    }
    enter_mode(1);
}

// enter a particular mode of our app
function enter_mode(mode){
  play_mode = mode;
  if(play_mode == 1){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      loading_progress = 0;
      total_song_checked = 0;
      msg("Welcome to the Calming Tech Music Store");
      l("Click on the color strips to preview songs and use the check-boxes to select upto five songs that you want to purchase. Once you're done, click 'Go to the next step'.");
      $("#next_step").show();
      build_ui();
      $("#next_step").unbind().click(function(){
        enter_mode(2);
      });
  }else if(play_mode == 2){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      loading_progress = 0;
      total_song_checked = 0;
      msg("Welcome to the Calming Tech Music Store");
      l("Now select another 5 songs using the check-boxes you want to purchase. Once you're done, click 'Go to the next step'.");
      $("#next_step").show().html("Go to the next step");
      build_ui();
      $("#next_step").unbind().click(function(){
        enter_mode(3);
      });
  }else if(play_mode == 3){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      $("#next_step").hide();
      l("Thanks for your participation!");
      $("#music_seg").html("<div class='survey_code'><h2 style='margin-top:0'>Copy the code below to the <a href=''>survey</a> to obtain access to the songs</h2>"+Base64.encode(JSON.stringify(log_data))+"</div>");
  }
}

// build bookmark ui
function build_ui(){
  $("#music_seg").empty();
  for(var s=0; s<raw_data.length;s++){
    var segs = raw_data[s].segment.split(" ");
    var d = time_to_sec(raw_data[s].duration);
    var seg_html = "<div class='seg_bar'><div class='sound_title hide'>"+raw_data[s].title.split(".")[0]+"</div>";
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
    seg_html += '<input type="checkbox" class="ckbox" id="c_'+s+'" value="'+raw_data[s].title.split(".")[0]+'"><br>';
    seg_html += "</div>";
    $("#music_seg").append(seg_html);
  }
  // attach check box event
  $(".ckbox").click(function(){
    if($(this).is(":checked")){
      if(total_song_checked == 5){
        alert("You can check at most 5 songs!");
        $(this).prop('checked', false);
        return;
      }
      total_song_checked += 1;
      log_gen("checkbox select",this.id,$(this).attr("value"));
    }else{
      total_song_checked -= 1;
      log_gen("checkbox unselect",this.id,$(this).attr("value"));
    }
  });
  // play music buffer when click
  $(".seg_part").click(function(){
    if(switch_lock){
      return;
    }
    $(".seg_part").removeClass("sel");
    $(this).addClass("sel");
    var id_info = this.id.split("_");
    pause_previous_html_audio();
    html5_current_idx = parseInt(id_info[0]);
    html5_audios_playable[html5_current_idx].currentTime = parseInt(id_info[1]);
    html5_audios_playable[html5_current_idx].play();
  });
}

function log_gen(act,d){
  log_data.push({
    time:new Date(),
    action:act,
    data:d,
    mode:play_mode
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