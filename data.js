var log_data = [];

var sample_color_map = {
  0:"#F5EDF4",
  1:"#C6BAD5",
  2:"#8F8DB4",
  3:"#A39ABC",
  4:"#BCDD7F",
  5:"#6A4061",
  6:"#65C9FF"
};

var raw_data = [
{title: "24 Hour Party People.mp3",
duration:"4:38",
segment: "0:17_1 0:48_2 1:33_1 2:16_2 2:34_5 2:53_1 3:31_5 3:46_6 3:55_5 4:05_2"},
{title: "Bryn Vampire Weekend.mp3",
duration:"2:13",
segment: "0:23_1 0:40_2 0:55_5 1:11_1 1:27_2 1:42_5 1:59_6"},
{title: "Civilization Justice.mp3",
duration:"4:11",
segment: "0:22_1 1:05_2 2:49_6 3:15_1 3:32_2"},
{title: "FIrst Aid.mp3",
duration:"6:11",
segment: "1:00_1 1:30_2 1:59_4 2:30_1 3:02_2 4:00_4 04:33_1"},
{title: "Half Mast.mp3",
duration:"3:54",
segment: "0:21_1 0:37_2 0:53_1 1:22_2 1:37_5 1:52_1 2:22_2 2:52_1 3:23_5"},
{title: "I Can Change LCD Soundsystem.mp3",
duration:"5:55",
segment: "0:25_1 1:32_2 2:14_1 3:17_2 4:09_1 4:40_2"}
// {title: "It's War Blackbird Blackbird.mp3",
// duration:"7:09",
// segment: "2:01_1 2:18_5 2:26_2 2:35_5 2:51_2 4:03_5 4:36_2 5:09_5 5:24_2 5:58_5 6:13_2 6:37_5"},
// {title: "Padding Out Mike Snow.mp3",
// duration:"3:38",
// segment: "0:15_1 0:44_2 0:59_1 1:45_2 2:15_5 2:49_2 3:18_6"},
// {title: "Punching In A Dream.mp3",
// duration:"3:34",
// segment: "0:25_1 0:41_2 0:58_5 1:16_1 1:30_2 1:49_5 2:14_4 2:45_2 3:21_5"},
// {title: "Send And Receive.mp3",
// duration:"4:53",
// segment: "1:16_1 2:11_2 3:22_1 3:48_2 4:19_1"},
// {title: "Seven Nation Army.mp3",
// duration:"3:51",
// segment: "0:15_1 0:47_2 1:12_1 1:58_2 2:03_5 2:51_1 3:23_2 3:29_5"},
// {title: "So Sorry Girl.mp3",
// duration:"2:17",
// segment: "0:00_1 1:00_2 1:27_1 2:06_5"},
// {title: "Song For No One Mike Snow.mp3",
// duration:"4:10",
// segment: "0:16_1 0:50_2 1:07_6 1:32_1 2:05_2 2:23_6"},
// {title: "Time To Pretend MGMT.mp3",
// duration:"4:25",
// segment: "0:31_1 1:09_2 1:45_1 2:15_6 2:34_1 2:53_2 3:59_6"},
// {title: "All Blackbird Blackbird.mp3",
// duration:"5:06",
// segment: "0:14_1 1:49_5 2:35_1 3:55_6"}
];

var sample_seg_data = [];
for(var i=0;i<5;i++){
  var segs = [];
  var progress = 0;
  for(var j=0;j<ri(3,6);j++){
    var d = ri(10,50);
    segs.push({
      type:ri(0,10),
      time:ri(progress,progress+d)
    });
    progress = progress+d;
  }
  segs.push({
      type:ri(0,10),
      time:progress
  });
  sample_seg_data.push({
    duration:progress,
    segments:segs
  });
}

function build_seg_bars(){
  for(var i=0;i<sample_seg_data.length;i++){
    var segments = sample_seg_data[i].segments;
    var d = sample_seg_data[i].duration;
    var seg_bar = "<div class='seg_bar'><div class='sound_title'>Sound Title</div>";
    var pt = 0;
    for(var j=0; j<segments.length;j++ ){
      seg_bar += "<div class='seg_part' style='width:"+100*((segments[j].time - pt)/d)+"%;background:"+sample_color_map[segments[j].type]+"'></div>";
      pt = segments[j].time;
    }
    seg_bar += "</div>"
    $("#seg_area").append(seg_bar);
  }
}

var sample_seg_data_template = [
  {
    meta:{},
    duration: 240,
    segments: [
      {
        info: "",
        time:43,
        type:0
      },
      {
        info: "",
        time:90,
        type:4
      },
      {
        info: "",
        time:130,
        type:3
      },
      {
        info: "",
        time:200,
        type:9
      },
      {
        info: "",
        time:240,
        type:8
      }
    ]
  }
];

// get random integer between min and max (inclusive)
function ri(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }

      }

      output = Base64._utf8_decode(output);

      return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }

      }

      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }

      }

      return string;
  }
}




