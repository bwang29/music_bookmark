// Author 1: borui@stanford.edu
// Author 2: Tony
var global_volume = 0.4;

var ad_context;
var sound_source = [];//["sample.mp3"];
for(var i=0; i< raw_data.length; i++){
  sound_source.push("songs/"+raw_data[i].title);
}
var loading_progress = 0;
var loading_progress_inc = 100/sound_source.length;
var buffer_list_playable;
var html5_audios_playable = [];
var switch_buffer_player;
var switch_gain_node;
var switch_gain_val;
var buffer_player;
var gain_node;
var gain_val;
var timeouts = [];
var total_song_checked = 0;
var switch_lock = false;
var play_mode = 1; // mode 1 means sgmented (bookmarked ux), otherwise there is no bookmark

$(document).ready(function(){
  create_audio_context();
});

// Support the newer Google Chrome only !
function create_audio_context(){
  try {
    ad_context = new webkitAudioContext();
    console.log("Audio context initiated");
    //buffer_loader = new BufferLoader(ad_context,sound_source,buffer_loading_finished);
    //buffer_loader.load();
    console.log("Buffer loader started loading.. please wait");
    for(var i=0; i<sound_source.length;i++){
      var audio = new Audio();
      audio.src = sound_source[i];
      audio.controls = true;
      audio.autoplay = false;
      audio.preload = "auto";
      html5_audios_playable.push(audio);
    }

    if(play_mode == 1){
      msg("Welcome to the Calming Tech Music Store");
      l("Click on the color strips to preview songs and use the check-boxes to select upto five songs that you want to purchase. Once you're done, click 'Go to the next step'.");
      $("#next_step").show();
      $("#next_step").click(function(){
        go_to_mode_2();
      });
    }else{
      l("Now select another 5 songs you want. Once you're done, click 'Go to the next step', which will lead you to our survey.");
      $("#next_step").show().html("Go to the next step");
      $("#next_step").unbind().click(function(){
        go_to_survey();
      });
    }

    build_ui();
    
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser and no sound will be played');
  }
}
// transit user to survey
function go_to_survey(){
  if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
  buffer_list_playable = [];
  $("#next_step").hide();
  l("Thanks for your participation!");
  $("#music_seg").html("<div class='survey_code'><h2>Copy the code below to the <a href=''>survey</a> to obtain access to the songs</h2>"+Base64.encode(JSON.stringify(log_data))+"</div>");
}
// transit user to mode 2
function go_to_mode_2(){
  if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
  buffer_list_playable = [];
  play_mode = 2;
  loading_progress = 0;
  total_song_checked = 0;
  $("#music_seg").empty();
  $("#next_step").hide();
  l("Loading...")
  create_audio_context();
}

// show message to user
function msg(str){
  $("#instruction").html(str);
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
        seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:"+100*((c_t - pt)/d)+"%;background:"+sample_color_map[c_p]+"'></div>";
        pt = c_t;
      }
      seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:"+100*((d - pt)/d)+"%;background:"+sample_color_map[segs[segs.length-1].split("_")[1]]+"'></div>";
    }else{
      seg_html += "<div class='seg_part' id='"+s+"_"+pt+"' style='width:100%;background:#999'></div>";
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
    //local_play(buffer_list_playable,id_info[0],id_info[1]);
    pause_all_html5_audio();
    html5_audios_playable[parseInt(id_info[0])].play();
    html5_audios_playable[parseInt(id_info[0])].currentTime = parseInt(id_info[1]);
  });
}

function pause_all_html5_autio(){
  for()
}
// generate a log entry
function log_gen(act,d){
  log_data.push({
    time:new Date(),
    action:act,
    data:d,
    mode:play_mode
  });
}

// quick logging (also appear on the ui)
function l(msg){
  console.log(msg)
  $("#status").html(msg);
}

// player any buffer (for tempprary testing purpose only)
function play_buffer(buffer){
    if(typeof tmp_buffer_player!== "undefined")tmp_buffer_player.stop(0);
    tmp_buffer_player = ad_context.createBufferSource();
    tmp_buffer_player.buffer = buffer;
    tmp_buffer_player.connect(ad_context.destination);
    tmp_buffer_player.start(0);
}

// transform 4:30 to 4*60 + 30
function time_to_sec(t){
  var t_s = t.split(":");
  return t_s[0]*60 + parseInt(t_s[1]);
}

// drag and drop functions for music
$(document).ready(function(){
  dropArea = document.getElementById('dropArea');
  list = [];
  totalSize = 0;
  load_progress = 0;
  totalProgress = 0;
  drop_buffer_list_playable = [];

  // main initialization
  (function(){

      // init handlers
      function initHandlers() {
          dropArea.addEventListener('drop', handleDrop, false);
          dropArea.addEventListener('dragover', handleDragOver, false);
      }

      // drag over
      function handleDragOver(event) {
          event.stopPropagation();
          event.preventDefault();
          dropArea.className = 'hover';
      }

      // drag drop
      function handleDrop(event) {
          event.stopPropagation();
          event.preventDefault();
          processFiles(event.dataTransfer.files);
          dropArea.className = 'uploading';
          dropArea.innerHTML = "Loading..";
      }

      // process bunch of files
      function processFiles(filelist) {
          if (!filelist || !filelist.length || list.length) return;
          totalSize = 0;
          totalProgress = 0;
          for (var i = 0; i < filelist.length && i < 5; i++) {
              list.push(filelist[i]);
              totalSize += filelist[i].size;
          }
          var reader_list = [];
          for(var b=0; b<filelist.length; b++){
            reader_list[b] = new FileReader();
            reader_list[b].onload = function (event) {
              ad_context.decodeAudioData( event.target.result, function(buffer) {
                console.log("Loaded buffer with length "+buffer.length);
                drop_buffer_list_playable.push(buffer);
                load_progress += 1;
                if(load_progress == list.length){
                  dropArea.className = '';
                  dropArea.innerHTML = "Drop Area";
                }
              }, function(){alert("error loading!");} ); 
            };
            reader_list[b].onerror = function (event) {
              alert("Error: " + reader_list[b].error );
            };
            reader_list[b].readAsArrayBuffer(filelist[b]);
          }
          
      }
      initHandlers();
  })();
});

// local play can play any buffer in the playlist at any time and cross fade into any other time in other buffer
// function local_play(playlist,index,start_time){
//     if(switch_lock){
//       console.log("Still cross fading, wait later");
//       return;
//     }
//     switch_lock = true;
//     $(".seg_part").css({"cursor":"no-drop"});
//     gain_val = 0;
//     switch_gain_val = global_volume;
//     for (var i=0; i<timeouts.length; i++) {
//       clearTimeout(timeouts[i]);
//     }
//     console.log("cleared all timeouts");
//     // fadeout the previous sound node and fade in the new sound node
//     for(var i=0; i<switch_gain_val/0.025; i++){
//       // fade using 0.025 as step value
//       timeouts.push(setTimeout(function(){
//         if(switch_gain_val <= 0.025){
//           if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
//           switch_gain_val = gain_val;
//           switch_buffer_player = buffer_player;
//           switch_gain_node = gain_node;
//           console.log("buffer player and gain node switched");
//           switch_lock = false;
//           $(".seg_part").css({"cursor":"pointer"});
//           return;
//         }
//         switch_gain_val -= 0.025;
//         gain_val += 0.025;
//         if(typeof switch_gain_node !== "undefined") switch_gain_node.gain.value = switch_gain_val;
//         gain_node.gain.value = gain_val;
//         console.log(switch_gain_val+" , "+gain_val);
//       },80 + 80 * i));
//     }
//     // fadein the new sound node
//     gain_node = ad_context.createGainNode();
//     buffer_player = ad_context.createBufferSource();
//     buffer_player.buffer = playlist[index];
//     buffer_player.connect(gain_node);
//     gain_node.gain.value = gain_val;
//     gain_node.connect(ad_context.destination);
//     //buffer_player.loop = true; // enable this if you want the music to loop
//     buffer_player.start(0,start_time);
// }

// set soung volume for local palyer
// function local_set_volume(val){
//   gain_val = val;
//   gain_node.gain.value = switch_gain_val;
//   switch_gain_val = val;
//   switch_gain_node.gain.value = switch_gain_val;
// }

// trigger then buffer of all audio clips are loaded completely
// function buffer_loading_finished(bufferList) {
//   console.log("Buffer loader compplete - loaded " + sound_source.length + " sounds");
//   setTimeout(function(){
//     // events after loading finished
//     if(play_mode == 1){
//       msg("Welcome to the Calming Tech Music Store");
//       l("Click on the color strips to preview songs and use the check-boxes to select upto five songs that you want to purchase. Once you're done, click 'Go to the next step'.");
//       $("#next_step").show();
//       $("#next_step").click(function(){
//         go_to_mode_2();
//       });
//     }else{
//       l("Now select another 5 songs you want. Once you're done, click 'Go to the next step', which will lead you to our survey.");
//       $("#next_step").show().html("Go to the next step");
//       $("#next_step").unbind().click(function(){
//         go_to_survey();
//       });
//     }

//   },500);
//   buffer_list_playable = bufferList;
//   build_ui();
// }

// buffer loader class
function BufferLoader(context,urlList,callback){this.context=context;this.urlList=urlList;this.onload=callback;this.bufferList=new Array();this.loadCount=0;}
BufferLoader.prototype.loadBuffer=function(url,index){var request=new XMLHttpRequest();request.open("GET",url,true);request.responseType="arraybuffer";var loader=this;request.onload=function(){loader.context.decodeAudioData(request.response,function(buffer){if(!buffer){alert('error decoding file data: '+url);return;}
loader.bufferList[index]=buffer;if(++loader.loadCount==loader.urlList.length)
loader.onload(loader.bufferList);loading_progress+=loading_progress_inc; l("loading.. " + loading_progress.toFixed(2) + "%")},function(error){console.error('decodeAudioData error',error);});}
request.onerror=function(){alert('BufferLoader: XHR error');}
request.send();}
BufferLoader.prototype.load=function(){for(var i=0;i<this.urlList.length;++i)
this.loadBuffer(this.urlList[i],i);}