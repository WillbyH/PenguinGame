var cg = ChoreoGraph.instantiate(document.getElementsByTagName("canvas")[0],{
  parentElementId : "full",
  levels : 5,
  background : "#fafafa",
  useCamera : true,
  animation : {
    consistentSpeedDefault : false,
    autoFacingDefault : true,
    persistentValuesDefault : true
  },
  preventDefault : ["space","up","down","left","right","tab"],
});

let ssg = 16; // Spritesheet Grid Size
let showCollectText = false;
cg.preventSingleTouch = true;