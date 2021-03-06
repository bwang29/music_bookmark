var log_data = [];

var sample_color_map = {
  0:"#F5EDF4",
  1:"#C6BAD5",
  2:"#8F8DB4",
  3:"#92BEB6",
  4:"#BCDD7F",
  5:"#A76297",
  6:"#65C9FF",
  "0_n": "Intro",
  "1_n": "Verse",
  "2_n": "Chorus",
  "3_n": "Bridge",
  "4_n": "Tension",
  "5_n": "Solo",
  "6_n": "Ending",
  "length":7
};

var sample_color_map2 = {
  0:"#F1C40F",
  1:"#E67E22",
  2:"#E74C3C",
  "0_n": "Low energy",
  "1_n": "Middle energy",
  "2_n": "High energy",
  "length":3
};

var raw_data = [
{title: "24 Hour Party People.mp3",
duration:"4:38",
segment: "0:17_1 0:48_2 1:33_1 2:16_2 2:34_5 2:53_1 3:31_5 3:46_6 3:55_5 4:05_2",
segment2: "1_0:48 2_1:05 1_1:20 2_1:38 1_2:35 0_2:50 2_4:38",
url: "G0wfR",
id: 0},
{title: "Bryn Vampire Weekend.mp3",
duration:"2:13",
segment: "0:23_1 0:40_2 0:55_5 1:11_1 1:27_2 1:42_5 1:59_6",
segment2: "0_0:40 1_1:12 0_1:27 1_1:42 0_2:13",
url: "i2sD6",
id: 1},
{title: "Civilization Justice.mp3",
duration:"4:11",
segment: "0:22_1 1:05_2 2:49_6 3:15_1 3:32_2",
segment2: "1_0:21 0_1:04 1_2:50 2_3:13 0_3:32 2_4:11",
url: "EPRbT",
id: 2},
{title: "FIrst Aid.mp3",
duration:"6:11",
segment: "1:00_1 1:30_2 1:59_4 2:30_1 3:02_2 4:00_4 04:33_1",
segment2: "0_0:29 1_1:00 0_1:18 1_1:30 2_3:01 0_3:32 1_4:01 2_5:34 1_6:11",
url: "IeRyr",
id: 3},
{title: "Half Mast.mp3",
duration:"3:54",
segment: "0:21_1 0:37_2 0:53_1 1:22_2 1:37_5 1:52_1 2:22_2 2:52_1 3:23_5",
segment2: "0_0:21 1_1:37 0_1:51 1_3:22 0_3:54",
url: "iKC5i",
id: 4},
{title: "I Can Change LCD Soundsystem.mp3",
duration:"5:55",
segment: "0:25_1 1:32_2 2:14_1 3:17_2 4:09_1 4:40_2",
segment2: "0_0:26 1_1:31 2_2:05 0_2:12 1_2:45 2_3:51 1_4:39 2_5:55",
url: "Nvdq8",
id: 5},
{title: "It's War Blackbird Blackbird.mp3",
duration:"7:09",
segment: "2:01_1 2:18_5 2:26_2 2:35_5 2:51_2 4:03_5 4:36_2 5:09_5 5:24_2 5:58_5 6:13_2 6:37_5",
segment2: "0_0:09 1_1:53 2_2:36 1_2:50 2_3:22 0_3:39 1_4:27 2_5:09 1_5:26 2_5:57 0_6:13 1_7:09",
url: "TxV0N",
id: 6},
{title: "Padding Out Mike Snow.mp3",
duration:"3:38",
segment: "0:15_1 0:44_2 0:59_1 1:45_2 2:15_5 2:49_2 3:18_6",
segment2: "1_0:14 0_0:29 1_0:44 2_0:59 0_1:14 1_1:44 2_2:14 0_2:30 2_3:19 0_3:38",
url: "l5cU4",
id: 7},
{title: "Punching In A Dream.mp3",
duration:"3:34",
segment: "0:25_1 0:41_2 0:58_5 1:16_1 1:30_2 1:49_5 2:14_4 2:45_2 3:21_5",
segment2: "0_0:26 1_0:57 2_1:15 1_1:49 2_2:05 0_2:21 1_2:29 2_3:34",
url: "4xSC0",
id: 8},
{title: "Send And Receive.mp3",
duration:"4:53",
segment: "1:16_1 2:11_2 3:22_1 3:48_2 4:19_1",
segment2: "0_1:15 1_1:46 0_1:57 1_2:28 0_2:46 1_3:10 0_4:53",
url: "F8vly",
id: 9},
{title: "Seven Nation Army.mp3",
duration:"3:51",
segment: "0:15_1 0:47_2 1:12_1 1:58_2 2:03_5 2:51_1 3:23_2 3:29_5",
segment2: "0_0:32 1_0:51 2_1:11 0_1:18 1_2:01 2_2:38 0_2:52 1_3:28 2_3:51",
url: "07cNq",
id: 10},
{title: "So Sorry Girl.mp3",
duration:"2:17",
segment: "0:00_1 1:00_2 1:27_1 2:06_5",
segment2: "1_2:17",
url: "aRwae",
id: 11},
{title: "Song For No One Mike Snow.mp3",
duration:"4:10",
segment: "0:16_1 0:50_2 1:07_6 1:32_1 2:05_2 2:23_6",
segment2: "0_0:16 1_0:50 2_1:08 1_2:05 2_2:23 1_2:42 0_3:13 2_3:49 0_4:10",
url: "zwNT2",
id: 12},
{title: "Time To Pretend MGMT.mp3",
duration:"4:25",
segment: "0:31_1 1:09_2 1:45_1 2:15_6 2:34_1 2:53_2 3:59_6",
segment2: "0_0:27 1_1:55 2_2:15 0_2:31 1_3:03 2_4:25",
url: "EVoSo",
id: 13},
{title: "All Blackbird Blackbird.mp3",
duration:"5:06",
segment: "0:14_1 1:49_5 2:35_1 3:55_6",
segment2: "0_0:15 1_1:50 0_2:04 1_2:51 2_3:46 0_3:54 1_5:06",
url: "vZcwa",
id: 14},
{title: "Alex Clare - Too Close (Clark Kent & Kid Ranger Remix).mp3",
duration:"4:37",
segment: "0:27_1 0:54_3 1:07_2 1:20_0 2:16_1 2:30_3 2:57_4 3:11_6",
segment2: "0_0:40 1_1:22 2_2:18 0_2:43 1_3:10 2_4:06 0_4:37",
url: "RenTH",
id: 15},
{title: "Blink 182 - Boxing Day.mp3",
duration:"3:34",
segment: "0:29_1 1:10_2 1:30_0 1:40_1 2:19_2 2:41_5 2:59_6",
segment2: "0_0:09 1_1:30 0_1:40 1_3:01 0_3:22 1_3:34",
url: "TqEbU",
id: 16},
{title: "Future - Magic (ft. T.I.) (E-V Bootleg).mp3",
duration:"3:18",
segment: "0:07_4 0:48_1 1:01_4 1:24_3 1:54_4 2:12_1 2:27_5 2:53_2 3:03_6",
segment2: "0_0:09 1_1:01 2_1:24 1_2:27 2_3:18",
url: "farPl",
id: 17},
{title: "Justin Timberlake - Suit & Tie (ft. JAY Z).mp3",
duration:"5:28",
segment: "0:42_0 1:20_1 1:59_2 2:36_3 3:13_2 4:10_4 04:35_2 4:50_3 5:27_6",
segment2: "0_0:41 1_5:28",
url: "8kUdw",
id: 18},
{title: "Marc Goone - Yung Walter White.mp3",
duration:"3:54",
segment: "0:14_1 0:49_2 0:59_3 1:10_4 1:33_1 1:50_3 2:30_4 2:54_6",
segment2: "0_0:25 1_1:00 0_1:10 1_1:30 0_1:45 1_2:30 2_3:54",
url: "anxfa",
id: 19},
{title: "Miguel - Adorn (Remix) (ft. Wiz Khalifa).mp3",
duration:"3:47",
segment: "0:10_1 1:32_2 1:45_5 2:08_3 2:40_2 2:50_6",
segment2: "1_3:35 0_3:47",
url: "gWXGr",
id: 20},
{title: "Purity Ring - Grammy (Soulja Boy Cover).mp3",
duration:"2:59",
segment: "0:08_2 0:28_1 1:08_3 1:29_0 1:37_2 1:56_3 2:25_4",
segment2: "1_0:29 2_1:30 1_1:59 0_2:17 2_2:35 1_2:59",
url: "v9EBj",
id: 21},
{title: "The Cataracs - Alcohol (ft. Sky Blu).mp3",
duration:"3:36",
segment: "0:06_1 0:21_2 0:35_3 0:50_4 1:06_1 1:21_2 1:37_3 1:51_4 2:08_5 2:55_0 3:17_6",
segment2: "0_0:35 1_0:50 2_1:05 1_1:51 0_2:38 2_3:19 0_3:36",
url: "ZxYzp",
id: 22},
{title: "The Jane Doze - Follow Running Foxes (Zedd vs. Foxes vs. Deniz Koyu vs. Wynter Gordon x Youngblood Hawke).mp3",
duration:"5:48",
segment: "1:00_1 2:00_2 2:11_3 2:59_4 3:45_3 4:29_2 5:14_6",
segment2: "1_0:59 0_2:14 2_3:00 1_4:29 1_5:15 1_5:48",
url: "joB1l",
id: 23},
{title: "The Knocks - The Feeling (Dave Edwards Remix).mp3",
duration:"4:35",
segment: "0:45_1 0:58_2 1:15_4 2:14_1 2:29_2 3:00_4 4:00_6",
segment2: "1_0:30 0_0:42 1_1:14 2_2:15 1_2:30 2_4:24 1_4:35",
url: "qw4PF",
id: 24},
{title: "Ce Ce Peniston vs. Lil' Jon - Finally Machuka (Lil' Jon & K0NTR0L Mash).mp3",
duration:"3:45",
segment: "0:43_1 1:27_2 2:12_3 3:14_5 3:25_6",
segment2: "1_1:29 2_1:50 1_2:26 2_2:45 1_3:45",
url: "LUIWA",
id: 25},
{title: "Flo Rida - Whistle (Vicetone Remix).mp3",
duration:"5:45",
segment: "1:00_2 1:47_5 2:02_1 2:24_2 2:39_5 3:11_0 3:26_1 3:41_2 4:12_3 4:44_6",
segment2: "0_0:29 1_1:46 2_2:02 1_2:41 2_3:12 1_4:12 2_4:44 1_5:14 0_5:45",
url: "rh1LY",
id: 26},
{title: "No Pets Allowed - We Are Never Ever Coming Home Again (Taylor Swift vs. Kanye West).mp3",
duration:"2:51",
segment: "0:47_2 1:20_1 1:51_2 2:40_6",
segment2: "0_0:16 1_0:58 2_1:16 1_2:02 2_2:48 0_2:51",
url: "mjw5A",
id: 27},
{title: "Sebastian Ingrosso & Tommy Trash x Calvin Harris - Reload Nothing (Panic City x Alesso BBC edit).mp3",
duration:"3:23",
segment: "0:44_1 1:15_2 1:44_5 2:45_6",
segment2: "1_0:29 0_0:45 1_1:44 2_2:46 1_3:23",
url: "SoVA6",
id: 28},
{title: "Zedd - Clarity (ft. Foxes) (Basic Physics Remix).mp3",
duration:"6:02",
segment: "1:06_1 1:36_2 2:09_5 2:37_2 2:56_0 3:00_1 3:30_2 4:14_5 5:00_6",
segment2: "0_0:29 1_1:08 0_1:35 1_2:06 2_2:51 0_3:30 1_4:14 2_5:16 1_6:02",
url: "EWaZ2",
id: 29}
];
// for aws S3 we need to replace space by plus
// for(var i=0; i<raw_data.length; i++){
//   raw_data[i].title = encodeURIComponent(raw_data[i].title.replace(/ /g, '+'));
// }
fisherYates(raw_data);





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

function fisherYates ( myArray ) {
  var i = myArray.length, j, tempi, tempj;
  if ( i == 0 ) return false;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     tempi = myArray[i];
     tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


