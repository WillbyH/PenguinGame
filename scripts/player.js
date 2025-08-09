cg.Audio.createSound({source:"corn footsteps/0.mp3"},"footstep0");
cg.Audio.createSound({source:"corn footsteps/1.mp3"},"footstep1");
cg.Audio.createSound({source:"corn footsteps/2.mp3"},"footstep2");
cg.Audio.createSound({source:"corn footsteps/3.mp3"},"footstep3");
cg.Audio.createSound({source:"corn footsteps/4.mp3"},"footstep4");
cg.Audio.createSound({source:"corn footsteps/5.mp3"},"footstep5");
cg.Audio.createSound({source:"achievement.mp3"},"achievement");

cg.Audio.createSound({source:"stones/0.mp3"},"stone0");
cg.Audio.createSound({source:"stones/1.mp3"},"stone1");
cg.Audio.createSound({source:"stones/2.mp3"},"stone2");
cg.Audio.createSound({source:"stones/3.mp3"},"stone3");
cg.Audio.createSound({source:"stones/4.mp3"},"stone4");

cg.Audio.createSound({source:"sticks/0.mp3"},"stick0");
cg.Audio.createSound({source:"sticks/1.mp3"},"stick1");
cg.Audio.createSound({source:"sticks/2.mp3"},"stick2");
cg.Audio.createSound({source:"sticks/3.mp3"},"stick3");
cg.Audio.createSound({source:"sticks/4.mp3"},"stick4");
cg.Audio.createSound({source:"sticks/5.mp3"},"stick5");

cg.Audio.createSound({source:"music0.mp3"},"music0");
cg.Audio.createSound({source:"music1.mp3"},"music1");
cg.Audio.createSound({source:"music2.mp3"},"music2");

cg.Audio.sounds.music0.play({allowBuffer:true,fadeIn:2,volume:1});

let nextMusicTime = 80000+Math.random()*40000;
let nextMusic = {
  LCGx : 643,
  LCGa : 75,
  LCGm : 65537
}
function pickNextMusic() {
  nextMusic.LCGx = (nextMusic.LCGa*nextMusic.LCGx)%nextMusic.LCGm;
  return nextMusic.LCGx % 3;
}
pickNextMusic();

cg.createEvent({
  duration : 1,
  end : () => {
  if (cg.clock>nextMusicTime) {
    nextMusicTime = cg.clock + 80000+Math.random()*40000;
    let next = pickNextMusic();
    if (next==0) {
      cg.Audio.play({id:"music0",volume:0.4});
    } else if (next==1) {
      cg.Audio.play({id:"music1",volume:0.5});
    } else if (next==2){
      cg.Audio.play({id:"music2",volume:0.6});
    }
  }
},loop:true,id:"musicEvent"});

cg.Audio.masterVolume = 1;

let penGraphics = {
  "fishing" : {ssX:0,ssY:2},
  "blink" : {ssX:2,ssY:2},

  "southIdle" : {ssX:0,ssY:0},
  "southStep" : {ssX:0,ssY:1},
  "sideIdle" : {ssX:1,ssY:0},
  "sideStepA" : {ssX:1,ssY:1},
  "sideStepB" : {ssX:1,ssY:2},
  "northIdle" : {ssX:2,ssY:0},
  "northStep" : {ssX:2,ssY:1},
  "southDiagonalIdle" : {ssX:3,ssY:0},
  "southDiagonalStepA" : {ssX:3,ssY:1},
  "southDiagonalStepB" : {ssX:3,ssY:2},
  "northDiagonalIdle" : {ssX:4,ssY:0},
  "northDiagonalStepA" : {ssX:4,ssY:1},
  "northDiagonalStepB" : {ssX:4,ssY:2}
}

for (let key in penGraphics) {
  let frame = penGraphics[key];
  let penguinImage = cg.createImage({id:"penguinImage_"+key,file:"penguins.png",crop:[frame.ssX*ssg+frame.ssX,frame.ssY*ssg+frame.ssY,ssg,ssg]});
  cg.createGraphic({
    type:"image",
    image:penguinImage,
    width:ssg,
    height:ssg,
  },"penguin_"+key);
}

let penFrames = {
  southIdle : ["southIdle",false],
  southLeft : ["southStep",false],
  southRight : ["southStep",true],
  westIdle : ["sideIdle",true],
  westLeft : ["sideStepA",true],
  westRight : ["sideStepB",true],
  eastIdle : ["sideIdle",false],
  eastLeft : ["sideStepA",false],
  eastRight : ["sideStepB",false],
  northIdle : ["northIdle",false],
  northLeft : ["northStep",false],
  northRight : ["northStep",true],

  southEastIdle : ["southDiagonalIdle",false],
  southEastLeft : ["southDiagonalStepA",false],
  southEastRight : ["southDiagonalStepB",false],
  southWestIdle : ["southDiagonalIdle",true],
  southWestLeft : ["southDiagonalStepA",true],
  southWestRight : ["southDiagonalStepB",true],

  northEastIdle : ["northDiagonalIdle",false],
  northEastLeft : ["northDiagonalStepA",false],
  northEastRight : ["northDiagonalStepB",false],
  northWestIdle : ["northDiagonalIdle",true],
  northWestLeft : ["northDiagonalStepA",true],
  northWestRight : ["northDiagonalStepB",true],

  fishing : ["fishing",false],
  blink : ["blink",false]
}

let penAnimations = {
  idleSouthEast : ["southEastIdle"],
  idleSouth : ["southIdle"],
  idleSouthWest : ["southWestIdle"],
  idleWest : ["westIdle"],
  idleNorthWest : ["northWestIdle"],
  idleEast : ["eastIdle"],
  idleSouthEast : ["southEastIdle"],
  idleNorth : ["northIdle"],
  idleNorthEast : ["northEastIdle"],

  walkSouthEast : ["southEastLeft","southEastIdle","southEastRight","southEastIdle"],
  walkSouth : ["southLeft","southIdle","southRight","southIdle"],
  walkSouthWest : ["southWestLeft","southWestIdle","southWestRight","southWestIdle"],
  walkWest : ["westLeft","westIdle","westRight","westIdle"],
  walkNorthWest : ["northWestLeft","northWestIdle","northWestRight","northWestIdle"],
  walkEast : ["eastLeft","eastIdle","eastRight","eastIdle"],
  walkSouthEast : ["southEastLeft","southEastIdle","southEastRight","southEastIdle"],
  walkNorth : ["northLeft","northIdle","northRight","northIdle"],
  walkNorthEast : ["northEastLeft","northEastIdle","northEastRight","northEastIdle"],

  fishing : ["fishing"],
  idleSouthBlink : ["blink"],
  dharntz : ["southLeft","southRight","southLeft","southRight","southLeft","southRight","southLeft","southRight","southIdle","southEastLeft","southIdle","southWestIdle","westIdle","northWestIdle","northIdle","northLeft","northRight","northLeft","northRight","northLeft","northRight","northLeft","northRight","northLeft","northRight","northEastIdle","eastIdle","southEastIdle","southIdle","southWestRight","southIdle","southEastIdle","eastIdle","northEastIdle","northIdle","northWestIdle","westIdle","southWestIdle","southIdle","southEastLeft","southIdle","southWestRight","southIdle","southEastLeft","southIdle","southWestRight","southLeft","southRight","southLeft","southRight","southLeft","southRight","southLeft","southRight","southIdle"],
};
for (let animId in penAnimations) {
  let frameRate = 1 / 15;
  let animation = cg.Animation.createAnimation({},animId);
  let data = [0];
  let lastFlip = false;
  for (let frameId of penAnimations[animId]) {
    let frameData = penFrames[frameId];
    if (lastFlip!=frameData[1]) {
      data.push(["v",["Graphic","transform","flipX"],frameData[1]]); // Flipped
      lastFlip = frameData[1];
    }

    data.push(["v",["Graphic","graphic"],cg.graphics["penguin_"+frameData[0]]]); // Graphic

    data.push([frameRate])
  }
  animation.loadRaw(data,[{keySet:"time"}]);
}

for (let i=0;i<8;i++) {
  let image = cg.createImage({id:"smallSplashImage_"+i,file:"smallSplash.png",crop:[8*i,0,8,8]});
  cg.createGraphic({type:"image",image:image,width:8,height:8,imageSmoothingEnabled:false},"smallSplashFrame_"+i);
}

cg.Animation.createAnimationFromPacked("0&sprite=f:15:Graphic,graphic:smallSplashFrame_0|smallSplashFrame_1|smallSplashFrame_2|smallSplashFrame_3|smallSplashFrame_4|smallSplashFrame_5|smallSplashFrame_6|smallSplashFrame_7",{},"smallSplash");

cg.graphicTypes.thoughtBubble = new class thoughtBubble {
  setup() {
    this.selections = {};
    this.selected = null;
    this.imageSize = 10;

    this.registerSelection = (id,image,interactionCallback,meta,tooltip="",hotkey="e") => {
      let newSelection = {
        id:id,
        interactionCallback:interactionCallback,
        image : image,
        tooltip : tooltip,
        hotkey : hotkey,
        meta : meta
      };
      this.selected = newSelection;
      this.selections[id] = newSelection;
    }
    this.unregisterSelection = (id) => {
      delete this.selections[id];
      if (this.selected?.id==id) {
        if (Object.keys(this.selections).length==0) {
          this.selected = null;
        } else {
          this.selected = this.selections[Object.keys(this.selections)[0]];
        }
      }
    }
  }
  draw(c,ax,ay,canvas) {
    if (this.selected==null||!window.interface.showUI) { return; }
    c.strokeStyle = "#88bbeb";
    c.fillStyle = "#dddddd";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(ax,ay,5,0.8,Math.PI-0.8,true);
    c.lineTo(ax,ay+7);
    c.closePath();
    c.globalAlpha = 0.5;
    c.fill();
    c.globalAlpha = 1;
    c.stroke();
    c.imageSmoothingEnabled = false;
    if (this.selected.image==undefined) { return; }
    canvas.drawImage(this.selected.image,ax,ay,this.imageSize,this.imageSize);
    c.font = "4px Lilita";
    c.textAlign = "left";
    c.strokeStyle = "#ffffff";
    c.fillStyle = "#88bbeb";
    c.strokeText(this.selected.tooltip,ax+2,ay+7);
    c.fillText(this.selected.tooltip,ax+2,ay+7);
  }
}

cg.graphicTypes.fishingLine = new class fishingLine {
  setup() {
    this.isFishing = false;
    this.isCast = false;
    this.castTime = 0;
    this.castDuration = 1200;
    this.playSplashNext = true;
    this.nextCatch = 0;
    this.canMakeSnareNoise = true;
    this.FMODEvent = null;

    this.isLatched = false;
    this.latchTime = 0;

    this.isCaught = false;
    this.caughtTime = 0;
    this.catchDuration = 1200;

    this.catchInterval = 1400;

    this.minimumCatchWait = 2000;
    this.randomCatchWait = 10000;

    this.latchState = 0;
    this.latchStateSizes = {
      "anchovy" : [0.6,0.4,0.3],
      "krill" : [0.4,0.3,0.2],
      "mackerel" : [0.3,0.2,0.1]
    }

    this.pondId = null;
    this.isFirstSnare = true;

    this.nextFishType = "anchovy";
    this.caughtFishTypes = [];
    this.fishCaught = 0;

    this.LCGx = 643;
    this.LCGa = 75;
    this.LCGm = 65537;

    this.reregister = function() {
      cg.graphics.thoughtBubble.registerSelection(this.pondId,cg.images.fishingIcon,function(){
        cg.graphics.thoughtBubble.unregisterSelection(this.id);
        Player.fishingLine.isFishing = true;
      },this,"E","e");
    }

    this.tug = function() {
      if (this.isLatched) {
        let latchMarkerHeight = Math.sin((cg.clock-this.latchTime)/500);
        if (Math.abs(latchMarkerHeight)<this.latchStateSizes[this.nextFishType][this.latchState]) {
          this.latchState++;
          if (this.latchState>=this.latchStateSizes[this.nextFishType].length) {
            cg.graphics.thoughtBubble.unregisterSelection("tug");
            this.caughtTime = cg.clock;
            Player.fishingLine.FMODEvent.setParameterByName("stage",2,false);
            cg.graphics.inventory.add(this.nextFishType,1);
            this.isCaught = true;
          }
        } else {
          cg.graphics.thoughtBubble.unregisterSelection("tug");
          this.reregister();
          this.endCast();
          Player.fishingLine.FMODEvent.stop(ChoreoGraph.FMOD.FMOD.STUDIO_STOP_ALLOWFADEOUT);
        }
      }
    }
    this.endCast = function() {
      Player.fishingLine.isFishing = false;
      Player.fishingLine.isCast = false;
      Player.fishingLine.isLatched = false;
      Player.fishingLine.latchState = 0;
      Player.fishingLine.isCaught = false;
      Player.fishingLine.isFirstSnare = true;
      cg.graphics.thoughtBubble.unregisterSelection("tug");
    }
  }
  draw(c,ax,ay,canvas) {
    if (!this.isFishing) { return; }
    c.strokeStyle = "#ffffff";
    c.lineWidth = 0.3;
    if (this.isCast&&cg.clock-this.castTime>this.castDuration-300&&this.playSplashNext) {
      this.playSplashNext = false;
      cg.scenes.main.addObject(cg.createObject({transformInit:{x:Player.transform.x,y:Player.transform.y+24.5}},"splash")
      .attach("Graphic",{collection:"ui",graphic:cg.graphics.smallSplashFrame_0})
      .attach("Animator",{animation:cg.Animation.animations.smallSplash,loop:false,onEnd:(Animator) => {
        Animator.object.delete();
      }}));
    }
    if (this.isCast) {
      if (this.isCaught) { // Reeling in line (its pulling up a fish)
        let timeSinceCaught = cg.clock-this.caughtTime;
        let catchHeight = 28.3-28.3*(timeSinceCaught/this.catchDuration);
        c.strokeStyle = "#ffffff";
        c.beginPath();
        c.moveTo(ax,ay-3);
        c.lineTo(ax,ay-3+catchHeight);
        c.stroke();
        c.imageSmoothingEnabled = false;
        let icons = {
          "anchovy" : "fishAnchovyIcon",
          "krill" : "fishKrillIcon",
          "mackerel" : "fishMackerelIcon"
        }
        canvas.drawImage(cg.images[icons[Player.fishingLine.nextFishType]],ax,ay-3+catchHeight,canvas.camera.cz*3,canvas.camera.cz*3);
        if (timeSinceCaught>this.catchDuration) {
          this.endCast();
          if (this.caughtFishTypes.includes(this.nextFishType)==false) {
            cg.graphics.achievements.progress("fishing",1);
            cg.graphics.achievements.progress("overfishing",1);
          }
          this.caughtFishTypes.push(this.nextFishType);
          this.reregister();
        }
      } else if (cg.clock-this.castTime<this.castDuration) { // Casting line (its falling)
        function getCastHeight(t,length,heightMultiplyer) {
          t = t/length;
          if (t<0.25) {
            return (Math.sin(4*Math.PI*t-Math.PI/2)/8+0.125)*heightMultiplyer;
          } else if (t<0.8) {
            return (Math.sin(Math.PI*t+Math.PI/4)-0.75)*heightMultiplyer;
          } else {
            return (Math.sin(30*Math.PI+1.6)/(900*(t-0.78))-0.96)*heightMultiplyer;
          }
        }
        c.beginPath();
        c.moveTo(ax,ay-3);
        let castHeight = getCastHeight((cg.clock-this.castTime),this.castDuration,28.3);
        c.lineTo(ax,ay-3-castHeight);
        c.stroke();
        c.fillStyle = "#db2c00";
        c.fillRect(ax-0.8,ay-3-castHeight,1.6,1.6);
      } else {
        if (this.isLatched) { // Latched (mini game)
          c.beginPath();
          c.moveTo(ax,ay-3);
          let swaySineX = Math.sin((cg.clock-this.latchTime)/2000*2*Math.PI)*2;
          let swaySineY = Math.sin((cg.clock-this.latchTime)/1200*2*Math.PI);
          c.lineTo(ax-swaySineX,ay+25-swaySineY);
          c.stroke();

          c.fillStyle = "#2bc663";
          let latchingHeight = this.latchStateSizes[this.nextFishType][this.latchState]*20;
          c.fillRect(ax+8,ay-15+10-(latchingHeight/2),6,latchingHeight)
          c.fillStyle = "#f03f96"
          let markerHeight = 0.5;
          let height = Math.sin((cg.clock-this.latchTime)/500)*(10-markerHeight/2);
          c.fillRect(ax+8,ay-15+height+9+markerHeight,6,markerHeight);
          c.strokeStyle = "#000000";
          c.lineWidth = 1;
          c.strokeRect(ax+8,ay-15,6,20);
        } else { // Casted (waiting)
          let lineShake = 0;
          if (cg.clock>this.nextCatch) {
            lineShake = Math.sin((cg.clock-this.latchTime)/400*2*Math.PI)*0.4;
          }
          c.beginPath();
          c.moveTo(ax,ay-3);
          c.lineTo(ax+lineShake,ay+25);
          c.stroke();
          if (cg.clock>this.nextCatch) {
            if (this.nextCatch-cg.clock+this.catchInterval<0) { // Gets called once at the end of a catch interval
              this.nextCatch = cg.clock + this.minimumCatchWait + Math.random()*this.randomCatchWait;
              this.canMakeSnareNoise = true;
              cg.graphics.thoughtBubble.unregisterSelection("grab");
            } else {
              c.fillStyle = "#db2c00";
              c.fillRect(ax-0.8+lineShake,ay+25,1.6,0.8);
              if (this.canMakeSnareNoise) { // Calls once at the start of a catch intervale
                ChoreoGraph.FMOD.createEventInstance("event:/Snare");
                if (this.isFirstSnare==false) {
                  cg.graphics.thoughtBubble.registerSelection("grab",cg.images.fishingIcon,function(){
                    cg.graphics.thoughtBubble.unregisterSelection("grab");
                    Player.fishingLine.isFishing = true;
                  },this,"E","e");
                }
                this.isFirstSnare = false;
                this.canMakeSnareNoise = false;
              }
            }
          } else {
            c.fillStyle = "#db2c00";
            c.fillRect(ax-0.8+lineShake,ay+24,1.6,1.6);
          }
        }
      }
    } else {
      c.beginPath();
      c.moveTo(ax,ay-3);
      c.lineTo(ax,ay+2.5);
      c.stroke();
    }
  }
}

const Player = cg.createObject({stopNPC:true,x:0,y:0,
  disableUserMovement : false,
  targetLoc : [0,0],
  targetDir : "south",
  targetCallback : null,
  blinkTime : 0,
  nextBlink : 0,
  lastFootstepSound : 0,
  footstepInterval : 200
},"Player")
.attach("Graphic",{
  collection:"ui",
  graphic:cg.graphics.penguin_southIdle,
  master:true
})
.attach("Graphic",{
  master : false,
  collection : "ui",
  transformInit : {oy:-17},
  graphic : cg.createGraphic({
    type : "thoughtBubble"
  },"thoughtBubble")
})
.attach("Graphic",{
  master : true,
  key : "fishingLineGraphic",
  collection : "ui",
  graphic : cg.createGraphic({
    type:"fishingLine",
  },"fishingLineGraphic")
})
.attach("Animator",{animation:cg.Animation.animations.idleSouth})
.attach("RigidBody",{
  drag : 7,
  collider : cg.Physics.createCollider({
    type : "circle",
    radius : 6,
    groups : [0,1],
    transformInit : {oy:5}
  },"playerCollider"),
})
.attach("Camera",{camera:cg.cameras.main,active:false})

Player.fishingLine = Player.fishingLineGraphic.graphic;

cg.scenes.main.addObject(Player);

cg.Input.createAction({keys:["w","up","conleftup","condpadup","conrightup"]},"up");
cg.Input.createAction({keys:["s","down","conleftdown","condpaddown","conrightdown"]},"down");
cg.Input.createAction({keys:["a","left","conleftleft","condpadleft","conrightleft"]},"left");
cg.Input.createAction({keys:["d","right","conrightright","condpadright","conleftright"]},"right");

Player.movement = function() {
  let rb = Player.RigidBody;
  let movementSpeed = 80;
  let movementVector = [0,0];
  if (cg.Input.cursor.hold.any && cg.Input.lastCursorType===ChoreoGraph.Input.TOUCH&&!Player.disableUserMovement) {
    if (cg.Input.buttons.joystick.hovered) {
      let dx = (cg.Input.buttons.joystick.hoveredX-0.5)*5.5;
      let dy = (cg.Input.buttons.joystick.hoveredY-0.5)*5.5;
      if (dx>0) { dx = Math.min(dx,1); } else if (dx<0) { dx = Math.max(dx,-1); }
      if (dy>0) { dy = Math.min(dy,1); } else if (dy<0) { dy = Math.max(dy,-1); }
      movementVector = [dx, dy];
    }
    let magnitude = Math.sqrt(movementVector[0]*movementVector[0] + movementVector[1]*movementVector[1]);
    if (magnitude > 1) {
      movementVector[0] /= magnitude;
      movementVector[1] /= magnitude;
    }
    if (movementVector[0]!=0||movementVector[1]!=0) { moving(); }
  } else if (!Player.disableUserMovement) {
    if (onTitleScreen||interface.pause) { return; }
    cg.graphics.joystick.dir = [0,0];
    movementVector = cg.Input.getActionNormalisedVector("up","down","left","right");
    if (movementVector[0]!=0||movementVector[1]!=0) { moving(); }
  } else {
    let dx = Player.targetLoc[0]-Player.transform.x;
    let dy = Player.targetLoc[1]-Player.transform.y;
    let magnitude = Math.sqrt(dx*dx+dy*dy);
    movementSpeed = Math.min(movementSpeed,magnitude*3);
    if (magnitude>1.5) {
      movementVector = [dx/magnitude,dy/magnitude];
    } else {
      Player.disableUserMovement = false;
      if (Player.targetDir!=null) {
        let newAnimation = null;
        if (Player.targetDir=="east") {
          newAnimation = cg.Animation.animations.idleEast;
        } else if (Player.targetDir=="west") {
          newAnimation = cg.Animation.animations.idleWest;
        } else if (Player.targetDir=="south") {
          newAnimation = cg.Animation.animations.idleSouth;
        } else if (Player.targetDir=="north") {
          newAnimation = cg.Animation.animations.idleNorth;
        } else if (Player.targetDir=="southEast") {
          newAnimation = cg.Animation.animations.idleSouthEast;
        } else if (Player.targetDir=="northEast") {
          newAnimation = cg.Animation.animations.idleNorthEast;
        } else if (Player.targetDir=="southEast") {
          newAnimation = cg.Animation.animations.idleSouthWest;
        } else if (Player.targetDir=="northEast") {
          newAnimation = cg.Animation.animations.idleNorthWest;
        }
        if (newAnimation!=null&&newAnimation.id!=Player.Animator.animation.id) {
          Player.Animator.animation = newAnimation;
          Player.Animator.reset();
        }
      }
      if (Player.targetCallback!=null) {
        Player.targetCallback();
      }
    }
  }
  cg.graphics.joystick.dir = movementVector;
  let magnitude = Math.sqrt(movementVector[0]*movementVector[0]+movementVector[1]*movementVector[1]);
  let aimVector = [movementVector[0]/magnitude,movementVector[1]/magnitude];
  if (magnitude>0) {
    rb.xv = movementVector[0] * movementSpeed;
    rb.yv = movementVector[1] * movementSpeed;
    setWalkingAnimations(aimVector,Player);
    if (cg.clock-Player.lastFootstepSound>Player.footstepInterval) {
      if (Math.random()>0.6) {
        cg.Audio.sounds["footstep"+Math.floor(Math.random()*6)].play({volume:0.08});
      }
      Player.lastFootstepSound = cg.clock;
    }
  } else {
    let currentVelocity = Math.sqrt(rb.xv*rb.xv+rb.yv*rb.yv);
    if (currentVelocity<10) {
      setIdleAnimations(Player,true);
    }
    if (Math.abs(rb.xv)<0.0001) {
      rb.xv = 0;
    }
    if (Math.abs(rb.yv)<0.0001) {
      rb.yv = 0;
    }
  }
}

function setWalkingAnimations(aimVector,penguin) {
  let newAnimation = null;
  let absX = Math.abs(aimVector[0]);
  let absY = Math.abs(aimVector[1]);
  if (aimVector[0]>0.4&&aimVector[1]>0.4) {
    newAnimation = cg.Animation.animations.walkSouthEast;
  } else if (aimVector[0]>0.4&&aimVector[1]<-0.4) {
    newAnimation = cg.Animation.animations.walkNorthEast;
  } else if (aimVector[0]<-0.4&&aimVector[1]>0.4) {
    newAnimation = cg.Animation.animations.walkSouthWest;
  } else if (aimVector[0]<-0.4&&aimVector[1]<-0.4) {
    newAnimation = cg.Animation.animations.walkNorthWest;
  } else if (absX>absY&&aimVector[0]>0) {
    newAnimation = cg.Animation.animations.walkEast;
  } else if (absX>absY&&aimVector[0]<0) {
    newAnimation = cg.Animation.animations.walkWest;
  } else if (absX<absY&&aimVector[1]>0) {
    newAnimation = cg.Animation.animations.walkSouth;
  } else if (absX<absY&&aimVector[1]<0) {
    newAnimation = cg.Animation.animations.walkNorth;
  }
  if (newAnimation.id!=penguin.Animator.animation.id&&newAnimation!=null) {
    penguin.Graphic.transform.flipX = penFrames[penAnimations[newAnimation.id][0]][1];
    penguin.Animator.animation = newAnimation;
    penguin.Animator.reset();
    penguin.Animator.loop = true;
  }
  penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
}

function setIdleAnimations(penguin,isPlayer=false) {
  let oldAnimation = penguin.Animator.animation;
  let newAnimation = null;
  if (oldAnimation.id==cg.Animation.animations.walkEast.id) {
    newAnimation = cg.Animation.animations.idleEast;
  } else if (oldAnimation.id==cg.Animation.animations.walkWest.id) {
    newAnimation = cg.Animation.animations.idleWest;
  } else if (oldAnimation.id==cg.Animation.animations.walkSouth.id) {
    newAnimation = cg.Animation.animations.idleSouth;
  } else if (oldAnimation.id==cg.Animation.animations.walkNorth.id) {
    newAnimation = cg.Animation.animations.idleNorth;
  } else if (oldAnimation.id==cg.Animation.animations.walkSouthEast.id) {
    newAnimation = cg.Animation.animations.idleSouthEast;
  } else if (oldAnimation.id==cg.Animation.animations.walkNorthEast.id) {
    newAnimation = cg.Animation.animations.idleNorthEast;
  } else if (oldAnimation.id==cg.Animation.animations.walkSouthWest.id) {
    newAnimation = cg.Animation.animations.idleSouthWest;
  } else if (oldAnimation.id==cg.Animation.animations.walkNorthWest.id) {
    newAnimation = cg.Animation.animations.idleNorthWest;
  }

  if (isPlayer) {
    if (oldAnimation.id=="dharntz"&&penguin.Animator.playing==false) {
      newAnimation = cg.Animation.animations.idleSouth;
    } else if (oldAnimation.id=="idleSouth"&&(cg.clock-penguin.blinkTime-2000)/15000>penguin.nextBlink) {
      newAnimation = cg.Animation.animations.idleSouthBlink;
      penguin.blinkTime = cg.clock;
      penguin.nextBlink = Math.random();
    } else if (oldAnimation.id=="idleSouthBlink"&&cg.clock-penguin.blinkTime>100) {
      newAnimation = cg.Animation.animations.idleSouth;
    }
    if (penguin.fishingLine.isFishing) {
      newAnimation = cg.Animation.animations.fishing;
    }
  }
  if (penguin.nextDharntzTime==undefined) {
    penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
  } else if (penguin.nextDharntzTime<cg.clock) {
    if (Player.fishingLine.isFishing==false) {
      penguin.Animator.loop = false;
      newAnimation = cg.Animation.animations.dharntz;
      if (isPlayer) { cg.graphics.achievements.progress("dharntz",1); }
      penguin.Animator.reset();
    }
    penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
  }
  if (newAnimation!=null&&newAnimation.id!=penguin.Animator.animation.id) {
    penguin.Animator.paused = false;
    penguin.Animator.loop = newAnimation.id !== "dharntz";
    penguin.Animator.animation = newAnimation;
    penguin.Animator.reset();
  }
}