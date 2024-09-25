ChoreoGraph.FMODConnector.logging = false;
ChoreoGraph.FMODConnector.baseBankPath = "audio/FMODBanks/";
ChoreoGraph.FMODConnector.registerBank("MasterStrings","","Master.strings.bank");
ChoreoGraph.FMODConnector.registerBank("Master","","Master.bank");
ChoreoGraph.FMODConnector.registerBank("Penguins","","Penguins.bank");
let FMODSheet;
ChoreoGraph.FMODConnector.onInit = function() {
  FMODSheet = ChoreoGraph.FMODConnector.createEventInstance("event:/TheSheet",true);
}
ChoreoGraph.FMODConnector.setUp();

cg.createEvent({duration:1,end:function(){
  let range = 200;
  let maxPenguins = 15;

  let count = 0;
  for (let npc of npcs) {
    let npcX = npc.Transform.x;
    let npcY = npc.Transform.y;
    let playerX = Player.Transform.x;
    let playerY = Player.Transform.y;
    let distance = Math.sqrt((npcX-playerX)**2+(npcY-playerY)**2);
    if (distance<range) {
      count++;
    }
  }

  let amount = (Math.min(count,maxPenguins))/(maxPenguins);
  // console.log(amount,count)
  FMODSheet.setParameterByName("penguins",amount,false);
},loop:true});

ChoreoGraph.AudioController.createSound("placeSnowman","audio/snowman.mp3");
ChoreoGraph.AudioController.createSound("swooshOut","audio/swooshOut.mp3");
ChoreoGraph.AudioController.createSound("swooshIn","audio/swooshIn.mp3");
cg.createImage({id:"pond",file:"world.png",crop:[0*ssg,0*ssg,2*ssg,2*ssg]});
cg.createImage({id:"snowHeap",file:"world.png",crop:[0*ssg,2*ssg,2*ssg,2*ssg]});
cg.createImage({id:"snowman",file:"world.png",crop:[2*ssg,2*ssg,2*ssg,2*ssg]});
cg.createImage({id:"stone0",file:"world.png",crop:[2*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stone1",file:"world.png",crop:[3*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stick0",file:"world.png",crop:[2*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stick1",file:"world.png",crop:[3*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"carrot",file:"world.png",crop:[4*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stoneIcon",file:"icons.png",crop:[0*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stickIcon",file:"icons.png",crop:[1*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"snowIcon",file:"icons.png",crop:[2*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"fishingIcon",file:"icons.png",crop:[3*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"fishAnchovyIcon",file:"icons.png",crop:[4*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"fishKrillIcon",file:"icons.png",crop:[4*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"fishMackerelIcon",file:"icons.png",crop:[4*ssg,2*ssg,1*ssg,1*ssg]});
cg.createImage({id:"snowmanIcon",file:"icons.png",crop:[0*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"penguinIcon",file:"icons.png",crop:[1*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"sealIcon",file:"icons.png",crop:[2*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"stareIcon",file:"icons.png",crop:[3*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"FMOD",file:"FMOD.svg"});
cg.createImage({id:"tiled",file:"tiled.png"});
cg.createImage({id:"ChoreoGraph",file:"cg.png"});
cg.createImage({id:"aseprite",file:"aseprite.png"});

cg.createImage({id:"cliffsSetImage",file:"cliffs.png"});

cg.createImage({id:"detail0",file:"world.png",crop:[0*ssg,2*ssg,3*ssg,2*ssg]});

let onTitleScreen = true;
if (onTitleScreen) {
  cg.objects.interface.titleScreen.graphic.o = 1;
}

let voidCovers = {
  "worldTop" : cg.createGraphic({type:"rectangle",x:0,y:-1300,width:5000,height:1000,colour:"#3c536d",level:1}),
  "worldBottom" : cg.createGraphic({type:"rectangle",x:0,y:1300,width:5000,height:1000,colour:"#3c536d",level:1}),
  "worldLeft" : cg.createGraphic({type:"rectangle",x:-1700,y:0,width:1500,height:2000,colour:"#3c536d",level:1}),
  "worldRight" : cg.createGraphic({type:"rectangle",x:1700,y:0,width:1500,height:2000,colour:"#3c536d",level:1}),
  "titleTop" : cg.createGraphic({type:"rectangle",x:2500,y:-650,width:3000,height:1000,colour:"#3c536d",level:0}),
  "titleBottom" : cg.createGraphic({type:"rectangle",x:2500,y:650,width:3000,height:1000,colour:"#3c536d",level:0}),
  "titleLeft" : cg.createGraphic({type:"rectangle",x:1700,y:0,width:1350,height:2000,colour:"#3c536d",level:0}),
  "titleRight" : cg.createGraphic({type:"rectangle",x:3400,y:0,width:1500,height:2000,colour:"#3c536d",level:0})
}

cg.settings.callbacks.loopBefore = function(cg) {
  Player.movement();
  if (cliffsMap!=undefined) {
    cg.addToLevel(0,cliffsMap);
    cg.addToLevel(1,titleMap);
  }
  if (onTitleScreen) {
    cg.addToLevel(1,voidCovers.titleTop);
    cg.addToLevel(1,voidCovers.titleBottom);
    cg.addToLevel(1,voidCovers.titleLeft);
    cg.addToLevel(1,voidCovers.titleRight);
  } else {
    cg.addToLevel(1,voidCovers.worldTop);
    cg.addToLevel(1,voidCovers.worldBottom);
    cg.addToLevel(1,voidCovers.worldLeft);
    cg.addToLevel(1,voidCovers.worldRight);
  }
}
cg.settings.callbacks.loopAfter = function(cg) {
  cg.settings.canvasSpaceScale = cg.cw/1920;
  if (cg.cw>2500) {
    cg.settings.canvasSpaceScale *= 0.4;
  } else if (cg.cw>1920) {
    cg.settings.canvasSpaceScale *= 0.8;
  }
  cg.objects.interface.pauseMenu.graphic.o = interface.pause;

  if (tileMapsLoaded<2) {
    cg.settings.callbacks.loadingLoop(cg,Object.keys(cg.images).length);
  }
}

cg.settings.callbacks.keyDown = function(key) {
  if (key=="escape"||key=="p"&&!onTitleScreen) {
    if (interface.pause) {
      interface.pause = false;
      cg.objects.interface.inventory.graphic.o = 1;
      cg.objects.interface.controlsTip.graphic.o = 0;
      cg.objects.interface.controlsTipBackground.graphic.o = 0;
      cg.unpause();
    } else {
      interface.pause = true;
      cg.objects.interface.inventory.graphic.o = 0;
      cg.objects.interface.controlsTip.graphic.o = 1;
      cg.objects.interface.controlsTipBackground.graphic.o = 1;
      cg.pause();
    }
  } else if (key=="m") {
    fancyCamera.targetTargetOut = !fancyCamera.targetTargetOut;
  }
  if (cg.graphics.thoughtBubble.selected!=null&&cg.graphics.thoughtBubble.selected.hotkey==key) {
    cg.graphics.thoughtBubble.selected.interactionCallback();
  }
  if (Player.fishingLine.isFishing) {
    if (key=="e") {
      if (Player.fishingLine.isCast) {
        if (!Player.fishingLine.isLatched) {
          if (Player.fishingLine.nextCatch-cg.clock+Player.fishingLine.catchInterval<Player.fishingLine.catchInterval) { // Latch Fish
            let icons = {
              "anchovy" : "fishAnchovyIcon",
              "krill" : "fishKrillIcon",
              "mackerel" : "fishMackerelIcon"
            }
            cg.graphics.thoughtBubble.registerSelection("tug",cg.images[icons[Player.fishingLine.nextFishType]],function(){
              Player.fishingLine.tug();
            },this,"E","e");
            Player.fishingLine.canMakeSnareNoise = true;
            Player.fishingLine.isLatched = true;
            Player.fishingLine.latchTime = cg.clock;
            Player.fishingLine.FMODEvent.setParameterByName("stage",1,false);
          } else { // Reel In (fail latch)
            Player.fishingLine.isCast = false;
            Player.fishingLine.FMODEvent.stop(ChoreoGraph.FMODConnector.FMOD.STUDIO_STOP_ALLOWFADEOUT);
          }
        }
      } else { // Start Cast
        Player.fishingLine.FMODEvent = ChoreoGraph.FMODConnector.createEventInstance("event:/Fishing",true);
        Player.fishingLine.isCast = true;
        Player.fishingLine.castTime = cg.clock;
        Player.fishingLine.playSplashNext = true;
        Player.fishingLine.nextCatch = cg.clock + Player.fishingLine.minimumCatchWait + Math.random()*Player.fishingLine.randomCatchWait;
      }
    }
  }
}

function moving() { // Activated each frame there is active player input movement
  if (Player.fishingLine.isFishing) {
    Player.fishingLine.endCast();
  }
}

for (let i=0;i<24;i++) {
  let image = cg.createImage({id:"sealPopupImage_"+i,file:"sealPopup.png",crop:[16*i,0,16,16]});
  cg.createGraphic({type:"image",id:"sealPopupFrame_"+i,image:image,width:16,height:16,imageSmoothingEnabled:false});
}
cg.createGraphicAnimation({
  frames:["sealPopupFrame_0","sealPopupFrame_1","sealPopupFrame_2","sealPopupFrame_3","sealPopupFrame_4","sealPopupFrame_5","sealPopupFrame_6","sealPopupFrame_7","sealPopupFrame_8","sealPopupFrame_9","sealPopupFrame_10","sealPopupFrame_11"],
  GraphicKey:["Graphic","graphic"],
  id:"sealUp",
  frameRate:15,
  endCallback:function(object,Animator){ Animator.anim = cg.animations.sealPeep; Animator.reset(); }
});
cg.createGraphicAnimation({
  frames:["sealPopupFrame_12"],
  GraphicKey:["Graphic","graphic"],
  id:"sealPeep",
  frameRate:1
});
cg.createGraphicAnimation({
  frames:["sealPopupFrame_23"],
  GraphicKey:["Graphic","graphic"],
  id:"sealWait",
  frameRate:1
});
cg.createGraphicAnimation({
  frames:["sealPopupFrame_13","sealPopupFrame_14","sealPopupFrame_15","sealPopupFrame_16","sealPopupFrame_17","sealPopupFrame_18","sealPopupFrame_19","sealPopupFrame_20","sealPopupFrame_21","sealPopupFrame_22"],
  GraphicKey:["Graphic","graphic"],
  id:"sealDown",
  frameRate:15,
  endCallback:function(object,Animator) {
    Animator.anim = cg.animations.sealWait;
    Animator.reset();
    object.state = 0;
    object.changeTime = cg.clock;
  }
});

const fancyCamera = cg.createObject({"id":"fancyCamera",x:-10,y:-30})
.attach("Camera",{x:0,y:0,rotation:0,scale:1.5,smooth:0.1,active:false})
.attach("Script",{updateScript:function(object){
  if (object.targetTargetOut!=object.targetOut&&object.transitionStartTime+object.transitionDuration<cg.clock) {
    object.transitionStartTime = cg.clock;
    object.targetOut = object.targetTargetOut;
    if (object.targetOut) {
      FMODSheet.setParameterByName("zoomed",1,false);
      ChoreoGraph.AudioController.start("swooshOut",0,0,1.4);
    } else {
      FMODSheet.setParameterByName("zoomed",0,false);
      ChoreoGraph.AudioController.start("swooshIn",0,0,1.4);
    }
  }
  if (object.targetOut) {
    Player.Camera.active = false;
    fancyCamera.Camera.active = true;
    if (object.transitionStartTime+object.transitionDuration>cg.clock) { // Transition from zoomed in to zoomed out
      let progress = (cg.clock-object.transitionStartTime)/object.transitionDuration;
      progress = (progress**2)*(3-2*progress);
      cg.camera.maximumSize = object.zoomedInMaximumSize + (object.zoomedOutMaximumSize-object.zoomedInMaximumSize)*progress;
      object.Transform.x = Player.Transform.x + (object.outX-Player.Transform.x)*progress;
      object.Transform.y = Player.Transform.y + (object.outY-Player.Transform.y)*progress;
    }
  } else {
    if (object.transitionStartTime+object.transitionDuration>cg.clock) { // Transition from zoomed out to zoomed in
      let progress = (cg.clock-object.transitionStartTime)/object.transitionDuration;
      progress = (progress**2)*(3-2*progress);
      cg.camera.maximumSize = object.zoomedOutMaximumSize + (object.zoomedInMaximumSize-object.zoomedOutMaximumSize)*progress;
      object.Transform.x = object.outX + (Player.Transform.x-object.outX)*progress;
      object.Transform.y = object.outY + (Player.Transform.y-object.outY)*progress;
    } else {
      cg.camera.maximumSize = object.zoomedInMaximumSize;
      Player.Camera.active = true;
      fancyCamera.Camera.active = false;
    }
  }
  if (onTitleScreen) {
    Player.Camera.active = false;
    fancyCamera.Camera.active = false;
    titleCamera.Camera.active = true;
    cg.camera.maximumSize = 600;
    cg.objects.pauseObject.leftBox.graphic.o = 0;
    cg.objects.pauseObject.rightBox.graphic.o = 0;
    cg.objects.pauseObject.background.graphic.o = 0;
  } else {
    titleCamera.Camera.active = false;
    cg.objects.pauseObject.leftBox.graphic.o = 1;
    cg.objects.pauseObject.rightBox.graphic.o = 1;
    cg.objects.pauseObject.background.graphic.o = 1;
  }
}});

fancyCamera.zoomedInMaximumSize = 330;
fancyCamera.zoomedOutMaximumSize = 2800;
fancyCamera.transitionDuration = 1000;
fancyCamera.transitionStartTime = -fancyCamera.transitionDuration;
fancyCamera.targetOut = false;
fancyCamera.targetTargetOut = false;
fancyCamera.outX = -10;
fancyCamera.outY = -30;

const titleCamera = cg.createObject({"id":"titleCamera",x:2336,y:-18})
.attach("Camera",{x:2336,y:-18,rotation:0,scale:1,smooth:0.1,active:false});

let LCGx = 74;
let LCGa = 75;
let LCGm = 65537;

const decoratives = new class {
  createDetail0(x,y) {
    let newDetail0 = cg.createObject({"id":"detail0_"+ChoreoGraph.createId(),x:x,y:y})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.detail0,width:3*ssg,height:2*ssg,imageSmoothingEnabled:false}),master:true});
    return newDetail0;
  }
  createPond(x,y) {
    let newPond = cg.createObject({"id":"pond_"+ChoreoGraph.createId(),stopNPC:true,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:11,groups:[0]}),master:true,keyOverride:"PhysicsCollider"})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:25,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.fishingIcon,function(){
            Player.fishingLine.pondId = this.id;
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            Player.disableUserMovement = true;
            Player.targetLoc = [
              this.meta.object.Transform.x,
              this.meta.object.Transform.y - 23
            ];
            Player.targetCallback = function() {
              cg.graphics.thoughtBubble.registerSelection("cast",cg.images.fishingIcon,function(){
                cg.graphics.thoughtBubble.unregisterSelection("cast");
              },this,"E","e");
              Player.fishingLine.isFishing = true;
            }
          },this,"E","e");
        }
      },
      exit:function(collider){
        if (collider==undefined) { return; }
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.unregisterSelection(this.id);
        }
      }}),master:true,keyOverride:"TriggerCollider"})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.pond,width:32,height:32,imageSmoothingEnabled:false}),master:true});
    return newPond;
  }
  createSnowHeap(x,y) {
    let newSnowHeap = cg.createObject({"id":"snowheap_"+ChoreoGraph.createId(),stopNPC:true,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:25,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.snowIcon,function(){
            cg.graphics.inventory.add("snow",1);
            cg.graphics.achievements.progress("hoarder",1);
            this.meta.object.amountLeft--;
            if (this.meta.object.amountLeft<=0) {
              this.meta.object.delete = true;
              cg.graphics.thoughtBubble.unregisterSelection(this.id);
            }
          },this,"E","e");
        }
      },
      exit:function(collider){
        if (collider==undefined) { return; }
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.unregisterSelection(this.id);
        }
      }}),master:true,keyOverride:"TriggerCollider"})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.snowHeap,width:32,height:32,imageSmoothingEnabled:false}),master:true});
    LCGx = (LCGa * LCGx) % LCGm;
    newSnowHeap.amountLeft = LCGx % 8 + 2;
    cg.graphics.achievements.goals.hoarder.goal += newSnowHeap.amountLeft;
    return newSnowHeap;
  }
  createSnowman(x,y) {
    let newSnowman = cg.createObject({"id":"snowman_"+ChoreoGraph.createId(),stopNPC:true,x:x,y:y})
    for (let i=0;i<4;i++) {
      let snowmanImage = cg.createImage({id:"snowmanImage_"+newSnowman.id+"_"+i,file:"world.png",crop:[ssg*2+ssg*2*i,ssg*2,ssg*2,ssg*2]});
      cg.createGraphic({type:"image",id:"snowmanFrame"+newSnowman.id+"_"+i,image:snowmanImage,width:ssg*2,height:ssg*2,imageSmoothingEnabled:false});
    }
    cg.createGraphicAnimation({
      frames:["snowmanFrame"+newSnowman.id+"_0","snowmanFrame"+newSnowman.id+"_1","snowmanFrame"+newSnowman.id+"_2","snowmanFrame"+newSnowman.id+"_2"],
      GraphicKey:["Graphic","graphic"],
      id:"snowmanCreate_"+newSnowman.id,
      frameRate:3,
      endCallback:function(object,Animator) {
        if (this.id.startsWith("snowmanCreate_")) {
          Animator.anim = object.idleAnim;
          Animator.reset();
        }
      }
    });
    newSnowman.idleAnim = cg.createGraphicAnimation({
      frames:["snowmanFrame"+newSnowman.id+"_3"],
      GraphicKey:["Graphic","graphic"],
      id:"snowmanIdle_"+newSnowman.id,
      frameRate:0.1
    });
    newSnowman.attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:11,groups:[0]}),master:true,keyOverride:"PhysicsCollider"})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.snowman,width:32,height:32,imageSmoothingEnabled:false}),master:true})
    .attach("Animator",{anim:cg.animations["snowmanCreate_"+newSnowman.id]});
    
    ChoreoGraph.AudioController.start("placeSnowman",0,0,1);
    return newSnowman;
  }
  createCarrot(x,y) {
    let id = "carrot_"+ChoreoGraph.createId();
    let newCarrot = cg.createObject({"id":id,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:10,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player") {
          if (cg.objects.interface.inventory.graphic.items.stick>=2&&cg.objects.interface.inventory.graphic.items.snow>=6&&cg.objects.interface.inventory.graphic.items.stone>=3) {
            cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.snowmanIcon,function(){
              cg.graphics.thoughtBubble.unregisterSelection(this.id);
              decoratives.createSnowman(this.meta.object.Transform.x,this.meta.object.Transform.y-40);
              this.meta.object.delete = true;
              cg.graphics.inventory.remove("stick",2);
              cg.graphics.inventory.remove("snow",6);
              cg.graphics.inventory.remove("stone",3);
              cg.graphics.achievements.progress("snowman",1);
            },this,"E","e");
          } else {
            cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.snowmanIcon,function(){},this,"Missing Items","e");
          }
        }
      },
      exit:function(collider){
        if (collider==undefined) { return; }
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.unregisterSelection(this.id);
        }
      }}),master:true})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.carrot,width:16,height:16,imageSmoothingEnabled:false}),master:true});
    return newCarrot;
  }
  createStone(x,y) {
    let id = "stone_"+ChoreoGraph.createId();
    let newStone = cg.createObject({"id":id,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:10,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.stoneIcon,function(){
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            cg.graphics.inventory.add("stone",1);
            cg.graphics.achievements.progress("hoarder",1);
            this.meta.object.delete = true;
          },this,"E","e");
        }
      },
      exit:function(collider){
        if (collider==undefined) { return; }
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.unregisterSelection(this.id);
        }
      }}),master:true})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images[["stone0","stone1"][Math.floor(Math.random()*2)]],width:16,height:16,imageSmoothingEnabled:false}),master:true});
    cg.graphics.achievements.goals.hoarder.goal++;
    return newStone;
  }
  createStick(x,y) {
    let id = "stick_"+ChoreoGraph.createId();
    let newStick = cg.createObject({"id":id,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",radius:10,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.registerSelection(this.id,cg.images.stickIcon,function(){
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            cg.graphics.inventory.add("stick",1);
            cg.graphics.achievements.progress("hoarder",1);
            this.meta.object.delete = true;
          },this,"E","e");
        }
      },
      exit:function(collider){
        if (collider==undefined) { return; }
        if (collider.object.id=="Player") {
          cg.graphics.thoughtBubble.unregisterSelection(this.id);
        }
      }}),master:true})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images[["stick0","stick1"][Math.floor(Math.random()*2)]],width:16,height:16,imageSmoothingEnabled:false}),master:true});
    cg.graphics.achievements.goals.hoarder.goal++;
    return newStick;
  }
  createSealPopup(sealX,sealY,triggerX,triggerY) {
    let id = "sealPopup_"+ChoreoGraph.createId();
    let triggerOffsetX = triggerX-sealX;
    let triggerOffsetY = triggerY-sealY;
    let newSeal = cg.createObject({"id":id,x:sealX,y:sealY,state:0,changeTime:0})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.sealPopupImage_12,width:16,height:16,imageSmoothingEnabled:false}),master:true})
    .attach("Collider",{ox:triggerOffsetX,oy:triggerOffsetY,collider:cg.createCollider({type:"circle",radius:20,trigger:true,groups:[1],
      enter:function(collider){
        if (collider.object.id=="Player"&&this.object.state==0&&this.object.changeTime+10000<cg.clock&&Math.random()>0.5) {
          this.object.Animator.anim = cg.animations.sealUp;
          this.object.Animator.reset();
          this.object.state = 1;
          this.object.changeTime = cg.clock;
        }
      }
    }),master:true})
    .attach("Animator",{anim:cg.animations.sealWait})
    .attach("Script",{updateScript:function(object){
      if (object.state==1&&object.changeTime+3000<cg.clock) {
        object.Animator.anim = cg.animations.sealDown;
        object.Animator.reset();
        cg.graphics.achievements.progress("seal",1);
        object.state = 2;
        object.changeTime = cg.clock;
      }
    }});
    return newSeal;
  }
}

decoratives.createSealPopup(92.5,-105.5,52.5,-67);
decoratives.createSealPopup(-687,431,-670,346);
decoratives.createSealPopup(475,-520.5,443.5,-490);
decoratives.createSealPopup(-572,-470,-516,-503.5);
decoratives.createSealPopup(196.5,522.5,198,450.5);

// decoratives.createStone(0,50);
// decoratives.createStone(-150,55);
// decoratives.createStone(20,55);
// decoratives.createStone(-60,60);
// decoratives.createStone(60,80);

// decoratives.createPond(-50,0);

// decoratives.createStick(5,-55);
// decoratives.createStick(40,-55);
// decoratives.createStick(-60,-60);

let objectsToCreate = {
  "Stone" : [[-237,29],[-118,-63],[-25,48],[206,204],[440,51],[340,-112],[539,-58],[593,-297],[488,-208],[245,-314],[306,-474],[441,-380],[391,374],[153,370],[-82,251],[-68,430],[-347,382],[-182,268],[-433,118],[-612,219],[-717,37],[-316,-252],[-36,-383],[-308,-598],[-405,-431]],
  "Stick" : [[-310,-55],[-22,-63],[95,190],[287,150],[337,26],[429,-77],[274,-204],[213,-396],[323,-372],[555,-354],[674,-41],[381,233],[189,286],[67,275],[-104,354],[-319,449],[-494,354],[-669,240],[-548,45],[-335,222],[-281,68],[-374,-52],[-57,-326],[-96,-474],[-269,-581],[-480,-571],[-441,-435],[-131,-211],[92,23]],
  "Pond" : [[234,73],[-7,404],[-411,304],[-732,-135],[72,-461],[500,221],[608,-169],[-207,-149],[-116,102],[-411,-515]],
  "SnowHeap" : [[-205,164],[365,268],[510,-137],[322,-510],[-235,-316],[-682,118],[-357,-602],[94,353],[251,-273]],
  "Carrot" : [[233,446],[523,92],[228,-26],[-679,-46],[-402,495],[-28,-457],[661,-231]]
}

for (let object in objectsToCreate) {
  for (let i=0;i<objectsToCreate[object].length;i++) {
    decoratives["create"+object](objectsToCreate[object][i][0],objectsToCreate[object][i][1]);
  }
}

if (ChoreoGraph.Develop!=undefined) {
  ChoreoGraph.Develop.objectPlacer.registerPrototype("detail0",decoratives.createDetail0,cg.images.detail0);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("pond",decoratives.createPond,cg.images.pond);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("snowHeap",decoratives.createSnowHeap,cg.images.snowHeap);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("snowman",decoratives.createSnowman,cg.images.snowman);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("stone",decoratives.createStone,cg.images.stone0);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("stick",decoratives.createStick,cg.images.stick0);
  ChoreoGraph.Develop.objectPlacer.registerPrototype("carrot",decoratives.createCarrot,cg.images.carrot);
}
// ChoreoGraph.plugins.Visualisation.v.objectAnnotation.active = false;
// ChoreoGraph.plugins.Visualisation.v.objectAnnotation.key = ["lastTargetArriveTime"];
// ChoreoGraph.plugins.Visualisation.v.objectAnnotation.style.textColour="#86acff";
// ChoreoGraph.plugins.Visualisation.v.objectAnnotation.offset[1]=-10;
// ChoreoGraph.plugins.Physics.settings.showColliders = true;

let tileMapsLoaded = 0;
let cliffsMap;
let titleMap;
cg.importTileSetFromFile("data/cliffsSet.json",function(){
  cliffsMap = cg.createGraphic({type:"tileMap",y:16*20});
  cg.importTileMapFromFile("data/cliffsMap.json",function(TileMap) {
    TileMap.cache = true;
    cliffsMap.tileMap = TileMap;
    cliffsMap.layersToDraw = [0,1];
    TileMap.tileWidth = 16;
    TileMap.tileHeight = 16;
    TileMap.dontRound = true;
    TileMap.cachedChunkFudge = 1;
    cg.createCollidersFromTileMap(TileMap,cliffsMap.x,cliffsMap.y,2);
    tileMapsLoaded += 1;
  });
  
  titleMap = cg.createGraphic({type:"tileMap",x:2500});
  cg.importTileMapFromFile("data/titleMap.json",function(TileMap) {
    TileMap.cache = true;
    titleMap.tileMap = TileMap;
    titleMap.layersToDraw = [0,1];
    TileMap.tileWidth = 16;
    TileMap.tileHeight = 16;
    TileMap.dontRound = true;
    TileMap.cachedChunkFudge = 1;
    cg.createCollidersFromTileMap(TileMap,titleMap.x,titleMap.y,2);
    tileMapsLoaded += 1;
  });
});


cg.settings.callbacks.loadingLoop = function(cg,loadedImages) {
  cg.c.fillStyle = "#f2f2f2";
  cg.c.fillRect(0,0,cg.cw,cg.ch);

  cg.c.font = "70px Arial";
  cg.c.fillStyle = "#000000";
  cg.c.textAlign = "center";
  cg.c.fillText("Loading...",cg.cw/2,cg.ch/2-10);  
}

cg.camera.scaleMode = "maximum";
cg.camera.maximumSize = fancyCamera.zoomedInMaximumSize;

ChoreoGraph.start();
// Willby - 2024