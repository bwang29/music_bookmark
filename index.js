// Author 1: borui@stanford.edu
// Author 2: Tony

var ad_context;
var sound_source = ["sample.mp3"];
var buffer_list_playable;
var switch_buffer_player;
var switch_gain_node;
var switch_gain_val = 0.4;
var buffer_player;
var gain_node;
var gain_val = 0;

$(document).ready(function(){
  create_audio_context();
});

// Support the newer Google Chrome only !
function create_audio_context(){
  try {
    ad_context = new webkitAudioContext();
    console.log("Audio context initiated");
    buffer_loader = new BufferLoader(ad_context,sound_source,buffer_loading_finished);
    buffer_loader.load();
    console.log("Buffer loader finished loading");
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser and no sound will be played');
  }
}

// trigger then buffer of all audio clips are loaded completely
function buffer_loading_finished(bufferList) {
  console.log("Buffer loader compplete - loaded " + sound_source.length + " sounds");
  buffer_list_playable = bufferList;
}

// local play
function local_play(playlist,index,start_time){
    console.log("in 1");
    // fadeout the previous sound node and fade in the new sound node
    gain_val = 0;
    for(var i=0; i<switch_gain_val/0.025; i++){
      // fade using 0.025 as step value
      setTimeout(function(){
        if(switch_gain_val <= 0.025){
          if(typeof switch_buffer_player !== "undefined") switch_buffer_player.stop(0);
          switch_gain_val = gain_val;
          switch_buffer_player = buffer_player;
          switch_gain_node = gain_node;
          console.log("buffer player and gain node switched");
          return;
        }
        switch_gain_val -= 0.025;
        gain_val += 0.025;
        if(typeof switch_gain_node !== "undefined") switch_gain_node.gain.value = switch_gain_val;
        gain_node.gain.value = gain_val;
        console.log(switch_gain_val+" , "+gain_val);
      },100 + 100 * i);
    }
    // fadein the new sound node
    gain_node = ad_context.createGainNode();
    buffer_player = ad_context.createBufferSource();
    buffer_player.buffer = playlist[index];
    buffer_player.connect(gain_node);
    gain_node.gain.value = gain_val;
    gain_node.connect(ad_context.destination);
    buffer_player.loop = true;
    buffer_player.start(0,start_time);
}

// set volume
function local_set_volume(val){
  gain_val = val;
  gain_node.gain.value = switch_gain_val;
  switch_gain_val = val;
  switch_gain_node.gain.value = switch_gain_val;
}


// buffer loader class
function BufferLoader(context,urlList,callback){this.context=context;this.urlList=urlList;this.onload=callback;this.bufferList=new Array();this.loadCount=0;}
BufferLoader.prototype.loadBuffer=function(url,index){var request=new XMLHttpRequest();request.open("GET",url,true);request.responseType="arraybuffer";var loader=this;request.onload=function(){loader.context.decodeAudioData(request.response,function(buffer){if(!buffer){alert('error decoding file data: '+url);return;}
loader.bufferList[index]=buffer;if(++loader.loadCount==loader.urlList.length)
loader.onload(loader.bufferList);},function(error){console.error('decodeAudioData error',error);});}
request.onerror=function(){alert('BufferLoader: XHR error');}
request.send();}
BufferLoader.prototype.load=function(){for(var i=0;i<this.urlList.length;++i)
this.loadBuffer(this.urlList[i],i);}