var sample_color_map = {
  0:"#113F8C",
  1:"#01A4A4",
  2:"#00A1CB",
  3:"#61AE24",
  4:"#D0D102",
  5:"#32742C",
  6:"#D70060",
  7:"#61AE24",
  8:"#E54028",
  9:"#F18D05",
  10:"#616161"
};
var sample_seg_data = [];
// would it be better to generate a number
for(var i=0;i<20;i++){
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
// building the segment bars using an array
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
  },
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
  },
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
  },
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

function ri(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




