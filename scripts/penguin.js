ChoreoGraph.FMOD.logging = false;
ChoreoGraph.FMOD.baseBankPath = "audio/FMODBanks/";
ChoreoGraph.FMOD.registerBank("MasterStrings","Master.strings.bank");
ChoreoGraph.FMOD.registerBank("Master","Master.bank");
ChoreoGraph.FMOD.registerBank("Penguins","Penguins.bank");
let FMODSheet;
ChoreoGraph.FMOD.onInit = function() {
  FMODSheet = ChoreoGraph.FMOD.createEventInstance("event:/TheSheet");
}

cg.createEvent({duration:1,end:function(){
  let range = 200;
  let maxPenguins = 15;

  let count = 0;
  for (let npc of npcs) {
    let npcX = npc.transform.x;
    let npcY = npc.transform.y;
    let playerX = Player.transform.x;
    let playerY = Player.transform.y;
    let distance = Math.sqrt((npcX-playerX)**2+(npcY-playerY)**2);
    if (distance<range) {
      count++;
    }
  }

  let amount = (Math.min(count,maxPenguins))/(maxPenguins);
  FMODSheet?.setParameterByName("penguins",amount,false);
},loop:true});

cg.Audio.createSound({source:"snowman.mp3"},"placeSnowman");
cg.Audio.createSound({source:"swooshOut.mp3"},"swooshOut");
cg.Audio.createSound({source:"swooshIn.mp3"},"swooshIn");

cg.createImage({file:"world.png",crop:[0*ssg,0*ssg,2*ssg,2*ssg]},"pond");
cg.createImage({file:"world.png",crop:[0*ssg,2*ssg,2*ssg,2*ssg]},"snowHeap");
cg.createImage({file:"world.png",crop:[2*ssg,2*ssg,2*ssg,2*ssg]},"snowman");
cg.createImage({file:"world.png",crop:[2*ssg,0*ssg,1*ssg,1*ssg]},"stone0");
cg.createImage({file:"world.png",crop:[3*ssg,0*ssg,1*ssg,1*ssg]},"stone1");
cg.createImage({file:"world.png",crop:[2*ssg,1*ssg,1*ssg,1*ssg]},"stick0");
cg.createImage({file:"world.png",crop:[3*ssg,1*ssg,1*ssg,1*ssg]},"stick1");
cg.createImage({file:"world.png",crop:[4*ssg,0*ssg,1*ssg,1*ssg]},"carrot");
cg.createImage({file:"world.png",crop:[4*ssg,1*ssg,1*ssg,1*ssg]},"fishSkeleton");
cg.createImage({file:"icons.png",crop:[0*ssg,0*ssg,1*ssg,1*ssg]},"stoneIcon");
cg.createImage({file:"icons.png",crop:[1*ssg,0*ssg,1*ssg,1*ssg]},"stickIcon");
cg.createImage({file:"icons.png",crop:[2*ssg,0*ssg,1*ssg,1*ssg]},"snowIcon");
cg.createImage({file:"icons.png",crop:[3*ssg,0*ssg,1*ssg,1*ssg]},"fishingIcon");
cg.createImage({file:"icons.png",crop:[4*ssg,0*ssg,1*ssg,1*ssg]},"fishAnchovyIcon");
cg.createImage({file:"icons.png",crop:[4*ssg,1*ssg,1*ssg,1*ssg]},"fishKrillIcon");
cg.createImage({file:"icons.png",crop:[4*ssg,2*ssg,1*ssg,1*ssg]},"fishMackerelIcon");
cg.createImage({file:"icons.png",crop:[0*ssg,1*ssg,1*ssg,1*ssg]},"snowmanIcon");
cg.createImage({file:"icons.png",crop:[1*ssg,1*ssg,1*ssg,1*ssg]},"penguinIcon");
cg.createImage({file:"icons.png",crop:[2*ssg,1*ssg,1*ssg,1*ssg]},"sealIcon");
cg.createImage({file:"icons.png",crop:[3*ssg,1*ssg,1*ssg,1*ssg]},"stareIcon");
cg.createImage({file:"icons.png",crop:[0*ssg,2*ssg,1*ssg,1*ssg]},"pushIcon");
cg.createImage({file:"icons.png",crop:[1*ssg,2*ssg,1*ssg,1*ssg]},"overfishingIcon");
cg.createImage({file:"FMOD.svg"},"FMOD");
cg.createImage({file:"tiled.png"},"tiled");
cg.createImage({file:"cg.png"},"ChoreoGraph");
cg.createImage({file:"aseprite.png"},"aseprite");
cg.createImage({file:"cliffs.png"},"cliffsSetImage");
cg.createImage({file:"world.png",crop:[0*ssg,2*ssg,3*ssg,2*ssg]},"detail0");

function hidePauseButton() {
  keepPauseButtonHidden = true;
  cg.objects.pauseObject.background.transform.o=0;
  cg.objects.pauseObject.leftBox.transform.o=0;
  cg.objects.pauseObject.rightBox.transform.o=0;
}
let keepPauseButtonHidden = false;
let onTitleScreen = true;
if (onTitleScreen) {
  cg.objects.interface.titleScreen.transform.o = 1;
}

cg.createGraphic({
  type : "polygon",
  path : cg.createPath([[1011,871],[1015,-849],[-995,-842],[-985,915],[1003,865],[1386,2059],[-2299,2222],[-2254,-2167],[4708,-2233],[2797,32],[2797,-125],[2325,-123],[2324,188],[2796,185],[2784,35],[4535,-553],[4481,1781],[1289,2016]],"voidCover"),
  fillColour : "#3a536b",
  stroke : false
},"voidCover");

cg.scenes.main.createItem("graphic",{
  graphic : cg.graphics.voidCover
},"voidCover","background");

cg.callbacks.listen("core","predraw",function(cg) {
  cg.cameras.main.canvasSpaceScale = cg.canvases.main.width/1920;
  if (cg.canvases.main.width<cg.canvases.main.height*0.6) {
    cg.cameras.main.canvasSpaceScale *= 1.5;
  } else if (cg.canvases.main.width>2500) {
    cg.cameras.main.canvasSpaceScale *= 0.4;
  } else if (cg.canvases.main.width>1920) {
    cg.cameras.main.canvasSpaceScale *= 0.8;
  }
  Player.movement();
});
cg.callbacks.listen("core","process",function(cg) {
  if (tileMapsLoaded<2) {
    cg.callbacks.core.loading[0]();
  }
});

function getInteractName() {
  if (cg.Input.lastInputType===ChoreoGraph.Input.CONTROLLER) {
    return ChoreoGraph.Input.controller?.type.buttons[0];
  } else {
    return "E";
  }
}

cg.callbacks.listen("input","keyDown",function(key) {
  if ((key=="escape"||key=="p"||key=="tab"||key=="constart")&&!onTitleScreen) {
    if (interface.pause) {
      interface.pause = false;
      if (window.interface.showUI) { cg.objects.pauseObject.transform.o = 1; }
      cg.objects.interface.pauseMenu.transform.o = 0;
      cg.objects.interface.inventory.transform.o = 1;
      cg.objects.interface.controlsTip.transform.o = 0;
      cg.objects.interface.controlsTipBackground.transform.o = 0;
      cg.settings.core.timeScale = 1;
      cg.objects.interface.pauseMenu.graphic.introMode = false;
    } else {
      interface.pause = true;
      cg.objects.pauseObject.transform.o = 0;
      cg.objects.interface.pauseMenu.transform.o = 1;
      cg.objects.interface.inventory.transform.o = 0;
      cg.objects.interface.controlsTip.transform.o = 1;
      cg.objects.interface.controlsTipBackground.transform.o = 1;
      cg.settings.core.timeScale = 0;
    }
  } else if ((key=="m"||key=="space"||key=="conactiontop")&&!onTitleScreen&&cg.settings.core.timeScale===1) {
    fancyCamera.targetTargetOut = !fancyCamera.targetTargetOut;
  }
  if (cg.Input.lastInputType===ChoreoGraph.Input.CONTROLLER&&cg.objects.interface.pauseMenu.transform.o==1) {
    let state = cg.objects.interface.pauseMenu.graphic.controllerMap[cg.objects.interface.pauseMenu.graphic.controllerSelection];
    if (key=="conactionbottom") {
      cg.Input.buttons[state.press].down();
    } else {
      let udlr = {
        conleftstickup : "up",
        conleftstickdown : "down",
        conleftstickleft : "left",
        conleftstickright : "right",
        conrightstickup : "up",
        conrightstickdown : "down",
        conrightstickleft : "left",
        conrightstickright : "right",
        condpadup : "up",
        condpaddown : "down",
        condpadleft : "left",
        condpadright : "right"
      }[key];
      if (udlr!==undefined) {
        cg.objects.interface.pauseMenu.graphic.controllerSelection = state[udlr];
      }
    }
  }
  let hotkeyAlternatives = {
    e : ["conactionbottom"]
  }
  if (cg.graphics.thoughtBubble.selected!=null&&(cg.graphics.thoughtBubble.selected.hotkey==key||hotkeyAlternatives[cg.graphics.thoughtBubble.selected.hotkey]?.includes(key))) {
    cg.graphics.thoughtBubble.selected.interactionCallback();
  }
  if (Player.fishingLine.isFishing) {
    if (key=="e"||key=="conactionbottom") {
      fishingInteract();
    }
  }
  if (onTitleScreen&&cg.Audio.ready) {
    if (key=="conactionbottom"&&!cg.objects.interface.titleScreen.graphic.showCredits) {
      cg.Input.buttons.play.down();
    } else if (key=="conactiontop") {
      cg.Input.buttons.toggleCreditsButton.down();
    }
  }
});

function fishingInteract() {
  Player.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
  if (Player.fishingLine.isCast) {
    if (!Player.fishingLine.isLatched) {
      if (Player.fishingLine.nextCatch-cg.clock+Player.fishingLine.catchInterval<Player.fishingLine.catchInterval) { // Latch Fish
        Player.fishingLine.LCGx = (Player.fishingLine.LCGa * Player.fishingLine.LCGx) % Player.fishingLine.LCGm;
        Player.fishingLine.nextFishType = ["anchovy","krill","mackerel"][Player.fishingLine.LCGx%3];
        let icons = {
          "anchovy" : "fishAnchovyIcon",
          "krill" : "fishKrillIcon",
          "mackerel" : "fishMackerelIcon"
        }
        cg.graphics.thoughtBubble.registerSelection("tug",cg.images[icons[Player.fishingLine.nextFishType]],function(){
          Player.fishingLine.tug();
        },this,getInteractName());
        Player.fishingLine.canMakeSnareNoise = true;
        Player.fishingLine.isLatched = true;
        Player.fishingLine.latchTime = cg.clock;
        Player.fishingLine.FMODEvent.setParameterByName("stage",1,false);
      } else { // Reel In (fail latch)
        Player.fishingLine.reregister();
        Player.fishingLine.isCast = false;
        Player.fishingLine.FMODEvent.stop(ChoreoGraph.FMOD.FMOD.STUDIO_STOP_ALLOWFADEOUT);
      }
    }
  } else { // Start Cast
    Player.fishingLine.FMODEvent = ChoreoGraph.FMOD.createEventInstance("event:/Fishing");
    Player.fishingLine.isCast = true;
    Player.fishingLine.castTime = cg.clock;
    Player.fishingLine.playSplashNext = true;
    Player.fishingLine.nextCatch = cg.clock + Player.fishingLine.minimumCatchWait + Math.random()*Player.fishingLine.randomCatchWait;
  }
}

function moving() { // Activated each frame there is active player input movement
  if (Player.fishingLine.isFishing) {
    Player.fishingLine.endCast();
    Player.fishingLine.FMODEvent.stop(ChoreoGraph.FMOD.FMOD.STUDIO_STOP_ALLOWFADEOUT);
    cg.graphics.thoughtBubble.registerSelection(Player.fishingLine.pondId,cg.images.fishingIcon,function(){
      cg.graphics.thoughtBubble.unregisterSelection(Player.fishingLine.pondId);
      Player.disableUserMovement = true;
      Player.targetLoc = [
        cg.Physics.colliders[Player.fishingLine.pondId].transform.x,
        cg.Physics.colliders[Player.fishingLine.pondId].transform.y - 23
      ];
      Player.targetCallback = function() {
        fishingInteract();
        Player.fishingLine.isFishing = true;
      }
    },this,getInteractName());
  }
}

for (let i=0;i<24;i++) {
  cg.createGraphic({
    type:"image",
    image:cg.createImage({
      file:"sealPopup.png",
      crop:[16*i,0,16,16]
    },"sealPopupImage_"+i),
    width:16,
    height:16
  },"sealPopupFrame_"+i);
}
cg.Animation.createAnimationFromPacked("0&sprite=f:15:Graphic,graphic:sealPopupFrame_0|sealPopupFrame_1|sealPopupFrame_2|sealPopupFrame_3|sealPopupFrame_4|sealPopupFrame_5|sealPopupFrame_6|sealPopupFrame_7|sealPopupFrame_8|sealPopupFrame_9|sealPopupFrame_10|sealPopupFrame_11",{},"sealUp");

cg.Animation.createAnimationFromPacked("0&sprite=f:15:Graphic,graphic:sealPopupFrame_13|sealPopupFrame_14|sealPopupFrame_15|sealPopupFrame_16|sealPopupFrame_17|sealPopupFrame_18|sealPopupFrame_19|sealPopupFrame_20|sealPopupFrame_21|sealPopupFrame_22",{},"sealDown");

for (let i=0;i<4;i++) {
  cg.createGraphic({type:"image",image:cg.createImage({file:"world.png",crop:[ssg*2+ssg*2*i,ssg*2,ssg*2,ssg*2]},"snowmanImage_"+i),width:ssg*2,height:ssg*2},"snowmanFrame_"+i);
}
cg.Animation.createAnimationFromPacked("0&sprite=f:3:Graphic,graphic:snowmanFrame_0|snowmanFrame_1|snowmanFrame_2|snowmanFrame_3",{},"snowmanCreate");

const fancyCamera = cg.createObject({transformInit:{x:-10,y:-30}},"fancyCamera")
.attach("Camera",{
  camera:cg.cameras.main,
  smooth:0,
  active:false
})
.attach("Script",{updateScript:(object) => {
  if (object.targetTargetOut!=object.targetOut&&object.transitionStartTime+object.transitionDuration<cg.clock) {
    object.transitionStartTime = cg.clock;
    object.targetOut = object.targetTargetOut;
    if (object.targetOut) {
      FMODSheet.setParameterByName("zoomed",1,false);
      cg.Audio.sounds.swooshOut.play({volume:1.4});
    } else {
      FMODSheet.setParameterByName("zoomed",0,false);
      cg.Audio.sounds.swooshIn.play({volume:1.4});
    }
  }
  if (object.targetOut) {
    Player.Camera.active = false;
    fancyCamera.Camera.active = true;
    if (object.transitionStartTime+object.transitionDuration>cg.clock) { // Transition from zoomed in to zoomed out
      let progress = (cg.clock-object.transitionStartTime)/object.transitionDuration;
      progress = (progress**2)*(3-2*progress);
      cg.cameras.main.size = object.zoomedInMaximumSize + (object.zoomedOutMaximumSize-object.zoomedInMaximumSize)*progress;
      object.transform.x = Player.transform.x + (object.outX-Player.transform.x)*progress;
      object.transform.y = Player.transform.y + (object.outY-Player.transform.y)*progress;
    }
  } else {
    if (object.transitionStartTime+object.transitionDuration>cg.clock) { // Transition from zoomed out to zoomed in
      let progress = (cg.clock-object.transitionStartTime)/object.transitionDuration;
      progress = (progress**2)*(3-2*progress);
      cg.cameras.main.size = object.zoomedOutMaximumSize + (object.zoomedInMaximumSize-object.zoomedOutMaximumSize)*progress;
      object.transform.x = object.outX + (Player.transform.x-object.outX)*progress;
      object.transform.y = object.outY + (Player.transform.y-object.outY)*progress;
    } else {
      cg.cameras.main.size = object.zoomedInMaximumSize;
      Player.Camera.active = true;
      fancyCamera.Camera.active = false;
    }
  }
  if (onTitleScreen) {
    Player.Camera.active = false;
    fancyCamera.Camera.active = false;
    cg.cameras.main.size = 600;
    cg.objects.pauseObject.leftBox.transform.o = 0;
    cg.objects.pauseObject.rightBox.transform.o = 0;
    cg.objects.pauseObject.background.transform.o = 0;
  } else {
    if (!keepPauseButtonHidden) {
      cg.objects.pauseObject.leftBox.transform.o = 1;
      cg.objects.pauseObject.rightBox.transform.o = 1;
      cg.objects.pauseObject.background.transform.o = 1;
    }
  }
}});

fancyCamera.zoomedInMaximumSize = 330;
fancyCamera.zoomedOutMaximumSize = 2700;
fancyCamera.transitionDuration = 1000;
fancyCamera.transitionStartTime = -fancyCamera.transitionDuration;
fancyCamera.targetOut = false;
fancyCamera.targetTargetOut = false;
fancyCamera.outX = -10;
fancyCamera.outY = -30;

cg.scenes.main.addObject(fancyCamera);

cg.createGraphic({type:"image",image:cg.images.pond,width:32,height:32},"pond");
cg.createGraphic({type:"image",image:cg.images.detail0,width:3*ssg,height:2*ssg},"detail0");
cg.createGraphic({type:"image",image:cg.images.carrot,width:16,height:16},"carrot");
cg.createGraphic({type:"image",image:cg.images.snowHeap,width:32,height:32},"snowHeap");
cg.createGraphic({"type":"image",image:cg.images.stone0,width:16,height:16},"stone0")
cg.createGraphic({"type":"image",image:cg.images.stone1,width:16,height:16},"stone1")

let LCGx = 74;
let LCGa = 75;
let LCGm = 65537;

const decoratives = new class {
  createDetail0(x,y) {
    let newDetail0 = cg.createObject({stopNPC:true,transformInit:{x:x,y:y}},"detail0")
    .attach("Graphic",{collection:"props",graphic:cg.graphics.detail0});
    return newDetail0;
  }
  createPond(x,y) {
    let newPond = cg.createObject({stopNPC:true,transformInit:{x:x,y:y}},"pond")
    .attach("Graphic",{collection:"props",graphic:cg.graphics.pond});

    newPond.PhysicsCollider = cg.Physics.createCollider({
      type : "circle",
      radius : 11,
      static : true,
      groups : [0],
      object : newPond,
      transformInit : {parent:newPond.transform}
    });

    newPond.TriggerCollider = cg.Physics.createCollider({
      type : "circle",
      radius : 25,
      trigger : true,
      static : true,
      groups : [1],
      object : newPond,
      transformInit : {parent:newPond.transform},
      enter : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.fishingIcon,function(){
            Player.fishingLine.pondId = this.id;
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            Player.disableUserMovement = true;
            Player.targetLoc = [
              self.object.transform.x,
              self.object.transform.y - 23
            ];
            Player.targetCallback = function() {
              fishingInteract();
              Player.fishingLine.isFishing = true;
            }
          },self,getInteractName());
        }
      },
      exit : (self,collider) => {
        if (collider==undefined) { return; }
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.unregisterSelection(self.id);
        }
      }
    });
    cg.scenes.main.addObject(newPond);

    return newPond;
  }
  createSnowHeap(x,y) {
    let newSnowHeap = cg.createObject({stopNPC:true,transformInit:{x:x,y:y}},"snowHeap")
    .attach("Graphic",{collection:"props",graphic:cg.graphics.snowHeap});

    newSnowHeap.TriggerCollider = cg.Physics.createCollider({
      type : "circle",
      radius : 25,
      trigger : true,
      static : true,
      groups : [1],
      object : newSnowHeap,
      transformInit : {parent:newSnowHeap.transform},
      enter : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.snowIcon,function(){
            cg.graphics.inventory.add("snow",1);
            cg.Audio.sounds["footstep"+Math.floor(Math.random()*6)].play({volume:0.1,speed:1.5});
            cg.graphics.achievements.progress("hoarder",1);
            this.meta.object.amountLeft--;
            if (this.meta.object.amountLeft<=0) {
              this.meta.object.TriggerCollider.delete();
              this.meta.object.delete();
              cg.graphics.thoughtBubble.unregisterSelection(this.id);
            }
          },self,getInteractName());
        }
      },
      exit : (self,collider) => {
        if (collider==undefined) { return; }
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.unregisterSelection(self.id);
        }
      }
    });

    LCGx = (LCGa * LCGx) % LCGm;
    newSnowHeap.amountLeft = LCGx % 8 + 2;
    cg.graphics.achievements.goals.hoarder.goal += newSnowHeap.amountLeft;

    cg.scenes.main.addObject(newSnowHeap);

    return newSnowHeap;
  }
  createSnowman(x,y) {
    let newSnowman = cg.createObject({stopNPC:true,transformInit:{x:x,y:y}},"snowman")
    .attach("Graphic",{collection:"props",graphic:cg.createGraphic({"type":"image",image:cg.images.snowman,width:32,height:32})})
    .attach("Animator",{animation:cg.Animation.animations.snowmanCreate,loop:false});

    newSnowman.PhysicsCollider = cg.Physics.createCollider({
      type : "circle",
      radius : 11,
      static : true,
      groups : [0],
      object : newSnowman,
      transformInit : {parent:newSnowman.transform}
    });

    cg.Audio.sounds.placeSnowman.play();

    cg.scenes.main.addObject(newSnowman);
    return newSnowman;
  }
  createCarrot(x,y) {
    let newCarrot = cg.createObject({transformInit:{x:x,y:y}},"carrot")
    .attach("Graphic",{collection:"props",graphic:cg.graphics.carrot});

    newCarrot.TriggerCollider = cg.Physics.createCollider({
      type : "circle",
      radius : 10,
      trigger : true,
      static : true,
      groups : [1],
      object : newCarrot,
      transformInit : {parent:newCarrot.transform},
      enter : (self,collider) => {
        if (collider.id=="playerCollider") {
          if (cg.graphics.inventory.items.stick>=2&&cg.graphics.inventory.items.snow>=6&&cg.graphics.inventory.items.stone>=3) {
            cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.snowmanIcon,function(){
              cg.graphics.thoughtBubble.unregisterSelection(this.id);
              decoratives.createSnowman(this.meta.object.transform.x,this.meta.object.transform.y-40);
              this.meta.object.TriggerCollider.delete();
              this.meta.object.delete();
              cg.graphics.inventory.remove("stick",2);
              cg.graphics.inventory.remove("snow",6);
              cg.graphics.inventory.remove("stone",3);
              cg.graphics.achievements.progress("snowman",1);
            },self,getInteractName());
          } else {
            cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.snowmanIcon,function(){},this,"Missing Items");
          }
        }
      },
      exit : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.unregisterSelection(self.id);
        }
      }
    });

    cg.scenes.main.addObject(newCarrot);
    return newCarrot;
  }
  createStone(x,y) {
    let newStone = cg.createObject({transformInit:{x:x,y:y}},"stone")
    .attach("Graphic",{collection:"props",graphic:cg.graphics[["stone0","stone1"][Math.floor(Math.random()*2)]]});

    cg.graphics.achievements.goals.hoarder.goal++;

    cg.Physics.createCollider({
      type : "circle",
      radius : 10,
      trigger : true,
      static : true,
      groups : [1],
      object : newStone,
      transformInit : {parent:newStone.transform},
      enter : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.stoneIcon,function(){
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            cg.graphics.inventory.add("stone",1);
            cg.Audio.sounds["stone"+Math.floor(Math.random()*5)].play({volume:0.6});
            cg.graphics.achievements.progress("hoarder",1);
            self.delete();
            self.object.delete();
          },this,getInteractName());
        }
      },
      exit : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.unregisterSelection(self.id);
        }
      }
    });

    cg.scenes.main.addObject(newStone);
    return newStone;
  }
  createStick(x,y) {
    let newStick = cg.createObject({transformInit:{x:x,y:y}},"stick")
    .attach("Graphic",{collection:"props",graphic:cg.createGraphic({"type":"image",image:cg.images[["stick0","stick1"][Math.floor(Math.random()*2)]],width:16,height:16})});

    cg.graphics.achievements.goals.hoarder.goal++;

    cg.Physics.createCollider({
      type : "circle",
      radius : 10,
      trigger : true,
      static : true,
      groups : [1],
      object : newStick,
      transformInit : {parent:newStick.transform},
      enter : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.registerSelection(self.id,cg.images.stickIcon,function(){
            cg.graphics.thoughtBubble.unregisterSelection(this.id);
            cg.graphics.inventory.add("stick",1);
            cg.Audio.sounds["stick"+Math.floor(Math.random()*6)].play({volume:0.6});
            cg.graphics.achievements.progress("hoarder",1);
            self.delete();
            self.object.delete();
          },this,getInteractName());
        }
      },
      exit : (self,collider) => {
        if (collider.id=="playerCollider") {
          cg.graphics.thoughtBubble.unregisterSelection(self.id);
        }
      }
    });

    cg.scenes.main.addObject(newStick);
    return newStick;
  }
  createFishSkeleton(x,y) {
    let newFish = cg.createObject({transformInit:{x:x,y:y}},"fishSkeleton")
    .attach("Graphic",{collection:"props",graphic:cg.createGraphic({"type":"image",image:cg.images.fishSkeleton,width:16,height:16})});
    cg.scenes.main.addObject(newFish);
    return newFish;
  }
  createSealPopup(sealX,sealY,triggerX,triggerY) {
    let triggerOffsetX = triggerX-sealX;
    let triggerOffsetY = triggerY-sealY;
    let newSeal = cg.createObject({state:0,changeTime:0,transformInit:{x:sealX,y:sealY}},"sealPopup")
    .attach("Graphic",{collection:"props",graphic:null})
    .attach("Animator",{animation:null,loop:false,onEnd:function(Animator) {
      const object = Animator.object;
      object.changeTime = cg.clock;
      if (object.state==1) {
        object.Graphic.graphic = cg.graphics.sealPopupFrame_12;
      } else if (object.state==2) {
        Animator.animation = null;
        object.Graphic.graphic = null;
        object.state = 0;
      }
    }})
    .attach("Script",{updateScript:(object) => {
      if (object.state==1&&object.changeTime+3000<cg.clock) {
        object.Animator.animation = cg.Animation.animations.sealDown;
        object.Animator.restart();
        cg.graphics.achievements.progress("seal",1);
        object.state = 2;
        object.changeTime = cg.clock;
      }
    }});

    newSeal.trigger = cg.Physics.createCollider({
      type : "circle",
      radius : 20,
      trigger : true,
      static : true,
      groups : [1],
      object : newSeal,
      transformInit : {parent:newSeal.transform,ox:triggerOffsetX,oy:triggerOffsetY},
      enter : (self,collider) => {
        if (collider.id=="playerCollider"&&self.object.state==0&&((self.object.changeTime+10000<cg.clock&&Math.random()>0.5))) {
          self.object.Animator.animation = cg.Animation.animations.sealUp;
          self.object.Animator.restart();
          ChoreoGraph.FMOD.createEventInstance("event:/Seal");
          self.object.state = 1;
          self.object.changeTime = cg.clock;
        }
      }
    });

    cg.scenes.main.addObject(newSeal);
    return newSeal;
  }
}

decoratives.createSealPopup(92.5,-105.5,52.5,-67);
decoratives.createSealPopup(-687,431,-670,346);
decoratives.createSealPopup(475,-520.5,443.5,-490);
decoratives.createSealPopup(-572,-470,-516,-503.5);
decoratives.createSealPopup(168,516.5,189,454.5);

let objectsToCreate = {
  "Stone" : cg.createPath([[-237,29],[-118,-63],[-25,48],[206,204],[440,51],[340,-112],[539,-58],[593,-297],[488,-208],[245,-314],[306,-474],[441,-380],[391,374],[153,370],[-82,251],[-68,430],[-347,382],[-182,268],[-433,118],[-612,219],[-717,37],[-316,-252],[-36,-383],[-308,-598],[-405,-431]],"stones"),
  "Stick" : cg.createPath([[-310,-55],[-22,-63],[95,190],[287,150],[337,26],[429,-77],[274,-204],[213,-396],[323,-372],[555,-354],[674,-41],[381,233],[189,286],[67,275],[-104,354],[-319,449],[-494,354],[-669,240],[-548,45],[-335,222],[-281,68],[-374,-52],[-57,-326],[-96,-474],[-269,-581],[-480,-571],[-441,-435],[-131,-211],[92,23]],"sticks"),
  "Pond" : cg.createPath([[234,73],[-7,404],[-411,304],[-732,-135],[72,-461],[500,221],[608,-169],[-207,-149],[-116,102],[-411,-515]],"ponds"),
  "SnowHeap" : cg.createPath([[-205,164],[365,268],[510,-137],[322,-510],[-235,-316],[-682,118],[-357,-602],[94,353],[251,-273]],"snowHeap"),
  "Carrot" : cg.createPath([[233,446],[523,92],[228,-26],[-679,-46],[-402,495],[-28,-457],[661,-231]],"carrot"),
  "FishSkeleton" : cg.createPath([[182,450],[-665,327],[-503,-506],[49,-67],[433,-477]],"fishSkeletons")
}

for (let object in objectsToCreate) {
  for (let i=0;i<objectsToCreate[object].length;i++) {
    decoratives["create"+object](objectsToCreate[object][i][0],objectsToCreate[object][i][1]);
  }
}

let tileMapsLoaded = 0;
let cliffsMap;
let titleMap;
cg.Tiled.importTileSetFromFile("data/cliffsSet.json",function(){
  cg.Tiled.importTileMapFromFile({
    dataUrl : "data/cliffsMap.json",
    offsetX : -15,
    offsetY : 10
  }, (tilemap) => {
    cliffsMap = cg.createGraphic({
      type : "tilemap",
      tilemap : tilemap,
      debug : false,
      visibleLayers : ["Ground","Cliff"]
    },"cliffsMap");

    cg.scenes.main.createItem("graphic",{
      graphic : cliffsMap
    },"cliffsMap","background");

    cg.Physics.createCollidersFromTilemap(tilemap,2);
    tileMapsLoaded += 1;
  });

  cg.Tiled.importTileMapFromFile({
    dataUrl : "data/titleMap.json",
    offsetX : 145,
    offsetY : -8
  }, (tilemap) => {
    titleMap = cg.createGraphic({
      type : "tilemap",
      tilemap : tilemap,
      debug : false,
      visibleLayers : ["Ground","Cliff"]
    },"titleMap");

    cg.scenes.main.createItem("graphic",{
      graphic : titleMap
    },"titleMap","background");

    cg.Physics.createCollidersFromTilemap(tilemap,2);
    tileMapsLoaded += 1;
  });
});

cg.callbacks.listen("core","loading",function(checkResults) {
  let loaded = 0;
  let total = 0;
  for (let category in checkResults) {
    const result = checkResults[category];
    loaded += result.loaded;
    total += result.total;
  }
  let c = cg.canvases.main.c;
  c.fillStyle = "#3c536d";
  c.fillRect(0,0,cg.cw,cg.ch);

  c.save();
  let scaler = cg.cw/1920;
  let logoScale = 5*scaler;
  c.imageSmoothingEnabled = false;
  c.drawImage(cg.images.titleImage.image,cg.cw/2-(160*logoScale)/2,cg.ch/2-(80*logoScale)/2-20,160*logoScale,80*logoScale);
  c.translate(cg.cw/2,cg.ch/2);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = "50px Lilita";
  c.fillStyle = "#f1f1f1";
  c.fillText("loading assets " + loaded + "/" + total,0,300*scaler);
  c.restore();
});

// Willby - 2025