const cg = ChoreoGraph.instantiate({
  core : {
    baseImagePath : "images/",
    imageSmoothingEnabled : false,
    inactiveTime : 100,
    debugCGScale : 0.5
  },
  input : {
    preventSingleTouch : true,
    preventTouchScrolling : true,
    preventDefaultKeys : ["up","down","left","right","space"]
  },
  audio : {
    baseAudioPath : "audio/",
  }
});

cg.createCamera({
  scaleMode : "maximum",
  size : 600,
  transformInit : {x:2390}
},"main")
.addScene(cg.createScene({},"main"));

cg.scenes.main.createItem("collection",{},"background");
cg.scenes.main.createItem("collection",{},"props");
cg.scenes.main.createItem("collection",{},"entities");
cg.scenes.main.createItem("collection",{},"ui");

cg.createCanvas({element:document.getElementsByTagName("canvas")[0],
  background : "#fafafa"
},"main")
.resizeWithSelf()
.setCamera(cg.cameras.main);

cg.loadChecks.push(function lilitaLoadCheck(){
  cg.canvases.main.c.font = "1px Lilita";
  cg.canvases.main.c.fillText("Hello",-100,-100);
  let loaded = document.fonts.check("1px Lilita");
  return ["lilita",loaded,loaded,1];
})

let ssg = 16; // Spritesheet Grid Size