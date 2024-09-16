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
cg.createImage({id:"fishIcon",file:"icons.png",crop:[4*ssg,0*ssg,1*ssg,1*ssg]});
cg.createImage({id:"snowmanIcon",file:"icons.png",crop:[0*ssg,1*ssg,1*ssg,1*ssg]});
cg.createImage({id:"cliffsSetImage",file:"cliffs.png"});

cg.createImage({id:"detail0",file:"world.png",crop:[0*ssg,2*ssg,3*ssg,2*ssg]});

cg.createGraphic({type:"pointText",id:"collectText",CGSpace:false,x:-50,y:36,canvasSpaceXAnchor:1,canvasSpaceYAnchor:0,colour:"#000000",text:"Collect!",textAlign:"center",font:"15px Arial"});

// const OminousSquare = cg.createObject({"id":"ominousSquare",x:50,y:0})
// .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"rectangle",colour:"#86acff",width:32,height:32}),master:true});

let voidCovers = {
  "top" : cg.createGraphic({type:"rectangle",x:0,y:-1300,width:5000,height:1000,colour:"#3c536d",level:1}),
  "bottom" : cg.createGraphic({type:"rectangle",x:0,y:1300,width:5000,height:1000,colour:"#3c536d",level:1}),
  "left" : cg.createGraphic({type:"rectangle",x:-1700,y:0,width:1500,height:2000,colour:"#3c536d",level:1}),
  "right" : cg.createGraphic({type:"rectangle",x:1700,y:0,width:1500,height:2000,colour:"#3c536d",level:1}),
}

cg.settings.callbacks.loopBefore = function(cg) {
  Player.movement();
  if (showCollectText) {
    cg.addToLevel(4,cg.graphics.collectText);
  }
  if (cliffsMap!=undefined) {
    cg.addToLevel(0,cliffsMap);
  }
  if (fancyCamera.Camera.active) {
    cg.addToLevel(1,voidCovers.top);
    cg.addToLevel(1,voidCovers.bottom);
    cg.addToLevel(1,voidCovers.left);
    cg.addToLevel(1,voidCovers.right);
  }
}
cg.settings.callbacks.loopAfter = function(cg) {
  cg.settings.canvasSpaceScale = cg.cw/1920;
  cg.objects.interface.pauseMenu.graphic.o = interface.pause;

  if (tileMapLoaded==false) {
    cg.settings.callbacks.loadingLoop(cg,Object.keys(cg.images).length);
  }
}

cg.settings.callbacks.keyDown = function(key) {
  if (key=="escape") {
    if (interface.pause) {
      interface.pause = false;
      cg.unpause();
    } else {
      interface.pause = true;
      cg.pause();
    }
  } else if (key=="m") {
    Player.Camera.active = !Player.Camera.active;
    fancyCamera.Camera.active = !fancyCamera.Camera.active;
    fancyCamera.transitionStartTime = cg.clock;
    if (Player.Camera.active) { cg.camera.maximumSize = fancyCamera.zoomedInMaximumSize; }
    else {
      fancyCamera.Transform.x = Player.Transform.x;
      fancyCamera.Transform.y = Player.Transform.y;
    }
  }
  if (cg.graphics.thoughtBubble.selected!=null&&cg.graphics.thoughtBubble.selected.hotkey==key) {
    cg.graphics.thoughtBubble.selected.interactionCallback();
  }
  if (Player.fishingLine.isFishing) {
    if (key=="e") {
      if (Player.fishingLine.isCast) {
        if (!Player.fishingLine.isLatched) {
          if (Player.fishingLine.nextCatch-cg.clock+Player.fishingLine.catchInterval<Player.fishingLine.catchInterval) { // Latch Fish
            cg.graphics.thoughtBubble.registerSelection("tug",cg.images.fishIcon,function(){
              Player.fishingLine.tug();
            },this,"E","e");
            Player.fishingLine.isLatched = true;
            Player.fishingLine.latchTime = cg.clock;
          } else { // Reel In (fail latch)
            Player.fishingLine.isCast = false;
          }
        }
      } else { // Start Cast
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

const fancyCamera = cg.createObject({"id":"fancyCamera",x:-20,y:-30})
.attach("Camera",{x:0,y:0,rotation:0,scale:1.5,smooth:0.1,active:false})
.attach("Script",{updateScript:function(object){
  if (object.Camera.active) {
    if (object.transitionStartTime+object.transitionDuration>cg.clock) { // Transition from zoomed in to zoomed out
      let progress = (cg.clock-object.transitionStartTime)/object.transitionDuration;
      progress = (progress**2)*(3-2*progress);
      cg.camera.maximumSize = object.zoomedInMaximumSize + (object.zoomedOutMaximumSize-object.zoomedInMaximumSize)*progress;
      object.Transform.x = Player.Transform.x + (object.outX-Player.Transform.x)*progress;
      object.Transform.y = Player.Transform.y + (object.outY-Player.Transform.y)*progress;
    }
  }
}});

fancyCamera.zoomedInMaximumSize = 330;
fancyCamera.zoomedOutMaximumSize = 2800;
fancyCamera.transitionDuration = 1000;
fancyCamera.transitionStartTime = 0;
fancyCamera.outX = -20;
fancyCamera.outY = -30;

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
    newSnowHeap.amountLeft = Math.floor(Math.random()*9)+1
    return newSnowHeap;
  }
  createSnowman(x,y) {
    let newPond = cg.createObject({"id":"snowman_"+ChoreoGraph.createId(),stopNPC:true,x:x,y:y})
    .attach("Collider",{collider:cg.createCollider({type:"circle",static:true,radius:11,groups:[0]}),master:true,keyOverride:"PhysicsCollider"})
    .attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"image",image:cg.images.snowman,width:32,height:32,imageSmoothingEnabled:false}),master:true});
    return newPond;
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
  "Stone" : [[-237,29],[-118,-63],[-25,48],[206,204],[440,51],[340,-112],[539,-58],[593,-297],[488,-208],[245,-314],[306,-474],[441,-380],[582,144],[391,374],[153,370],[-82,251],[-68,430],[-347,382],[-182,268],[-433,118],[-612,219],[-717,37],[-316,-252],[-36,-383],[-308,-598],[-405,-431],[-539,-112],[-416,-201],[-589,-311],[-618,-236],[-582,-176]],
  "Stick" : [[-310,-55],[-22,-63],[95,190],[287,150],[337,26],[429,-77],[274,-204],[213,-396],[323,-372],[555,-354],[674,-41],[381,233],[189,286],[67,275],[-104,354],[-319,449],[-494,354],[-669,240],[-548,45],[-335,222],[-281,68],[-374,-52],[-491,-236],[-529,-169],[-582,-399],[-521,-351],[-57,-326],[-96,-474],[-269,-581],[-480,-571],[-441,-435],[-131,-211],[92,23]],
  "Pond" : [[234,73],[-7,404],[-411,304],[-732,-135],[72,-461],[500,221],[608,-169],[-207,-149],[-116,102],[-411,-515]],
  "SnowHeap" : [[-205,164],[365,268],[510,-137],[322,-510],[-235,-316],[-682,118]],
  "Carrot" : [[-205,401],[523,92],[228,-26],[-679,-46],[-402,495],[-28,-457],[661,-231]]
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

let tileMapLoaded = false;
let cliffsMap;
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
    tileMapLoaded = true;
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