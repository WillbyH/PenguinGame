ChoreoGraph.AudioController.createSound("footstep0","audio/corn footsteps/0.mp3");
ChoreoGraph.AudioController.createSound("footstep1","audio/corn footsteps/1.mp3");
ChoreoGraph.AudioController.createSound("footstep2","audio/corn footsteps/2.mp3");
ChoreoGraph.AudioController.createSound("footstep3","audio/corn footsteps/3.mp3");
ChoreoGraph.AudioController.createSound("footstep4","audio/corn footsteps/4.mp3");
ChoreoGraph.AudioController.createSound("footstep5","audio/corn footsteps/5.mp3");
ChoreoGraph.AudioController.createSound("achievement","audio/achievement.mp3");

ChoreoGraph.AudioController.createSound("music0","audio/music0.mp3",{autoplay:true});
ChoreoGraph.AudioController.createSound("music1","audio/music1.mp3");

let nextMusicTime = 80000+Math.random()*40000;

cg.createEvent({duration:1,end:function(){
  if (cg.clock>nextMusicTime) {
    nextMusicTime = cg.clock + 80000+Math.random()*40000;
    if (Math.random()>0.5) {
      ChoreoGraph.AudioController.start("music0",0,0,0.3);
    } else {
      ChoreoGraph.AudioController.start("music1",0,0,0.3);
    }
  }
},loop:true});

ChoreoGraph.AudioController.masterVolume = 1;


let penguinGraphicsPackageCount = 0;
function createPenguinGraphicsPackage() {
  let penguinFrames = {
    "southIdle" : {ssX:0,ssY:0,flipX:false},
    "southLeft" : {ssX:0,ssY:1,flipX:false},
    "southRight" : {ssX:0,ssY:1,flipX:true},
    "westIdle" : {ssX:1,ssY:0,flipX:true},
    "westLeft" : {ssX:1,ssY:1,flipX:true},
    "westRight" : {ssX:1,ssY:2,flipX:true},
    "eastIdle" : {ssX:1,ssY:0,flipX:false},
    "eastLeft" : {ssX:1,ssY:1,flipX:false},
    "eastRight" : {ssX:1,ssY:2,flipX:false},
    "northIdle" : {ssX:2,ssY:0,flipX:false},
    "northLeft" : {ssX:2,ssY:1,flipX:false},
    "northRight" : {ssX:2,ssY:1,flipX:true},
  
    "southEastIdle" : {ssX:3,ssY:0,flipX:false},
    "southEastLeft" : {ssX:3,ssY:1,flipX:false},
    "southEastRight" : {ssX:3,ssY:2,flipX:false},
    "southWestIdle" : {ssX:3,ssY:0,flipX:true},
    "southWestLeft" : {ssX:3,ssY:1,flipX:true},
    "southWestRight" : {ssX:3,ssY:2,flipX:true},
    "northEastIdle" : {ssX:4,ssY:0,flipX:false},
    "northEastLeft" : {ssX:4,ssY:1,flipX:false},
    "northEastRight" : {ssX:4,ssY:2,flipX:false},
    "northWestIdle" : {ssX:4,ssY:0,flipX:true},
    "northWestLeft" : {ssX:4,ssY:1,flipX:true},
    "northWestRight" : {ssX:4,ssY:2,flipX:true},
    
    "fishing" : {ssX:0,ssY:2,flipX:false},
    "blink" : {ssX:2,ssY:2,flipX:false},
  }
  
  for (let key in penguinFrames) {
    let frame = penguinFrames[key];
    let penguinImage = cg.createImage({id:"penguinImage_"+key,file:"penguins.png",crop:[frame.ssX*ssg+frame.ssX,frame.ssY*ssg+frame.ssY,ssg,ssg]});
    cg.createGraphic({type:"image",id:"penFrame_"+penguinGraphicsPackageCount+"_"+key,image:penguinImage,width:ssg,height:ssg,imageSmoothingEnabled:false,flipX:frame.flipX});
  }

  let penAnim = {
    "idleSouthEast" : ["southEastIdle"],
    "idleSouth" : ["southIdle"],
    "idleSouthWest" : ["southWestIdle"],
    "idleWest" : ["westIdle"],
    "idleNorthWest" : ["northWestIdle"],
    "idleEast" : ["eastIdle"],
    "idleSouthEast" : ["southEastIdle"],
    "idleNorth" : ["northIdle"],
    "idleNorthEast" : ["northEastIdle"],
  
    "walkSouthEast" : ["southEastLeft","southEastIdle","southEastRight","southEastIdle"],
    "walkSouth" : ["southLeft","southIdle","southRight","southIdle"],
    "walkSouthWest" : ["southWestLeft","southWestIdle","southWestRight","southWestIdle"],
    "walkWest" : ["westLeft","westIdle","westRight","westIdle"],
    "walkNorthWest" : ["northWestLeft","northWestIdle","northWestRight","northWestIdle"],
    "walkEast" : ["eastLeft","eastIdle","eastRight","eastIdle"],
    "walkSouthEast" : ["southEastLeft","southEastIdle","southEastRight","southEastIdle"],
    "walkNorth" : ["northLeft","northIdle","northRight","northIdle"],
    "walkNorthEast" : ["northEastLeft","northEastIdle","northEastRight","northEastIdle"],
  
    "fishing" : ["fishing"],
    "idleSouthBlink" : ["blink"],
    "dharntz" : ["southLeft","southRight","southLeft","southRight","southLeft","southRight","southLeft","southRight","southIdle","southEastLeft","southIdle","southWestIdle","westIdle","northWestIdle","northIdle","northLeft","northRight","northLeft","northRight","northLeft","northRight","northLeft","northRight","northLeft","northRight","northEastIdle","eastIdle","southEastIdle","southIdle","southWestRight","southIdle","southEastIdle","eastIdle","northEastIdle","northIdle","northWestIdle","westIdle","southWestIdle","southIdle","southEastLeft","southIdle","southWestRight","southIdle","southEastLeft","southIdle","southWestRight","southLeft","southRight","southLeft","southRight","southLeft","southRight","southLeft","southRight"],
  };
  for (let key in penAnim) {
    let rawFrames = penAnim[key];
    let frames = [];
    for (let i=0;i<rawFrames.length;i++) {
      frames.push("penFrame_"+penguinGraphicsPackageCount+"_"+rawFrames[i]);
    }
    penAnim[key] = cg.createGraphicAnimation({
      frames:frames,
      GraphicKey:["Graphic","graphic"],
      id:"penguin"+penguinGraphicsPackageCount+"_"+key,
      frameRate:10,
      endCallback:function(object,Animator) {
        if (this.id.endsWith("_dharntz")) {
          Animator.anim = object.penAnim.idleSouth;
          Animator.reset();
        }
      }
    });
  }

  penguinGraphicsPackageCount++;
  return penAnim;
}

for (let i=0;i<8;i++) {
  let image = cg.createImage({id:"smallSplashImage_"+i,file:"smallSplash.png",crop:[8*i,0,8,8]});
  cg.createGraphic({type:"image",id:"smallSplashFrame_"+i,image:image,width:8,height:8,imageSmoothingEnabled:false});
}
cg.createGraphicAnimation({
  frames:["smallSplashFrame_0","smallSplashFrame_1","smallSplashFrame_2","smallSplashFrame_3","smallSplashFrame_4","smallSplashFrame_5","smallSplashFrame_6","smallSplashFrame_7"],
  GraphicKey:["Graphic","graphic"],
  id:"smallSplash",
  frameRate:15
});

ChoreoGraph.graphicTypes.thoughtBubble = new class thoughtBubble {
  setup(g,graphicInit,cg) {
    g.selections = {};
    g.selected = null;
    g.imageSize = 10;

    g.registerSelection = function(id,image,interactionCallback,meta,tooltip="",hotkey="e") {
      let newSelection = {
        id:id,
        interactionCallback:interactionCallback,
        image : image,
        tooltip : tooltip,
        hotkey : hotkey,
        meta : meta
      };
      g.selected = newSelection;
      g.selections[id] = newSelection;
    }
    g.unregisterSelection = function(id) {
      delete g.selections[id];
      if (g.selected?.id==id) {
        if (Object.keys(g.selections).length==0) {
          g.selected = null;
        } else {
          g.selected = g.selections[Object.keys(g.selections)[0]];
        }
      }
    }
  }
  draw(g,cg,ax,ay) {
    if (g.selected==null) { return; }
    cg.c.strokeStyle = "#88bbeb";
    cg.c.fillStyle = "#dddddd";
    cg.c.beginPath();
    cg.c.arc(ax,ay,5,0.8,Math.PI-0.8,true);
    cg.c.lineTo(ax,ay+7);
    cg.c.closePath();
    cg.c.globalAlpha = 0.5;
    cg.c.fill();
    cg.c.globalAlpha = 1;
    cg.c.stroke();
    cg.c.imageSmoothingEnabled = false;
    if (g.selected.image==undefined) { return; }
    cg.drawImage(g.selected.image,ax,ay,g.imageSize,g.imageSize,0,false);
    cg.c.font = "4px Lilita";
    cg.c.textAlign = "left";
    cg.c.strokeStyle = "#ffffff";
    cg.c.fillStyle = "#88bbeb";
    cg.c.lineWidth = 1.5;
    cg.c.strokeText(g.selected.tooltip,ax+2,ay+7);
    cg.c.fillText(g.selected.tooltip,ax+2,ay+7);
  }
}

ChoreoGraph.graphicTypes.fishingLine = new class fishingLine {
  setup(g,graphicInit,cg) {
    g.isFishing = false;
    g.isCast = false;
    g.castTime = 0;
    g.castDuration = 1200;
    g.playSplashNext = true;
    g.nextCatch = 0;
    g.canMakeSnareNoise = true;
    g.FMODEvent = null;
    
    g.isLatched = false;
    g.latchTime = 0;

    g.isCaught = false;
    g.caughtTime = 0;
    g.catchDuration = 1200;

    g.catchInterval = 1400;

    g.minimumCatchWait = 2000;
    g.randomCatchWait = 10000;
    // g.minimumCatchWait = 500;
    // g.randomCatchWait = 1000;

    g.latchState = 0;
    g.latchStateSizes = [0.4,0.2,0.15];

    g.pondId = null;
    g.isFirstSnare = true;

    g.nextFishType = "anchovy";
    g.caughtFishTypes = [];

    g.reregister = function() {
      cg.graphics.thoughtBubble.registerSelection(this.pondId,cg.images.fishingIcon,function(){
        cg.graphics.thoughtBubble.unregisterSelection(this.id);
        Player.fishingLine.isFishing = true;
      },this,"E","e");
    }

    g.tug = function() {
      if (this.isLatched) {
        let latchMarkerHeight = Math.sin((cg.clock-g.latchTime)/500);
        if (Math.abs(latchMarkerHeight)<this.latchStateSizes[this.latchState]) {
          this.latchState++;
          if (this.latchState>=this.latchStateSizes.length) {
            cg.graphics.thoughtBubble.unregisterSelection("tug");
            g.caughtTime = cg.clock;
            Player.fishingLine.FMODEvent.setParameterByName("stage",2,false);
            g.isCaught = true;
          }
        } else {
          cg.graphics.thoughtBubble.unregisterSelection("tug");
          this.reregister();
          this.endCast();
          Player.fishingLine.FMODEvent.stop(ChoreoGraph.FMODConnector.FMOD.STUDIO_STOP_ALLOWFADEOUT);
        }
      }
    }
    g.endCast = function() {
      Player.fishingLine.isFishing = false;
      Player.fishingLine.isCast = false;
      Player.fishingLine.isLatched = false;
      Player.fishingLine.latchState = 0;
      Player.fishingLine.isCaught = false;
      Player.fishingLine.isFirstSnare = true;
      cg.graphics.thoughtBubble.unregisterSelection("tug");
    }
  }
  draw(g,cg,ax,ay) {
    if (!g.isFishing) { return; }
    cg.c.strokeStyle = "#ffffff";
    cg.c.lineWidth = 0.3;
    if (g.isCast&&cg.clock-g.castTime>g.castDuration-300&&g.playSplashNext) {
      g.playSplashNext = false;
      cg.createObject({x:Player.Transform.x,y:Player.Transform.y+24.5})
      .attach("Graphic",{level:4,graphic:cg.graphics.smallSplashFrame_0,master:true})
      .attach("Animator",{anim:cg.animations.smallSplash,selfDestructObject:true})
    }
    if (g.isCast) {
      if (g.isCaught) { // Reeling in line (its pulling up a fish)
        let timeSinceCaught = cg.clock-g.caughtTime;
        let catchHeight = 28.3-28.3*(timeSinceCaught/g.catchDuration);
        cg.c.strokeStyle = "#ffffff";
        cg.c.beginPath();
        cg.c.moveTo(ax,ay-3);
        cg.c.lineTo(ax,ay-3+catchHeight);
        cg.c.stroke();
        cg.c.imageSmoothingEnabled = false;
        let icons = {
          "anchovy" : "fishAnchovyIcon",
          "krill" : "fishKrillIcon",
          "mackerel" : "fishMackerelIcon"
        }
        cg.drawImage(cg.images[icons[Player.fishingLine.nextFishType]],ax,ay-3+catchHeight,cg.z*3,cg.z*3,0,false);
        if (timeSinceCaught>g.catchDuration) {
          g.endCast();
          cg.graphics.inventory.add(g.nextFishType,1);
          if (g.caughtFishTypes.includes(g.nextFishType)==false) {
            cg.graphics.achievements.progress("fishing",1);
          }
          g.caughtFishTypes.push(g.nextFishType);
          g.reregister();
        }
      } else if (cg.clock-g.castTime<g.castDuration) { // Casting line (its falling)
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
        cg.c.beginPath();
        cg.c.moveTo(ax,ay-3);
        let castHeight = getCastHeight((cg.clock-g.castTime),g.castDuration,28.3);
        cg.c.lineTo(ax,ay-3-castHeight);
        cg.c.stroke();
        cg.c.fillStyle = "#db2c00";
        cg.c.fillRect(ax-0.8,ay-3-castHeight,1.6,1.6);
      } else {
        if (g.isLatched) { // Latched (mini game)
          cg.c.beginPath();
          cg.c.moveTo(ax,ay-3);
          let swaySineX = Math.sin((cg.clock-g.latchTime)/2000*2*Math.PI)*2;
          let swaySineY = Math.sin((cg.clock-g.latchTime)/1200*2*Math.PI);
          cg.c.lineTo(ax-swaySineX,ay+25-swaySineY);
          cg.c.stroke();

          cg.c.fillStyle = "#2bc663";
          let latchingHeight = g.latchStateSizes[g.latchState]*20;
          cg.c.fillRect(ax+8,ay-15+10-(latchingHeight/2),6,latchingHeight)
          cg.c.fillStyle = "#f03f96"
          let markerHeight = 0.5;
          let height = Math.sin((cg.clock-g.latchTime)/500)*(10-markerHeight/2);
          cg.c.fillRect(ax+8,ay-15+height+9+markerHeight,6,markerHeight);
          cg.c.strokeStyle = "#000000";
          cg.c.lineWidth = 1;
          cg.c.strokeRect(ax+8,ay-15,6,20);
        } else { // Casted (waiting)
          let lineShake = 0;
          if (cg.clock>g.nextCatch) {
            lineShake = Math.sin((cg.clock-g.latchTime)/400*2*Math.PI)*0.4;
          }
          cg.c.beginPath();
          cg.c.moveTo(ax,ay-3);
          cg.c.lineTo(ax+lineShake,ay+25);
          cg.c.stroke();
          if (cg.clock>g.nextCatch) {
            if (g.nextCatch-cg.clock+g.catchInterval<0) { // Gets called once at the end of a catch interval
              g.nextCatch = cg.clock + g.minimumCatchWait + Math.random()*g.randomCatchWait;
              g.canMakeSnareNoise = true;
              cg.graphics.thoughtBubble.unregisterSelection("grab");
            } else {
              cg.c.fillStyle = "#db2c00";
              cg.c.fillRect(ax-0.8+lineShake,ay+25,1.6,0.8);
              if (g.canMakeSnareNoise) { // Calls once at the start of a catch intervale
                ChoreoGraph.FMODConnector.createEventInstance("event:/Snare",true);
                if (g.isFirstSnare==false) {
                  cg.graphics.thoughtBubble.registerSelection("grab",cg.images.fishingIcon,function(){
                    cg.graphics.thoughtBubble.unregisterSelection("grab");
                    Player.fishingLine.isFishing = true;
                  },this,"E","e");
                }
                g.isFirstSnare = false;
                g.canMakeSnareNoise = false;
              }
            }
          } else {
            cg.c.fillStyle = "#db2c00";
            cg.c.fillRect(ax-0.8+lineShake,ay+24,1.6,1.6);
          }
        }
      }
    } else {
      cg.c.beginPath();
      cg.c.moveTo(ax,ay-3);
      cg.c.lineTo(ax,ay+2.5);
      cg.c.stroke();
    }
  }
}

const Player = cg.createObject({"id":"Player",stopNPC:true,x:0,y:0,
  disableUserMovement : false,
  targetLoc : [0,0],
  targetDir : "south",
  targetCallback : null,
  blinkTime : 0,
  nextBlink : 0,
  lastFootstepSound : 0,
  footstepInterval : 200
});
Player.penAnim = createPenguinGraphicsPackage();
Player.attach("Graphic",{level:2,graphic:Player.penAnim.idleSouth.data[0][1],master:true})
.attach("Graphic",{level:3,graphic:cg.createGraphic({type:"thoughtBubble",id:"thoughtBubble",oy:-17}),master:false})
.attach("Graphic",{level:2,graphic:cg.createGraphic({type:"fishingLine",id:"fishingLineGraphic"}),master:true,keyOverride:"fishingLineGraphic"})
.attach("Animator",{anim:Player.penAnim.idleSouth})
.attach("Collider",{collider:cg.createCollider({type:"circle",id:"playerCollider",radius:6,groups:[0,1],master:true}),oy:5})
.attach("Camera",{offset:{x:0,y:0}})
.attach("RigidBody",{gravity:0,useColliderForPhysics:true});

Player.fishingLine = Player.fishingLineGraphic.graphic;
Player.allowTouchControls = false;


Player.movement = function() {
  let rb = Player.RigidBody;
  let movementSpeed = 80;
  let movementVector = [0,0];
  if (!Player.disableUserMovement) {
    if (onTitleScreen) { return; }
    if (ChoreoGraph.Input.keyStates["w"]||ChoreoGraph.Input.keyStates["up"]) { movementVector[1] -= 1; }
    if (ChoreoGraph.Input.keyStates["s"]||ChoreoGraph.Input.keyStates["down"]) { movementVector[1] += 1; }
    if (ChoreoGraph.Input.keyStates["a"]||ChoreoGraph.Input.keyStates["left"]) { movementVector[0] -= 1; }
    if (ChoreoGraph.Input.keyStates["d"]||ChoreoGraph.Input.keyStates["right"]) { movementVector[0] += 1; }
    if (ChoreoGraph.Input.cursor.hold.any&&Player.allowTouchControls&&fancyCamera.targetOut==false&&cg.buttons.EInteractButton.hovered==false&&cg.buttons.mapButton.hovered==false) {
      movementVector[0] = ChoreoGraph.Input.cursor.x - cg.cw/2;
      movementVector[1] = ChoreoGraph.Input.cursor.y - cg.ch/2;
    }
    if (movementVector[0]!=0||movementVector[1]) { moving(); }
  } else {
    let dx = Player.targetLoc[0]-Player.Transform.x;
    let dy = Player.targetLoc[1]-Player.Transform.y;
    let magnitude = Math.sqrt(dx*dx+dy*dy);
    movementSpeed = Math.min(movementSpeed,magnitude*3);
    if (magnitude>1.5) {
      movementVector = [dx/magnitude,dy/magnitude];
    } else {
      Player.disableUserMovement = false;
      if (Player.targetDir!=null) {
        let newAnimation = null;
        if (Player.targetDir=="east") {
          newAnimation = Player.penAnim.idleEast;
        } else if (Player.targetDir=="west") {
          newAnimation = Player.penAnim.idleWest;
        } else if (Player.targetDir=="south") {
          newAnimation = Player.penAnim.idleSouth;
        } else if (Player.targetDir=="north") {
          newAnimation = Player.penAnim.idleNorth;
        } else if (Player.targetDir=="southEast") {
          newAnimation = Player.penAnim.idleSouthEast;
        } else if (Player.targetDir=="northEast") {
          newAnimation = Player.penAnim.idleNorthEast;
        } else if (Player.targetDir=="southEast") {
          newAnimation = Player.penAnim.idleSouthWest;
        } else if (Player.targetDir=="northEast") {
          newAnimation = Player.penAnim.idleNorthWest;
        }
        if (newAnimation!=null&&newAnimation.id!=Player.Animator.anim.id) {
          Player.Animator.anim = newAnimation;
          Player.Animator.reset();
        }
      }
      if (Player.targetCallback!=null) {
        Player.targetCallback();
      }
    }
  }
  let magnitude = Math.sqrt(movementVector[0]*movementVector[0]+movementVector[1]*movementVector[1]);
  let aimVector = [movementVector[0]/magnitude,movementVector[1]/magnitude];
  if (magnitude>0) {
    movementVector[0] = movementVector[0]/magnitude*movementSpeed;
    movementVector[1] = (movementVector[1]/magnitude)*movementSpeed;
    rb.xv = movementVector[0];
    rb.yv = movementVector[1];
    setWalkingAnimations(aimVector,Player);
    if (cg.clock-Player.lastFootstepSound>Player.footstepInterval) {
      if (Math.random()>0.6) {
        ChoreoGraph.AudioController.start("footstep"+Math.floor(Math.random()*6),0,0,0.08);
      }
      Player.lastFootstepSound = cg.clock;
    }
  } else {
    let currentVelocity = Math.sqrt(rb.xv*rb.xv+rb.yv*rb.yv);
    if (currentVelocity<10) {
      setIdleAnimations(Player,true);
    }
    rb.xv *= Math.min(Math.max(0.05*cg.timeDelta,0),1);
    rb.yv *= Math.min(Math.max(0.05*cg.timeDelta,0),1);
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
    newAnimation = penguin.penAnim.walkSouthEast;
  } else if (aimVector[0]>0.4&&aimVector[1]<-0.4) {
    newAnimation = penguin.penAnim.walkNorthEast;
  } else if (aimVector[0]<-0.4&&aimVector[1]>0.4) {
    newAnimation = penguin.penAnim.walkSouthWest;
  } else if (aimVector[0]<-0.4&&aimVector[1]<-0.4) {
    newAnimation = penguin.penAnim.walkNorthWest;
  } else if (absX>absY&&aimVector[0]>0) {
    newAnimation = penguin.penAnim.walkEast;
  } else if (absX>absY&&aimVector[0]<0) {
    newAnimation = penguin.penAnim.walkWest;
  } else if (absX<absY&&aimVector[1]>0) {
    newAnimation = penguin.penAnim.walkSouth;
  } else if (absX<absY&&aimVector[1]<0) {
    newAnimation = penguin.penAnim.walkNorth;
  }
  if (newAnimation.id!=penguin.Animator.anim.id&&newAnimation!=null) {
    penguin.Animator.anim = newAnimation;
    penguin.Animator.reset();
  }
  penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
}

function setIdleAnimations(penguin,isPlayer=false) {
  let newAnimation = null;
  if (penguin.Animator.anim.id==penguin.penAnim.walkEast.id) {
    newAnimation = penguin.penAnim.idleEast;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkWest.id) {
    newAnimation = penguin.penAnim.idleWest;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkSouth.id) {
    newAnimation = penguin.penAnim.idleSouth;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkNorth.id) {
    newAnimation = penguin.penAnim.idleNorth;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkSouthEast.id) {
    newAnimation = penguin.penAnim.idleSouthEast;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkNorthEast.id) {
    newAnimation = penguin.penAnim.idleNorthEast;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkSouthWest.id) {
    newAnimation = penguin.penAnim.idleSouthWest;
  } else if (penguin.Animator.anim.id==penguin.penAnim.walkNorthWest.id) {
    newAnimation = penguin.penAnim.idleNorthWest;
  }
  
  if (isPlayer) {
    if (penguin.Animator.anim.id==penguin.penAnim.idleSouth.id&&(cg.clock-penguin.blinkTime-2000)/15000>penguin.nextBlink) {
      newAnimation = penguin.penAnim.idleSouthBlink;
      penguin.blinkTime = cg.clock;
      penguin.nextBlink = Math.random();
    } else if (penguin.Animator.anim.id==penguin.penAnim.idleSouthBlink.id&&cg.clock-penguin.blinkTime>100) {
      newAnimation = penguin.penAnim.idleSouth;
    }
    if (penguin.fishingLine.isFishing) {
      newAnimation = penguin.penAnim.fishing;
    }
  }
  if (penguin.nextDharntzTime==undefined) {
    penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
  } else if (penguin.nextDharntzTime<cg.clock) {
    if (Player.fishingLine.isFishing==false) {
      newAnimation = penguin.penAnim.dharntz;
      if (isPlayer) { cg.graphics.achievements.progress("dharntz",1); }
      penguin.Animator.reset();
    }
    penguin.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
  }
  if (newAnimation!=null&&newAnimation.id!=penguin.Animator.anim.id) {
    penguin.Animator.anim = newAnimation;
    penguin.Animator.reset();
  }
}