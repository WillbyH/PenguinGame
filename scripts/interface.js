const interface = {
  pause : false,
  showUI : true
}
window.interface = interface;

cg.createObject({transformInit:{x:70,y:70,CGSpace:false,o:0}},"pauseObject")
.attach("Graphic",{collection:"ui",transformInit:{ox:0,CGSpace:false},graphic:cg.createGraphic({"type":"rectangle",fill:true,colour:"#fafafa",height:80,width:80}),key:"background"})
.attach("Graphic",{collection:"ui",transformInit:{ox:-20,CGSpace:false},graphic:cg.createGraphic({"type":"rectangle",fill:false,lineWidth:4,colour:"black",height:60,width:20}),key:"leftBox"})
.attach("Graphic",{collection:"ui",transformInit:{ox:20,CGSpace:false},graphic:cg.createGraphic({"type":"rectangle",fill:false,lineWidth:4,colour:"black",height:60,width:20}),key:"rightBox"});

cg.Input.createButton({
  type : "circle",
  radius : 60,
  check : "gameplay",
  transformInit : {CGSpace:false,parent:cg.objects.pauseObject.transform},
  enter : () => {
    cg.objects.pauseObject.leftBox.graphic.colour = "#88bbeb";
    cg.objects.pauseObject.rightBox.graphic.colour = "#88bbeb";
  },
  exit : () => {
    cg.objects.pauseObject.leftBox.graphic.colour = "black";
    cg.objects.pauseObject.rightBox.graphic.colour = "black";
  },
  down : () => {
    interface.pause = true;
    cg.objects.interface.pauseMenu.transform.o = 1;
    cg.objects.interface.controlsTip.transform.o = 1;
    cg.objects.interface.controlsTipBackground.transform.o = 1;
    cg.objects.interface.inventory.transform.o = 0;
    cg.objects.interface.achievements.transform.o = 1;
    cg.objects.pauseObject.transform.o = 0;
    cg.settings.core.timeScale = 0;
  }
},"pauseButton");

cg.scenes.main.addObject(cg.objects.pauseObject);

cg.graphicTypes.pauseMenu = new class pauseMenu {
  setup() {
    this.resumeHover = false;
    this.titleHover = false;

    this.toggleMuteHover = false;
    this.toggleUIHover = false;

    this.introMode = true;

    this.controllerSelection = 0;
    this.controllerMap = {
      0 : {
        up : 0,
        down : 1,
        left : 0,
        right : 0,
        press : "resumeButton"
      },
      1 : {
        up : 0,
        down : 2,
        left : 0,
        right : 0,
        press : "titleButton"
      },
      2 : {
        up : 1,
        down : 2,
        left : 0,
        right : 0,
        press : "toggleAudioButton"
      }
    }
  }
  draw(c,ax,ay) {
    Player.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;

    c.textBaseline = "alphabetic";
    c.globalAlpha = 0.2;
    let scale = cg.cameras.main.canvasSpaceScale;
    c.fillStyle = "#000000";
    c.fillRect(ax-cg.canvases.main.width/scale/2,ay-cg.canvases.main.height/scale/2,cg.canvases.main.width/scale,cg.ch/scale);

    c.fillStyle = "#ffffff";
    c.globalAlpha = 0.8;
    c.beginPath();
    c.roundRect(ax-400,ay-400,800,800,10);
    c.fill();

    c.globalAlpha = 1;
    c.strokeStyle = "#88bbeb";
    if (this.controllerSelection===0&&cg.Input.lastInputType===ChoreoGraph.Input.CONTROLLER) {
      c.strokeStyle = "#0c7eeb";
    }
    c.fillStyle = "#fffffff";
    c.lineWidth = 10;
    c.beginPath();
    c.roundRect(ax-300,ay-150,600,150,5);
    c.fill();
    c.stroke();
    c.strokeStyle = "#88bbeb";
    if (this.controllerSelection===1&&cg.Input.lastInputType===ChoreoGraph.Input.CONTROLLER) {
      c.strokeStyle = "#0c7eeb";
    }
    c.beginPath();
    c.roundRect(ax-300,ay+40,600,150,5);
    c.fill();
    c.stroke();
    c.fillStyle = "#88bbeb";
    c.globalAlpha = 0.5;
    if (this.resumeHover) {
      c.beginPath();
      c.roundRect(ax-300,ay-150,600,150,5);
      c.fill();
    }
    if (this.titleHover) {
      c.beginPath();
      c.roundRect(ax-300,ay+40,600,150,5);
      c.fill();
    }
    c.globalAlpha = 1;

    if (this.controllerSelection===2&&cg.Input.lastInputType===ChoreoGraph.Input.CONTROLLER) {
      c.strokeStyle = "#0c7eeb";
      c.beginPath();
      c.roundRect(ax-280,ay+237,240,120,5);
      c.stroke();
    }

    c.font = "100px Lilita";
    c.fillStyle = "#333333";
    c.textAlign = "center";
    if (this.introMode) {
      c.fillText("WELCOME",ax,ay-225);
    } else {
      c.fillText("PAUSED",ax,ay-225);
    }
    c.textBaseline = "middle";
    c.font = "60px Lilita";
    if (this.introMode) {
      c.fillText("Begin",ax,ay-75);
    } else {
      c.fillText("Resume",ax,ay-75);
    }
    c.fillText("Return to Title",ax,ay+115);

    if (this.toggleMuteHover) { c.fillStyle = "#88bbeb"; } else { c.fillStyle = "#333333"; }
    c.fillText(cg.Audio.masterVolume>0 ? "Mute" : "Unmute",ax-160,ay+300);
    if (this.toggleUIHover) { c.fillStyle = "#88bbeb"; } else { c.fillStyle = "#333333"; }
    c.fillText(window.interface.showUI ? "Hide UI" : "Show UI",ax+160,ay+300);
  }
}
cg.graphicTypes.inventory = new class inventory {
  setup() {
    this.items = {};
    this.images = {
      "stone" : "stoneIcon",
      "stick" : "stickIcon",
      "anchovy" : "fishAnchovyIcon",
      "krill" : "fishKrillIcon",
      "mackerel" : "fishMackerelIcon",
      "snow" : "snowIcon"
    }
    this.itemNames = {
      "stone" : "Stone",
      "stick" : "Stick",
      "anchovy" : "Anchovy",
      "krill" : "Krill",
      "mackerel" : "Mackerel",
      "snow" : "Snow"
    }
    this.padX = 10;
    this.padY = 10;
    this.circleRadius = 50;
    this.spacing = 105;
    this.textX = 0.9;
    this.textY = 1.1;
    this.imageSize = 80;

    this.pickupDisplay = {};
    this.pickupDisplayTime = 0;
    this.pickupDisplayDuration = 3000;
    this.pickupDisplayFadeOutDuration = 200;
    this.pickupDisplayY = 300;
    this.pickupDisplayX = 20;

    this.add = function(item,amount) {
      if (this.items[item]) {
        this.items[item] += amount;
      } else {
        this.items[item] = amount;
      }
      if (this.pickupDisplay[item]) {
        this.pickupDisplay[item] += amount;
      } else {
        this.pickupDisplay[item] = amount;
      }
      this.pickupDisplayTime = cg.clock;
    }
    this.remove = function(item,amount) {
      if (this.items[item]) {
        this.items[item] -= amount;
        if (this.items[item]<=0) {
          delete this.items[item];
        }
      }
      if (this.pickupDisplay[item]) {
        this.pickupDisplay[item] -= amount;
      } else {
        this.pickupDisplay[item] = -amount;
      }
      this.pickupDisplayTime = cg.clock;
    }
  }
  draw(c,ax,ay,canvas) {
    if (!window.interface.showUI) { return; }
    c.textBaseline = "alphabetic";
    let column = 0;
    for (let itemId in this.items) {
      c.fillStyle = "#eeeeee";
      c.globalAlpha = 0.8;
      c.beginPath();
      c.arc(-this.circleRadius-this.padX-column*this.spacing,this.circleRadius+this.padY,this.circleRadius,0,Math.PI*2);
      c.fill();
      c.globalAlpha = 1;
      c.imageSmoothingEnabled = false;
      canvas.drawImage(cg.images[this.images[itemId]],-this.circleRadius-this.padX-column*this.spacing,this.circleRadius+this.padY,this.imageSize,this.imageSize);
      c.font = "40px Lilita";
      c.fillStyle = "#88bbeb";
      c.strokeStyle = "#ffffff";
      c.lineWidth = 10;
      c.textAlign = "left";
      c.strokeText(this.items[itemId],-this.padX-(column*this.spacing)-(this.circleRadius*2)*this.textX,(this.circleRadius*2)*this.textY+this.padY);
      c.fillText(this.items[itemId],-this.padX-(column*this.spacing)-(this.circleRadius*2)*this.textX,(this.circleRadius*2)*this.textY+this.padY);
      column++;
    }
    if (this.pickupDisplayTime + this.pickupDisplayDuration > cg.clock) {
      if (this.pickupDisplayTime + this.pickupDisplayDuration - this.pickupDisplayFadeOutDuration < cg.clock) {
        c.globalAlpha = 1-((cg.clock - this.pickupDisplayTime - this.pickupDisplayDuration + this.pickupDisplayFadeOutDuration)/this.pickupDisplayFadeOutDuration);
      }
      let row = 0;
      for (let itemId in this.pickupDisplay) {
        if (this.pickupDisplay[itemId]==0) { continue; }
        c.fillStyle = "#88bbeb";
        c.font = "40px Lilita";
        c.textAlign = "right";
        let plusMinus = "";
        if (this.pickupDisplay[itemId] > 0) {
          plusMinus = "+";
        }
        c.fillText(this.itemNames[itemId],-this.padX-75-this.pickupDisplayX,this.pickupDisplayY+row*40);
        c.fillText(plusMinus + this.pickupDisplay[itemId],-this.padX-this.pickupDisplayX,this.pickupDisplayY+row*40);
        row++;
      }
    } else {
      this.pickupDisplay = {};
    }
  }
}
cg.graphicTypes.touchControls = new class touchControls {
  setup() {
    this.mapHover = false;
    this.eInteractHover = false;
  }
  draw(c,ax,ay) {
    if (cg.Input.lastInputType!=ChoreoGraph.Input.TOUCH||cg.settings.core.timeScale!=1||onTitleScreen||!window.interface.showUI) { return; }
    c.textBaseline = "alphabetic";
    c.strokeStyle = "#88bbeb";
    if (this.mapHover||ChoreoGraph.Input.keyStates.m) { c.fillStyle = "#88bbeb"; } else { c.fillStyle = "#fafafa"; }
    c.lineWidth = 20;
    let mapLoc = [-180,-320];
    let ELoc = [-280,-160];
    c.beginPath();
    c.arc(mapLoc[0],mapLoc[1],70,0,Math.PI*2);
    c.globalAlpha = 0.7;
    c.fill();
    c.globalAlpha = 1;
    c.stroke();
    if (this.eInteractHover||ChoreoGraph.Input.keyStates.e) { c.fillStyle = "#88bbeb"; } else { c.fillStyle = "#fafafa"; }
    c.beginPath();
    c.arc(ELoc[0],ELoc[1],70,0,Math.PI*2);
    c.globalAlpha = 0.7;
    c.fill();
    c.globalAlpha = 1;
    c.stroke();
    c.fillStyle = "#333333";
    c.font = "50px Lilita";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("MAP", mapLoc[0],mapLoc[1]+1);
    c.fillText("E", ELoc[0],ELoc[1]+1);
  }
}

cg.graphicTypes.joystick = new class JoyStick {
  setup() {
    this.dir = [0,0];
  };
  draw(c,ax,ay) {
    if (cg.Input.lastInputType!=ChoreoGraph.Input.TOUCH||cg.settings.core.timeScale!=1||onTitleScreen||!window.interface.showUI) { return; }
    c.fillStyle = "black";
    c.strokeStyle = "white";
    c.lineWidth = 10;
    c.globalAlpha = 0.05
    c.beginPath();
    c.arc(0,0,150,0,Math.PI*2);
    c.fill();
    c.globalAlpha = 0.6;
    c.beginPath();
    c.arc(150*this.dir[0],150*this.dir[1],40,0,Math.PI*2);
    c.fill();
    c.stroke();
  };
};

cg.createImage({file:"play.png",crop:[0*ssg,0*ssg,8*ssg,4*ssg]},"playUnhoveredImage");
cg.createImage({file:"play.png",crop:[0*ssg,4*ssg,8*ssg,4*ssg]},"playHoveredImage");
cg.createImage({file:"title.png"},"titleImage")

for (let i=0;i<7;i++) {
  let splashImage = cg.createImage({id:"titleSplashImage"+i,file:"playSplash.png",crop:[0,ssg*4*i,ssg*8,ssg*4]});
  cg.createGraphic({
    type:"image",
    image:splashImage,
    width:ssg*8,
    height:ssg*4,
    imageSmoothingEnabled:false
  },"titleSplash"+i);
}

cg.Animation.createAnimationFromPacked("0&sprite=f:8:playSplash,graphic:titleSplash1|titleSplash2|titleSplash3|titleSplash4|titleSplash5|titleSplash6",{},"titleSplash");

cg.graphicTypes.titleScreen = new class titleScreen {
  setup() {
    this.playHover = false;
    this.creditsToggleHover = false;
    this.showCredits = false;
  }
  draw(c,ax,ay,canvas) {
    c.textBaseline = "alphabetic";
    c.fillStyle = "#fafafa";
    let scaler = 5;
    c.imageSmoothingEnabled = false;
    let creditsToggleText = "CREDITS";
    if (this.showCredits) {
      creditsToggleText = "BACK";
      c.imageSmoothingEnabled = true;
      canvas.drawImage(cg.images.FMOD,300,250,1004*0.3,264*0.3);
      canvas.drawImage(cg.images.tiled,960,250,811*0.3,427*0.3);
      c.imageSmoothingEnabled = false;
      canvas.drawImage(cg.images.ChoreoGraph,750,250+5,400*0.3,400*0.3);
      canvas.drawImage(cg.images.aseprite,570,250,400*0.35,400*0.35);
      c.font = "50px Lilita";
      c.textAlign = "center";
      c.fillText("A game made by Willby",580,-200);
      c.font = "30px Lilita";
      c.fillText("Penguin sounds by al.barbosa",580,-100);
      c.fillText("Wave sounds from Zapspat",580,-50);
      c.fillText("Controller Prompts by Nicolae (XELU) Berbece",580,0);
    } else {
      let playImage = this.playHover ? cg.images.playHoveredImage : cg.images.playUnhoveredImage;
      canvas.drawImage(playImage,600,200,8*ssg*scaler,4*ssg*scaler);
      canvas.drawImage(cg.images.titleImage,600,-200,10*ssg*scaler,5*ssg*scaler);
    }

    if (this.creditsToggleHover) { c.fillStyle = "#88bbeb"; }
    else { c.fillStyle = "#fafafa"; }
    c.font = "40px Lilita";
    c.textAlign = "left";
    c.fillText(creditsToggleText,100,(cg.ch/2)/cg.cameras.main.canvasSpaceScale-80);
  }
}
// Freesound - 150861 150865
// Zapsplat - https://www.zapsplat.com/music/distant-stormy-ocean-waves-with-surf/

cg.graphicTypes.controlsTip = new class controlsTip {
  setup() {
    this.playHover = false;
  }
  draw(c,ax,ay) {
    c.textBaseline = "alphabetic";
    c.fillStyle = "#fafafa";
    c.font = "30px Lilita";
    c.textAlign = "right";
    c.fillText("WASD - Move      M - Open Map      P - Pause / See Achievements",-20,-20);
  }
}
cg.graphicTypes.achievements = new class achievements {
  setup() {
    this.goals = {
      "dharntz" : {
        name : "Dance Club",
        description : "Wait for yourself to start dancing",
        completed : false,
        icon : "penguinIcon",
        goal : 1,
        current : 0,
        hidden : false
      },
      "fishing" : {
        name : "Two Fish",
        description : "Catch two types of fish",
        completed : false,
        icon : "fishingIcon",
        goal : 2,
        current : 0,
        hidden : false
      },
      "hoarder" : {
        name : "Hoarder",
        description : "Collect all items in the world",
        completed : false,
        icon : "stoneIcon",
        goal : 0, // Gets set by other code
        current : 0,
        hidden : false
      },
      "snowman" : {
        name : "Do you wanna",
        description : "Build a snowman",
        completed : false,
        icon : "snowmanIcon",
        goal : 1,
        current : 0,
        hidden : false
      },
      "seal" : {
        name : "Seal Encounter",
        description : "Spot a seal in the water",
        completed : false,
        icon : "sealIcon",
        goal : 1,
        current : 0,
        hidden : false
      },
      "push" : {
        name : "Push and Shove",
        description : "They refuse to fall in",
        completed : false,
        icon : "pushIcon",
        goal : 1,
        current : 0,
        hidden : true
      },
      "overfishing" : {
        name : "Dedicated Fish Finder",
        description : "Catch 70 fish",
        completed : false,
        icon : "overfishingIcon",
        goal : 70,
        current : 0,
        hidden : true
      },
      "finish" : {
        name : "Finish the Game",
        description : "Get all achievements",
        completed : false,
        icon : "stareIcon",
        goal : 5,
        current : 0,
        hidden : true
      }
    };
    this.padX = 10;
    this.padY = 10;
    this.width = 500;
    this.height = 100;
    this.borderRadius = 20;
    this.spacing = 20;
    this.textX = 100;
    this.textY = 10;
    this.imageSize = 80;
    this.iconX = 50;
    this.iconY = 80;
    this.progressY = 47;

    this.currentGoalPopup = null;
    this.goalPopupTime = 0;

    this.goalPopupInDuration = 1000;
    this.goalPopupStayDuration = 3000;
    this.goalPopupOutDuration = 1000;

    this.popupY = 100;

    this.progress = function(goal,amount) {
      if (this.goals[goal]==undefined) { console.warn("Goal",goal,"does not exist."); return; }
      this.goals[goal].current = Math.min(this.goals[goal].current+amount,this.goals[goal].goal);
      if (this.goals[goal].current >= this.goals[goal].goal && this.goals[goal].completed == false) {
        this.goals[goal].completed = true;
        if (!this.goals[goal].hidden) {
          cg.createEvent({duration:this.goalPopupInDuration+this.goalPopupStayDuration+this.goalPopupStayDuration+1000,end:function(){
            cg.graphics.achievements.progress("finish",1);
          }});
        }
        cg.Audio.sounds.achievement.play({volume:0.4});
        this.currentGoalPopup = goal;
        this.goalPopupTime = cg.clock;
      }
    }
  }
  draw(c,ax,ay,canvas) {
    if (!window.interface.showUI) { return; }
    c.textBaseline = "alphabetic";
    c.textAlign = "left";
    if (cg.settings.core.timeScale==0||(cg.objects.interface.pauseMenu.graphic.introMode&&window.interface.pause)) {
      let row = 0;
      for (let goalId in this.goals) {
        let goal = this.goals[goalId];
        if (goal.hidden&&goal.completed==false) { continue; }
        c.fillStyle = "#eeeeee";
        c.globalAlpha = 0.8;
        c.beginPath();
        c.roundRect(-this.borderRadius-this.padX-this.width,row*(this.spacing+this.height)+this.borderRadius+this.padY,this.width,this.height,this.borderRadius);
        c.fill();
        c.globalAlpha = 1;
        c.font = "30px Lilita";
        c.fillStyle = "#333333";
        c.fillText(goal.name,-this.borderRadius-this.padX-this.width+this.textX,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY);
        if (goal.completed) {
          c.strokeStyle = "#333333";
          c.lineWidth = 5;
          c.lineCap = "round";
          c.beginPath();
          c.moveTo(-this.borderRadius-this.padX-this.width+this.textX,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY-8);
          c.lineTo(-this.borderRadius-this.padX-this.width+this.textX+c.measureText(goal.name).width,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY-12);
          c.stroke();
        }
        if (goal.current > 0 && goal.goal != goal.current) {
          c.lineWidth = 5;
          c.lineCap = "round";
          c.strokeStyle = "#7f7f7f";
          c.beginPath();
          c.moveTo(-this.borderRadius-this.padX-this.width+this.textX,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY+this.progressY);
          let maxWidth = this.width-this.iconX*2-40;
          c.lineTo(-this.borderRadius-this.padX-this.width+this.textX+maxWidth,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY+this.progressY);
          c.stroke();
          c.strokeStyle = "#88bbeb";
          c.beginPath();
          c.moveTo(-this.borderRadius-this.padX-this.width+this.textX,this.height/2+row*(this.spacing+this.height)+this.padY+this.textY+this.progressY);
          c.lineTo(-this.borderRadius-this.padX-this.width+this.textX+maxWidth*(goal.current/goal.goal),this.height/2+row*(this.spacing+this.height)+this.padY+this.textY+this.progressY);
          c.stroke();
        }
        c.font = "20px Lilita";
        c.fillStyle = "#666666";
        c.fillText(goal.description,-this.borderRadius-this.padX-this.width+this.textX,(this.height/2+row*(this.spacing+this.height)+this.padY+this.textY)+30);
        c.imageSmoothingEnabled = false;
        c.globalAlpha = 0.8;
        c.fillStyle = "#fafafa";
        c.beginPath();
        c.arc(-this.borderRadius-this.padX-this.width+this.iconX,row*(this.spacing+this.height)+this.iconY,this.imageSize/2,0,Math.PI*2);
        c.fill();
        c.globalAlpha = 1;
        canvas.drawImage(cg.images[goal.icon],-this.borderRadius-this.padX-this.width+this.iconX,row*(this.spacing+this.height)+this.iconY,this.imageSize,this.imageSize);
        row++;
      }
    } else if (this.currentGoalPopup!=null&&this.goalPopupTime+this.goalPopupInDuration+this.goalPopupStayDuration+this.goalPopupOutDuration>cg.clock) {
      let offsetProportion = 0;
      let offDistance = this.width + this.padX + 50;
      let crossOutProportion = 0;
      if (this.goalPopupTime+this.goalPopupInDuration+this.goalPopupStayDuration < cg.clock) {
        // Transition Out
        crossOutProportion = 1;
        offsetProportion = 1-((cg.clock-this.goalPopupTime-this.goalPopupInDuration-this.goalPopupStayDuration)/this.goalPopupOutDuration);
        offsetProportion = (offsetProportion**2)*(3-2*offsetProportion);
      } else if (this.goalPopupTime+this.goalPopupInDuration < cg.clock) {
        // Stay
        offsetProportion = 1;
        crossOutProportion = (cg.clock-this.goalPopupTime-this.goalPopupInDuration)/this.goalPopupStayDuration;
        crossOutProportion = Math.cbrt((crossOutProportion-0.5)/4)+0.5;
      } else if (this.goalPopupTime < cg.clock) {
        // Transition In
        offsetProportion = (cg.clock-this.goalPopupTime)/this.goalPopupInDuration;
        offsetProportion = (offsetProportion**2)*(3-2*offsetProportion);
      }
      let xOffset = offDistance*(1-offsetProportion);
      c.fillStyle = "#eeeeee";
      c.globalAlpha = 0.8;
      c.beginPath();
      c.roundRect(-this.borderRadius-this.padX-this.width+xOffset,this.borderRadius+this.padY+this.popupY,this.width,this.height,this.borderRadius);
      c.fill();
      c.globalAlpha = 1;
      c.font = "30px Lilita";
      c.fillStyle = "#333333";
      c.fillText(this.goals[this.currentGoalPopup].name,-this.borderRadius-this.padX-this.width+this.textX+xOffset,this.height/2+this.padY+this.textY+this.popupY);
      c.strokeStyle = "#333333";
      c.lineWidth = 5;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(-this.borderRadius-this.padX-this.width+this.textX+xOffset,this.height/2+this.padY+this.textY-10+this.popupY);
      c.lineTo(-this.borderRadius-this.padX-this.width+this.textX+xOffset+(crossOutProportion*c.measureText(this.goals[this.currentGoalPopup].name).width),this.height/2+this.padY+this.textY-10+this.popupY);
      c.stroke();
      c.font = "20px Lilita";
      c.fillStyle = "#666666";
      c.fillText(this.goals[this.currentGoalPopup].description,-this.borderRadius-this.padX-this.width+this.textX+xOffset,(this.height/2+this.padY+this.textY)+30+this.popupY);
      c.imageSmoothingEnabled = false;
      canvas.drawImage(cg.images[this.goals[this.currentGoalPopup].icon],-this.borderRadius-this.padX-this.width+this.iconX+xOffset,this.iconY+this.popupY,this.imageSize,this.imageSize);
    }
  }
}

cg.createImage({file:"controllers/Xbox_A.png"},"xboxA");
cg.createImage({file:"controllers/Xbox_B.png"},"xboxB");
cg.createImage({file:"controllers/Xbox_X.png"},"xboxX");
cg.createImage({file:"controllers/Xbox_Y.png"},"xboxY");
cg.createImage({file:"controllers/PS_Cross.png"},"psCross");
cg.createImage({file:"controllers/PS_Triangle.png"},"psTriangle");
cg.createImage({file:"controllers/Left_Stick.png"},"leftStick");
cg.createImage({file:"controllers/Menu.png"},"menu");

cg.graphicTypes.controllerHints = new class controllerHints {
  draw(c,ax,ay) {
    let hints = [];
    if (cg.Input.lastInputType!==ChoreoGraph.Input.CONTROLLER) { return }

    if (onTitleScreen) {
      c.fillStyle = "#ffffff";
      if (cg.Audio.ready) {
        let creditsButtonName = "Credits";
        if (cg.objects.interface.titleScreen.graphic.showCredits) {
          creditsButtonName = "Back";
        } else {
          if (ChoreoGraph.Input.controller.type.buttons[0]=="A") {
            hints.push([cg.images.xboxA,"Play"]);
          } else if (ChoreoGraph.Input.controller.type.buttons[0]=="B") {
            hints.push([cg.images.xboxB,"Play"]);
          } else {
            hints.push([cg.images.psCross,"Play"]);
          }
        }
        if (ChoreoGraph.Input.controller.type.buttons[3]=="Y") {
          hints.push([cg.images.xboxY,creditsButtonName]);
        } else if (ChoreoGraph.Input.controller.type.buttons[3]=="X") {
          hints.push([cg.images.xboxX,creditsButtonName]);
        } else {
          hints.push([cg.images.psTriangle,creditsButtonName]);
        }
      }
    } else if (cg.settings.core.timeScale==1) {
      c.fillStyle = "#333333";
      hints.push([cg.images.leftStick,"Movement"]);
      if (ChoreoGraph.Input.controller.type.buttons[0]=="A") {
        hints.push([cg.images.xboxA,"Interact"]);
      } else if (ChoreoGraph.Input.controller.type.buttons[0]=="B") {
        hints.push([cg.images.xboxB,"Interact"]);
      } else {
        hints.push([cg.images.psCross,"Interact"]);
      }
      if (fancyCamera.targetTargetOut) {
        if (ChoreoGraph.Input.controller.type.buttons[3]=="Y") {
          hints.push([cg.images.xboxY,"Close Map"]);
        } else if (ChoreoGraph.Input.controller.type.buttons[3]=="X") {
          hints.push([cg.images.xboxX,"Close Map"]);
        } else {
          hints.push([cg.images.psTriangle,"Close Map"]);
        }
      } else {
        if (ChoreoGraph.Input.controller.type.buttons[3]=="Y") {
          hints.push([cg.images.xboxY,"Open Map"]);
        } else if (ChoreoGraph.Input.controller.type.buttons[3]=="X") {
          hints.push([cg.images.xboxX,"Open Map"]);
        } else {
          hints.push([cg.images.psTriangle,"Open Map"]);
        }
      }
      hints.push([cg.images.menu,"Pause"]);
    } else {
      c.fillStyle = "#333333";
      hints.push([cg.images.menu,"Resume"]);
      hints.push([cg.images.leftStick,"Navigate"]);
      if (ChoreoGraph.Input.controller.type.buttons[0]=="A") {
        hints.push([cg.images.xboxA,"Select"]);
      } else if (ChoreoGraph.Input.controller.type.buttons[0]=="B") {
        hints.push([cg.images.xboxB,"Select"]);
      } else {
        hints.push([cg.images.psCross,"Select"]);
      }
    }

    c.miterLimit = 2;
    c.lineWidth = 8;
    c.strokeStyle = "#ffffff";
    c.font = "25px Lilita";
    c.textAlign = "left";
    c.textBaseline = "middle";
    for (let i=0;i<hints.length;i++) {
      let image = hints[i][0];
      let text = hints[i][1];
      if (!onTitleScreen) { c.strokeText(text,ax+60,ay+32+i*55-5); }
      c.drawImage(image.image,ax,ay+i*55,50,50);
      c.fillText(text,ax+60,ay+32+i*55-5);
    }
  }
}

cg.createObject({transformInit:{CGSpace:false}},"interface")
.attach("Graphic",{
  key:"pauseMenu",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,o:0},
  graphic:cg.createGraphic({type:"pauseMenu",imageSmoothingEnabled:true},"pauseMenu")
})
.attach("Graphic",{
  key:"controllerHints",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:0,canvasSpaceYAnchor:0,x:30,y:140},
  graphic:cg.createGraphic({type:"controllerHints",imageSmoothingEnabled:true},"controllerHints")
})
.attach("Graphic",{
  key:"inventory",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:1,canvasSpaceYAnchor:0,o:0},
  graphic:cg.createGraphic({type:"inventory"},"inventory")
})
.attach("Graphic",{
  key:"touchControls",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:1,canvasSpaceYAnchor:1},
  graphic:cg.createGraphic({type:"touchControls"},"touchControls")
})
.attach("Graphic",{
  key:"joystick",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,x:260,y:-260},
  graphic:cg.createGraphic({type:"joystick"},"joystick")
})
.attach("Graphic",{
  key:"titleScreen",
  collection:"ui",
  transformInit : {o:0,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5},
  graphic:cg.createGraphic({type:"titleScreen"},"titleScreen")
})
.attach("Graphic",{
  key:"controlsTipBackground",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:1,canvasSpaceYAnchor:1,ox:-20,oy:-20,o:0},
  graphic:cg.createGraphic({
    type : "pointText",
    textAlign : "right",
    lineWidth : 4,
    fill : false,
    colour : "#c8c8c8",
    miterLimit : 2,
    fontFamily : "Lilita",
    fontSize : 30,
    text : "WASD - Move      M - Open Map      P - Achievements and Settings Menu"
  },"controlsTipBackground")
})
.attach("Graphic",{
  key:"controlsTip",
  collection:"ui",
  transformInit : {canvasSpaceXAnchor:1,canvasSpaceYAnchor:1,ox:-20,oy:-20},
  graphic:cg.createGraphic({
    type : "pointText",
    textAlign : "right",
    colour : "#fafafa",
    fontFamily : "Lilita",
    fontSize : 30,
    text : "WASD - Move      M - Open Map      P - Achievements and Settings Menu",
  },"controlsTipText")
})
.attach("Graphic",{
  key : "playSplash",
  collection : "ui",
  graphic : null,
  transformInit : {
    CGSpace : false,
    canvasSpaceXAnchor : 0,
    canvasSpaceYAnchor : 0.5,
    ox : 600,
    oy : 200,
    sx : 5,
    sy : 5
  }
})
.attach("Animator",{
  key : "playSplashAnimator",
  animation : null,
  loop : false,
  onEnd:(Animator) => {
    Animator.animation = null;
    cg.objects.interface.playSplash.graphic = null;
  }
})
.attach("Graphic",{
  key : "achievements",
  collection : "ui",
  transformInit : {canvasSpaceXAnchor:1,canvasSpaceYAnchor:0},
  graphic : cg.createGraphic({type:"achievements"},"achievements")
})

cg.Input.createButton({
  type : "circle",
  radius : 400,
  scene : cg.scenes.main,
  check : "gameplayTouch",
  transformInit : {
    CGSpace : false,
    x : 260,
    y : -260,
    canvasSpaceYAnchor : 1
  }
},"joystick");


cg.Input.createButton({
  type : "rectangle",
  width : 600,
  height : 150,
  check : "pauseMenu",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,oy:-75,parent:cg.objects.interface.pauseMenu.transform},
  enter : () => {
    cg.objects.interface.pauseMenu.graphic.resumeHover = true;
  },
  exit : () => {
    cg.objects.interface.pauseMenu.graphic.resumeHover = false;
  },
  down : () => {
    interface.pause = false;
    cg.objects.interface.pauseMenu.transform.o = 0;
    if (window.interface.showUI) { cg.objects.pauseObject.transform.o = 1; }
    cg.objects.interface.controlsTip.transform.o = 0;
    cg.objects.interface.controlsTipBackground.transform.o = 0;
    cg.objects.interface.inventory.transform.o = 1;
    cg.objects.interface.pauseMenu.graphic.introMode = false;
    cg.settings.core.timeScale = 1;
  }
},"resumeButton");

cg.Input.createButton({
  type : "rectangle",
  width : 600,
  height : 150,
  check : "pauseMenu",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,oy:115,parent:cg.objects.interface.pauseMenu.transform},
  enter : () => {
    cg.objects.interface.pauseMenu.graphic.titleHover = true;
  },
  exit : () => {
    cg.objects.interface.pauseMenu.graphic.titleHover = false;
  },
  down : () => {
    onTitleScreen = true;
    Player.Camera.active = false;
    cg.cameras.main.size = 600;
    cg.cameras.main.transform.x = 2390;
    cg.cameras.main.transform.y = 0;
    cg.objects.interface.controlsTip.graphic.colour = "#fafafa";
    cg.objects.interface.controlsTipBackground.transform.o = 0;
    cg.objects.interface.titleScreen.transform.o = 1;
    interface.pause = false;
    cg.objects.interface.pauseMenu.transform.o = 0;
    cg.settings.core.timeScale = 1;
  }
},"titleButton");

cg.Input.createButton({
  type : "rectangle",
  width : 240,
  height : 150,
  check : "pauseMenu",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,oy:300,ox:-160,parent:cg.objects.interface.pauseMenu.transform},
  enter : () => {
    cg.objects.interface.pauseMenu.graphic.toggleMuteHover = true;
  },
  exit : () => {
    cg.objects.interface.pauseMenu.graphic.toggleMuteHover = false;
  },
  down : () => {
    cg.Audio.masterVolume = !cg.Audio.masterVolume;
    ChoreoGraph.FMOD.getBus("bus:/").setVolume(cg.Audio.masterVolume);
  }
},"toggleAudioButton");

cg.Input.createButton({
  type : "rectangle",
  width : 240,
  height : 150,
  check : "pauseMenu",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,oy:300,ox:160,parent:cg.objects.interface.pauseMenu.transform},
  enter : () => {
    cg.objects.interface.pauseMenu.graphic.toggleUIHover = true;
  },
  exit : () => {
    cg.objects.interface.pauseMenu.graphic.toggleUIHover = false;
  },
  down : () => {
    window.interface.showUI = !window.interface.showUI;
  }
},"toggleUIButton");

cg.Input.createButton({
  type : "rectangle",
  width : 450,
  height : 220,
  check : "titleScreenPlay",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5,ox:600,oy:210,parent:cg.objects.interface.titleScreen.transform},
  enter : () => {
    cg.objects.interface.titleScreen.graphic.playHover = true;
    if (cg.objects.interface.playSplashAnimator.animation == null) {
      cg.objects.interface.playSplashAnimator.paused = false;
      cg.objects.interface.playSplashAnimator.animation = cg.Animation.animations.titleSplash;
      cg.objects.interface.playSplashAnimator.restart();
    }
  },
  exit : () => {
    cg.objects.interface.titleScreen.graphic.playHover = false;
  },
  down : () => {
    cg.objects.interface.playSplash.transform.o = 0;
    cg.objects.interface.playSplashAnimator.animation = null;
    cg.objects.interface.controlsTip.graphic.colour = "#333333";
    cg.objects.interface.controlsTip.transform.o = 0;
    Player.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
    onTitleScreen = false;
    cg.objects.interface.titleScreen.transform.o = 0;
    cg.cameras.main.size = fancyCamera.zoomedInMaximumSize;
    cg.cameras.main.transform.x = Player.transform.x;
    cg.cameras.main.transform.y = Player.transform.y;
    Player.Camera.active = true;

    cg.objects.interface.inventory.transform.o = 1;
    fancyCamera.targetTargetOut = false;

    if (cg.objects.interface.pauseMenu.graphic.introMode) {
      interface.pause = true;
      cg.objects.interface.pauseMenu.transform.o = 1;
      cg.settings.core.timeScale = 0;
      cg.objects.interface.controlsTip.transform.o = 1;
      cg.objects.interface.controlsTipBackground.transform.o = 1;
      cg.objects.interface.inventory.transform.o = 0;
    } else {
      if (window.interface.showUI) { cg.objects.pauseObject.transform.o = 1; }
    }
  }
},"play");

cg.Input.createButton({
  type : "rectangle",
  width : 200,
  height : 100,
  check : "titleScreen",
  transformInit : {CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,ox:175,oy:-95,parent:cg.objects.interface.titleScreen.transform},
  enter : () => {
    cg.objects.interface.titleScreen.graphic.creditsToggleHover = true;
  },
  exit : () => {
    cg.objects.interface.titleScreen.graphic.creditsToggleHover = false;
  },
  down : () => {
    cg.objects.interface.titleScreen.graphic.showCredits = !cg.objects.interface.titleScreen.graphic.showCredits;
  }
},"toggleCreditsButton");

cg.Input.createButton({
  type : "circle",
  radius : 80,
  check : "gameplayTouch",
  transformInit : {
    CGSpace : false,
    canvasSpaceXAnchor : 1,
    canvasSpaceYAnchor : 1,
    ox : -180,
    oy : -320,
    parent : cg.objects.interface.touchControls.transform
  },
  enter : () => {
    cg.objects.interface.touchControls.graphic.mapHover = true;
  },
  exit : () => {
    cg.objects.interface.touchControls.graphic.mapHover = false;
  },
  down : () => {
    cg.settings.input.callbacks.keyDown("m");
  }
},"mapButton");

cg.Input.createButton({
  type : "circle",
  radius : 80,
  check : "gameplayTouch",
  transformInit : {
    CGSpace : false,
    canvasSpaceXAnchor : 1,
    canvasSpaceYAnchor : 1,
    ox : -280,
    oy : -160,
    parent : cg.objects.interface.touchControls.transform
  },
  enter : () => {
    cg.objects.interface.touchControls.graphic.eInteractHover = true;
  },
  exit : () => {
    cg.objects.interface.touchControls.graphic.eInteractHover = false;
  },
  down : () => {
    cg.settings.input.callbacks.keyDown("e");
  }
},"EInteractButton");

cg.scenes.main.addObject(cg.objects.interface);

cg.Input.updateButtonChecks = function(cg) {
  return {
    "titleScreen" : onTitleScreen,
    "titleScreenPlay" : onTitleScreen&&cg.objects.interface.titleScreen.graphic.showCredits==false,
    "pauseMenu" : interface.pause,
    "gameplay" : cg.settings.core.timeScale!==0&&onTitleScreen==false,
    "gameplayTouch" : cg.settings.core.timeScale!==0&&onTitleScreen==false&&cg.Input.lastInputType == ChoreoGraph.Input.TOUCH
  }
}