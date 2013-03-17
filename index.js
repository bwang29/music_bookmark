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
var seg_indicator_timeout;
var time_started;
var time_ended;
var iterative_loading_ctr = 0;
var mode2_current_left_px = -1;
var bar_width = 450;

var curr_selected_songs = [];


// Support the newer Google Chrome only !
function fire_up(){
    var isChrome = (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome') + 7).split(' ')[0]) >= 15);
    if(!isChrome) {
      window.alert("Please use the latest version of Chrome. We don't support other browsers at the moment, sorry!");
      return;
    }

    console.log("Audio context initiated");
    for(var i=0; i<sound_source.length;i++){
      var audio = new Audio();
      audio.src = sound_source[i];
      audio.controls = true;
      audio.autoplay = false;
      audio.preload = "none";
      var audio_wrapper = document.createElement("div");
      audio_wrapper.setAttribute("class","audio_wrapper");
      audio_wrapper.setAttribute("style"," width: 350px; margin: 0 auto;")
      audio_wrapper.appendChild(audio);
      document.body.appendChild(audio_wrapper); 
      html5_audios_playable.push(audio);
    }
    iterative_loading();
    enter_mode(first_mode);
    time_started = new Date().getTime();
}


function iterative_loading(){
  html5_audios_playable[iterative_loading_ctr].load();
  setInterval(function(){
    if(iterative_loading_ctr == 29) return;
    iterative_loading_ctr += 1;
    html5_audios_playable[iterative_loading_ctr].load();
  },8000);
}

// enter a particular mode of our app
function enter_mode(mode){
  play_mode = mode;
  mode2_current_left_px = -1;
  if(play_mode == 1){
      if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
      pause_previous_html_audio();
      loading_progress = 0;
      total_song_checked = 0;
      msg("Calming Tech Music Store");
      var color_map = "<div><br>Color illustration<br>";
      for(var i=0; i<7;i++){
        color_map+= "<div class='seg_ilu' style='border-radius:3px; font-size:13px; width:55px; color:#292929;display:inline-block; margin:3px; background:"+sample_color_map[i]+"'>"+sample_color_map[i+"_n"]+" </div>";
      }
      color_map+="</div>";
      l("Click on the color segments to preview parts of songs. Please use the check-boxes to select up to five songs that you want to purchase. Once you're done, click 'Go to the next step'."+color_map);
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
      msg("Calming Tech Music Store");
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
      $("#music_seg").html("<div class='survey_code'><h2 style='margin-top:0'>Please copy the code below into the survey.</h2><div id='data_code' style='border:1px dashed; width:746px; padding:5px; margin:-10px 0 30px 0; background-color:#fafafa; font-size:75%; line-height:1;'>"+Base64.encode(JSON.stringify(log_data))+"</div></div><h2>Download Songs:</h2><div><a href='download.html?data=" + gen_download_url() + "' target='_blank'>download link</a></div><h2>Survey:</h2><div><iframe src=\"https://docs.google.com/forms/d/1ULt-fNqC37AtlaS_-d5_Opqp1cppuy5MCvYuqMjfFMM/viewform?embedded=true\" width=\"760\" height=\"1318\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe></div>");

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
      var seg_html = "<div class='seg_bar mode1'><div class='sound_title'>"+raw_data[s].title.split(".mp3")[0]+"</div><div class='seg_indicator' id='ind_"+sid+"'></div>";
    }else{
      var seg_html = "<div class='seg_bar mode2'><div class='sound_title'>"+raw_data[s].title.split(".mp3")[0]+"</div><div class='seg_indicator' id='ind_"+sid+"'></div><div class='seg_indicator_gray' id='gray_ind_"+sid+"'></div>";
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
      seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:100%;background-color:#AAA'></div>";
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
      // Log song checked. c: song checked
      log_gen("c",this.id);
      if(curr_selected_songs.indexOf(this.id) == -1) {
        curr_selected_songs.push(this.id);
      }
    }else{
      // Log song unselected. uc: song unchecked
      total_song_checked -= 1;
      log_gen("uc",this.id);
      var found_index = curr_selected_songs.indexOf(this.id);
      curr_selected_songs.remove(found_index);
    }
  });
  // play music buffer when click
  $(".seg_part").unbind().click(function(){
    if(switch_lock){
      return;
    }
    var id_info = this.id.split("_");
    if(html5_current_segment_id == this.id){
      // Don't pause track if in mode 2 and in same track (unless you click pause icon)
      if(play_mode == 1 || (play_mode == 2 && (mode2_current_left_px && mode2_current_left_px <= 40))) {
        pause_previous_html_audio();
        $(".seg_part").removeClass("sel");
        html5_current_segment_id = "";
        return;
      }
    } else {
      $(".seg_part").removeClass("sel");
      $(this).addClass("sel");
      html5_current_segment_id = this.id;
      pause_previous_html_audio();
    }
    
    html5_current_idx = parseInt(id_info[0]);
    if(typeof html5_audios_load[html5_current_idx] === "undefined"){
      html5_audios_playable[html5_current_idx].load();
      html5_audios_load[html5_current_idx] = true;
    }  

    // log section play data, sp: section played, d: song id & section beginning in seconds
    log_gen("sp", raw_data[html5_current_idx].id + "_" + id_info[1]);

    setTimeout(function(){
      if(mode2_current_left_px != -1) {
        var current_time_in_sec = (mode2_current_left_px/bar_width) * time_to_sec(raw_data[html5_current_idx].duration);

        html5_audios_playable[html5_current_idx].currentTime = current_time_in_sec;
      } else {
        html5_audios_playable[html5_current_idx].currentTime = parseInt(id_info[1]);
      }
      html5_audios_playable[html5_current_idx].play();
      clearInterval(seg_indicator_timeout);
      seg_indicator_timeout = setInterval(function(){
        var seg_left = 450*(html5_audios_playable[html5_current_idx].currentTime/time_to_sec(raw_data[html5_current_idx].duration));
        $("#ind_"+raw_data[html5_current_idx].id).css("left",seg_left+"px");
      },500);
    },300);
  });

  var current_idx;

  // shift segment indicator when hovering over gray segments in play_mode 2
  if(play_mode == 2) {
    $(".seg_part").mouseenter(function(e) {
      var id_info = this.id.split("_");
      current_idx = parseInt(id_info[0]);
      var left_edge = $("#" + this.id).offset().left;

      $(".seg_part").mousemove(function(e){
        mode2_current_left_px = e.pageX - left_edge;
        $("#gray_ind_"+raw_data[current_idx].id).css("display", "inline");
        $("#gray_ind_"+raw_data[current_idx].id).css("left", mode2_current_left_px+"px");
      });

      $(".seg_part").mouseleave(function(e){
        $("#gray_ind_"+raw_data[current_idx].id).css("display", "none");
      });
    });
  }
}

function gen_download_url() {
  var result = Base64.encode(curr_selected_songs.join());
  return result;
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
// remove from array
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

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
