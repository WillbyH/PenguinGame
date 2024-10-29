const interface = {
  pause: false
}
window.interface = interface;

cg.createObject({"id":"pauseObject",x:70,y:70})
.attach("Graphic",{level:2,graphic:cg.createGraphic({"type":"rectangle",ox:0,height:80,width:80,fill:true,colour:"#fafafa",CGSpace:false}),keyOverride:"background",master:true})
.attach("Graphic",{level:2,graphic:cg.createGraphic({"type":"rectangle",ox:-20,height:60,width:20,fill:false,lineWidth:4,colour:"black",CGSpace:false}),keyOverride:"leftBox",master:true})
.attach("Graphic",{level:2,graphic:cg.createGraphic({"type":"rectangle",ox:20,height:60,width:20,fill:false,lineWidth:4,colour:"black",CGSpace:false}),keyOverride:"rightBox",master:true})
.attach("Button",{button:cg.createButton({type:"circle",id:"pauseButton",radius:60,check:"gameplay",CGSpace:false,
  enter:function(){
    cg.objects.pauseObject.leftBox.graphic.colour = "#88bbeb";
    cg.objects.pauseObject.rightBox.graphic.colour = "#88bbeb";
  },
  exit:function(){
    cg.objects.pauseObject.leftBox.graphic.colour = "black";
    cg.objects.pauseObject.rightBox.graphic.colour = "black";
  },
  down:function(){
    interface.pause = true;
    cg.objects.interface.controlsTip.graphic.o = 1;
    cg.objects.interface.controlsTipBackground.graphic.o = 1;
    cg.objects.interface.inventory.graphic.o = 0;
    cg.objects.interface.touchControls.graphic.o = 0;
    cg.pause();
  }
}),master:false});

ChoreoGraph.graphicTypes.pauseMenu = new class pauseMenu {
  setup(graphic,graphicInit,cg) {
    graphic.resumeHover = false;
    graphic.titleHover = false;

    graphic.toggleMuteHover = false;
    graphic.toggleTouchHover = false;

    graphic.introMode = true;
  }
  draw(g,cg,ax,ay) {
    Player.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;

    cg.c.globalAlpha = 0.2;
    let scale = cg.settings.canvasSpaceScale;
    cg.c.fillStyle = "#000000";
    cg.c.fillRect(ax-cg.cw/scale/2,ay-cg.ch/scale/2,cg.cw/scale,cg.ch/scale);

    cg.c.fillStyle = "#ffffff";
    cg.c.globalAlpha = 0.8;
    cg.c.beginPath();
    cg.c.roundRect(ax-400,ay-400,800,800,10);
    cg.c.fill();

    cg.c.globalAlpha = 1;
    cg.c.strokeStyle = "#88bbeb";
    cg.c.fillStyle = "#fffffff";
    cg.c.lineWidth = 10;
    cg.c.beginPath();
    cg.c.roundRect(ax-300,ay-150,600,150,5);
    cg.c.roundRect(ax-300,ay+40,600,150,5);
    cg.c.fill();
    cg.c.stroke();
    cg.c.fillStyle = "#88bbeb";
    cg.globalAlpha = 0.5;
    if (g.resumeHover) {
      cg.c.beginPath();
      cg.c.roundRect(ax-300,ay-150,600,150,5);
      cg.c.fill();
    }
    if (g.titleHover) {
      cg.c.beginPath();
      cg.c.roundRect(ax-300,ay+40,600,150,5);
      cg.c.fill();
    }
    cg.globalAlpha = 1;

    cg.c.font = "100px Lilita";
    cg.c.fillStyle = "#333333";
    cg.c.textAlign = "center";
    if (g.introMode) {
      cg.c.fillText("WELCOME",ax,ay-225);
    } else {
      cg.c.fillText("PAUSED",ax,ay-225);
    }
    cg.c.textBaseline = "middle";
    cg.c.font = "60px Lilita";
    if (g.introMode) {
      cg.c.fillText("Begin",ax,ay-75);
    } else {
      cg.c.fillText("Resume",ax,ay-75);
    }
    cg.c.fillText("Return to Title",ax,ay+115);

    if (g.toggleMuteHover) { cg.c.fillStyle = "#88bbeb"; } else { cg.c.fillStyle = "#333333"; }
    cg.c.fillText(ChoreoGraph.AudioController.masterVolume>0 ? "Mute" : "Unmute",ax-160,ay+300);
    if (g.toggleTouchHover) { cg.c.fillStyle = "#88bbeb"; } else { cg.c.fillStyle = "#333333"; }
    cg.c.fillText(Player.allowTouchControls ? "Touch On" : "Touch Off",ax+160,ay+300);
  }
}
ChoreoGraph.graphicTypes.inventory = new class inventory {
  setup(g,graphicInit,cg) {
    g.items = {};
    g.images = {
      "stone" : "stoneIcon",
      "stick" : "stickIcon",
      "anchovy" : "fishAnchovyIcon",
      "krill" : "fishKrillIcon",
      "mackerel" : "fishMackerelIcon",
      "snow" : "snowIcon"
    }
    g.itemNames = {
      "stone" : "Stone",
      "stick" : "Stick",
      "anchovy" : "Anchovy",
      "krill" : "Krill",
      "mackerel" : "Mackerel",
      "snow" : "Snow"
    }
    g.padX = 10;
    g.padY = 10;
    g.circleRadius = 50;
    g.spacing = 105;
    g.textX = 0.9;
    g.textY = 1.1;
    g.imageSize = 80;

    g.pickupDisplay = {};
    g.pickupDisplayTime = 0;
    g.pickupDisplayDuration = 3000;
    g.pickupDisplayFadeOutDuration = 200;
    g.pickupDisplayY = 300;
    g.pickupDisplayX = 20;

    g.add = function(item,amount) {
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
    g.remove = function(item,amount) {
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
  draw(g,cg) {
    let column = 0;
    for (let itemId in g.items) {
      cg.c.fillStyle = "#eeeeee";
      cg.c.globalAlpha = 0.8;
      cg.c.beginPath();
      cg.c.arc(-g.circleRadius-g.padX-column*g.spacing,g.circleRadius+g.padY,g.circleRadius,0,Math.PI*2);
      cg.c.fill();
      cg.c.globalAlpha = 1;
      cg.c.imageSmoothingEnabled = false;
      cg.drawImage(cg.images[g.images[itemId]],-g.circleRadius-g.padX-column*g.spacing,g.circleRadius+g.padY,g.imageSize,g.imageSize,0,false);
      cg.c.font = "40px Lilita";
      cg.c.fillStyle = "#88bbeb";
      cg.c.strokeStyle = "#ffffff";
      cg.c.lineWidth = 10;
      cg.c.textAlign = "left";
      cg.c.strokeText(g.items[itemId],-g.padX-(column*g.spacing)-(g.circleRadius*2)*g.textX,(g.circleRadius*2)*g.textY+g.padY);
      cg.c.fillText(g.items[itemId],-g.padX-(column*g.spacing)-(g.circleRadius*2)*g.textX,(g.circleRadius*2)*g.textY+g.padY);
      column++;
    }
    if (g.pickupDisplayTime + g.pickupDisplayDuration > cg.clock) {
      if (g.pickupDisplayTime + g.pickupDisplayDuration - g.pickupDisplayFadeOutDuration < cg.clock) {
        cg.c.globalAlpha = 1-((cg.clock - g.pickupDisplayTime - g.pickupDisplayDuration + g.pickupDisplayFadeOutDuration)/g.pickupDisplayFadeOutDuration);
      }
      let row = 0;
      for (let itemId in g.pickupDisplay) {
        if (g.pickupDisplay[itemId]==0) { continue; }
        cg.c.fillStyle = "#88bbeb";
        cg.c.font = "40px Lilita";
        cg.c.textAlign = "right";
        let plusMinus = "";
        if (g.pickupDisplay[itemId] > 0) {
          plusMinus = "+";
        }
        cg.c.fillText(g.itemNames[itemId],-g.padX-75-g.pickupDisplayX,g.pickupDisplayY+row*40);
        cg.c.fillText(plusMinus + g.pickupDisplay[itemId],-g.padX-g.pickupDisplayX,g.pickupDisplayY+row*40);
        row++;
      }
    } else {
      g.pickupDisplay = {};
    }
  }
}
ChoreoGraph.graphicTypes.touchControls = new class touchControls {
  setup(g,graphicInit,cg) {
    g.mapHover = false;
    g.eInteractHover = false;
  }
  draw(g,cg) {
    cg.c.strokeStyle = "#88bbeb";
    if (g.mapHover||ChoreoGraph.Input.keyStates.m) { cg.c.fillStyle = "#88bbeb"; } else { cg.c.fillStyle = "#fafafa"; }
    cg.c.lineWidth = 20;
    let mapLoc = [180,-320];
    let ELoc = [280,-160];
    cg.c.beginPath();
    cg.c.arc(mapLoc[0],mapLoc[1],70,0,Math.PI*2);
    cg.c.globalAlpha = 0.7;
    cg.c.fill();
    cg.c.globalAlpha = 1;
    cg.c.stroke();
    if (g.eInteractHover||ChoreoGraph.Input.keyStates.e) { cg.c.fillStyle = "#88bbeb"; } else { cg.c.fillStyle = "#fafafa"; }
    cg.c.beginPath();
    cg.c.arc(ELoc[0],ELoc[1],70,0,Math.PI*2);
    cg.c.globalAlpha = 0.7;
    cg.c.fill();
    cg.c.globalAlpha = 1;
    cg.c.stroke();
    cg.c.fillStyle = "#333333";
    cg.c.font = "50px Lilita";
    cg.c.textAlign = "center";
    cg.c.textBaseline = "middle";
    cg.c.fillText("MAP", mapLoc[0],mapLoc[1]+1);
    cg.c.fillText("E", ELoc[0],ELoc[1]+1);
  }
}

cg.createImage({id:"playUnhoveredImage",file:"play.png",crop:[0*ssg,0*ssg,8*ssg,4*ssg]});
cg.createImage({id:"playHoveredImage",file:"play.png",crop:[0*ssg,4*ssg,8*ssg,4*ssg]});
cg.createImage({id:"titleImage",file:"title.png"})

for (let i=0;i<7;i++) {
  let splashImage = cg.createImage({id:"titleSplashImage"+i,file:"playSplash.png",crop:[0,ssg*4*i,ssg*8,ssg*4]});
  cg.createGraphic({type:"image",id:"titleSplash"+i,image:splashImage,width:ssg*8,height:ssg*4,imageSmoothingEnabled:false,CGSpace:false,ox:600,oy:200,osx:4,osy:4,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5});
}
cg.createGraphicAnimation({
  frames:["titleSplash1","titleSplash2","titleSplash3","titleSplash4","titleSplash5","titleSplash6","titleSplash6"],
  GraphicKey:["playSplash","graphic"],
  id:"titleSplash",
  frameRate:8,
  endCallback:function(object,Animator) {
    Animator.anim = cg.animations.titleSplashWait;
    Animator.reset();
  }
});
cg.createGraphic({"type":"rectangle",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5,ox:600,oy:200,colour:"#3c536d",id:"titleSplashWaitGraphic",o:0});

cg.createGraphicAnimation({
  frames:["titleSplashWaitGraphic"],
  GraphicKey:["playSplash","graphic"],
  id:"titleSplashWait",
  frameRate:0.1
});

ChoreoGraph.graphicTypes.titleScreen = new class titleScreen {
  setup(g,graphicInit,cg) {
    g.playHover = false;
    g.creditsToggleHover = false;
    g.showCredits = false;
    g.foundation = false;
  }
  draw(g,cg) {
    cg.c.fillStyle = "#fafafa";
    // cg.c.fillRect(600-700/2,200-150/2,700,150);
    let scaler = 5;
    cg.c.imageSmoothingEnabled = false;
    let creditsToggleText = "CREDITS";
    if (g.showCredits) {
      creditsToggleText = "BACK";
      cg.c.imageSmoothingEnabled = true;
      cg.drawImage(cg.images.FMOD,300,250,1004*0.3,264*0.3,0,false);
      cg.drawImage(cg.images.tiled,960,250,811*0.3,427*0.3,0,false);
      cg.c.imageSmoothingEnabled = false;
      cg.drawImage(cg.images.ChoreoGraph,750,250+5,400*0.3,400*0.3,20,false);
      cg.drawImage(cg.images.aseprite,570,250,400*0.35,400*0.35,0,false);
      if (g.foundation) {
        cg.drawImage(cg.images.penguinfoundation,575,70,311*0.8,160*0.8,0,false);
      }
      cg.c.font = "50px Lilita";
      cg.c.textAlign = "center";
      cg.c.fillText("A game made by Willby",580,-200);
      cg.c.font = "30px Lilita";
      cg.c.fillText("Penguin sounds by al.barbosa",580,-100);
      cg.c.fillText("Wave sounds from Zapspat",580,-50);
    } else {
      let playImage = g.playHover ? cg.images.playHoveredImage : cg.images.playUnhoveredImage;
      cg.drawImage(playImage,600,200,8*ssg*scaler,4*ssg*scaler,0,false);
      cg.drawImage(cg.images.titleImage,600,-200,10*ssg*scaler,5*ssg*scaler,0,false);
    }

    if (g.creditsToggleHover) { cg.c.fillStyle = "#88bbeb"; }
    else { cg.c.fillStyle = "#fafafa"; }
    cg.c.font = "40px Lilita";
    cg.c.textAlign = "left";
    cg.c.fillText(creditsToggleText,100,(cg.ch/2)/cg.settings.canvasSpaceScale-80);
  }
}
// Freesound - 150861 150865
// Zapsplat - https://www.zapsplat.com/music/distant-stormy-ocean-waves-with-surf/

ChoreoGraph.graphicTypes.controlsTip = new class controlsTip {
  setup(g,graphicInit,cg) {
    g.playHover = false;
  }
  draw(g,cg) {
    cg.c.fillStyle = "#fafafa";
    cg.c.font = "30px Lilita";
    cg.c.textAlign = "right";
    cg.c.fillText("WASD - Move      M - Open Map      P - Pause / See Achievements",-20,-20);
  }
}
ChoreoGraph.graphicTypes.achievements = new class achievements {
  setup(g,graphicInit,cg) {
    g.goals = {
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
    g.padX = 10;
    g.padY = 10;
    g.width = 500;
    g.height = 100;
    g.borderRadius = 20;
    g.spacing = 20;
    g.textX = 100;
    g.textY = 10;
    g.imageSize = 80;
    g.iconX = 50;
    g.iconY = 80;
    g.progressY = 47;

    g.currentGoalPopup = null;
    g.goalPopupTime = 0;

    g.goalPopupInDuration = 1000;
    g.goalPopupStayDuration = 3000;
    g.goalPopupOutDuration = 1000;

    g.popupY = 100;

    g.progress = function(goal,amount) {
      if (this.goals[goal]==undefined) { console.warn("Goal",goal,"does not exist."); return; }
      this.goals[goal].current = Math.min(this.goals[goal].current+amount,this.goals[goal].goal);
      if (this.goals[goal].current >= this.goals[goal].goal && this.goals[goal].completed == false) {
        this.goals[goal].completed = true;
        cg.createEvent({duration:(g.goalPopupInDuration+g.goalPopupStayDuration+g.goalPopupStayDuration+1000)/1000,end:function(){
          cg.graphics.achievements.progress("finish",1);
        }});
        ChoreoGraph.AudioController.start("achievement",0,0,0.4);
        g.currentGoalPopup = goal;
        g.goalPopupTime = cg.clock;
      }
    }
  }
  draw(g,cg) {
    if (cg.paused||(cg.objects.interface.pauseMenu.graphic.introMode&&window.interface.pause)) {
      let row = 0;
      for (let goalId in g.goals) {
        let goal = g.goals[goalId];
        if (goal.hidden&&goal.completed==false) { continue; }
        cg.c.fillStyle = "#eeeeee";
        cg.c.globalAlpha = 0.8;
        cg.c.beginPath();
        cg.c.roundRect(-g.borderRadius-g.padX-g.width,row*(g.spacing+g.height)+g.borderRadius+g.padY,g.width,g.height,g.borderRadius);
        cg.c.fill();
        cg.c.globalAlpha = 1;
        cg.c.font = "30px Lilita";
        cg.c.fillStyle = "#333333";
        cg.c.fillText(goal.name,-g.borderRadius-g.padX-g.width+g.textX,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY);
        if (goal.completed) {
          cg.c.strokeStyle = "#333333";
          cg.c.lineWidth = 5;
          cg.c.lineCap = "round";
          cg.c.beginPath();
          cg.c.moveTo(-g.borderRadius-g.padX-g.width+g.textX,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY-8);
          cg.c.lineTo(-g.borderRadius-g.padX-g.width+g.textX+cg.c.measureText(goal.name).width,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY-12);
          cg.c.stroke();
        }
        if (goal.current > 0 && goal.goal != goal.current) {
          cg.c.lineWidth = 5;
          cg.c.lineCap = "round";
          cg.c.strokeStyle = "#7f7f7f";
          cg.c.beginPath();
          cg.c.moveTo(-g.borderRadius-g.padX-g.width+g.textX,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY+g.progressY);
          let maxWidth = g.width-g.iconX*2-40;
          cg.c.lineTo(-g.borderRadius-g.padX-g.width+g.textX+maxWidth,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY+g.progressY);
          cg.c.stroke();
          cg.c.strokeStyle = "#88bbeb";
          cg.c.beginPath();
          cg.c.moveTo(-g.borderRadius-g.padX-g.width+g.textX,g.height/2+row*(g.spacing+g.height)+g.padY+g.textY+g.progressY);
          cg.c.lineTo(-g.borderRadius-g.padX-g.width+g.textX+maxWidth*(goal.current/goal.goal),g.height/2+row*(g.spacing+g.height)+g.padY+g.textY+g.progressY);
          cg.c.stroke();
        }
        cg.c.font = "20px Lilita";
        cg.c.fillStyle = "#666666";
        cg.c.fillText(goal.description,-g.borderRadius-g.padX-g.width+g.textX,(g.height/2+row*(g.spacing+g.height)+g.padY+g.textY)+30);
        cg.c.imageSmoothingEnabled = false;
        cg.c.globalAlpha = 0.8;
        cg.c.fillStyle = "#fafafa";
        cg.c.beginPath();
        cg.c.arc(-g.borderRadius-g.padX-g.width+g.iconX,row*(g.spacing+g.height)+g.iconY,g.imageSize/2,0,Math.PI*2);
        cg.c.fill();
        cg.c.globalAlpha = 1;
        cg.drawImage(cg.images[goal.icon],-g.borderRadius-g.padX-g.width+g.iconX,row*(g.spacing+g.height)+g.iconY,g.imageSize,g.imageSize,0,false);
        row++;
      }
    } else if (g.currentGoalPopup!=null&&g.goalPopupTime+g.goalPopupInDuration+g.goalPopupStayDuration+g.goalPopupOutDuration>cg.clock) {
      let offsetProportion = 0;
      let offDistance = g.width + g.padX + 50;
      let crossOutProportion = 0;
      if (g.goalPopupTime+g.goalPopupInDuration+g.goalPopupStayDuration < cg.clock) {
        // Transition Out
        crossOutProportion = 1;
        offsetProportion = 1-((cg.clock-g.goalPopupTime-g.goalPopupInDuration-g.goalPopupStayDuration)/g.goalPopupOutDuration);
        offsetProportion = (offsetProportion**2)*(3-2*offsetProportion);
      } else if (g.goalPopupTime+g.goalPopupInDuration < cg.clock) {
        // Stay
        offsetProportion = 1;
        crossOutProportion = (cg.clock-g.goalPopupTime-g.goalPopupInDuration)/g.goalPopupStayDuration;
        crossOutProportion = Math.cbrt((crossOutProportion-0.5)/4)+0.5;
      } else if (g.goalPopupTime < cg.clock) {
        // Transition In
        offsetProportion = (cg.clock-g.goalPopupTime)/g.goalPopupInDuration;
        offsetProportion = (offsetProportion**2)*(3-2*offsetProportion);
      }
      let xOffset = offDistance*(1-offsetProportion);
      cg.c.fillStyle = "#eeeeee";
      cg.c.globalAlpha = 0.8;
      cg.c.beginPath();
      cg.c.roundRect(-g.borderRadius-g.padX-g.width+xOffset,g.borderRadius+g.padY+g.popupY,g.width,g.height,g.borderRadius);
      cg.c.fill();
      cg.c.globalAlpha = 1;
      cg.c.font = "30px Lilita";
      cg.c.fillStyle = "#333333";
      cg.c.fillText(g.goals[g.currentGoalPopup].name,-g.borderRadius-g.padX-g.width+g.textX+xOffset,g.height/2+g.padY+g.textY+g.popupY);
      cg.c.strokeStyle = "#333333";
      cg.c.lineWidth = 5;
      cg.c.lineCap = "round";
      cg.c.beginPath();
      cg.c.moveTo(-g.borderRadius-g.padX-g.width+g.textX+xOffset,g.height/2+g.padY+g.textY-10+g.popupY);
      cg.c.lineTo(-g.borderRadius-g.padX-g.width+g.textX+xOffset+(crossOutProportion*cg.c.measureText(g.goals[g.currentGoalPopup].name).width),g.height/2+g.padY+g.textY-10+g.popupY);
      cg.c.stroke();
      cg.c.font = "20px Lilita";
      cg.c.fillStyle = "#666666";
      cg.c.fillText(g.goals[g.currentGoalPopup].description,-g.borderRadius-g.padX-g.width+g.textX+xOffset,(g.height/2+g.padY+g.textY)+30+g.popupY);
      cg.c.imageSmoothingEnabled = false;
      cg.drawImage(cg.images[g.goals[g.currentGoalPopup].icon],-g.borderRadius-g.padX-g.width+g.iconX+xOffset,g.iconY+g.popupY,g.imageSize,g.imageSize,0,false);
    }
  }
}

cg.createObject({"id":"interface",x:0,y:0})
.attach("Graphic",{keyOverride:"pauseMenu",level:4,graphic:cg.createGraphic({type:"pauseMenu",id:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5}),master:true})
.attach("Graphic",{keyOverride:"inventory",level:4,graphic:cg.createGraphic({type:"inventory",id:"inventory",CGSpace:false,canvasSpaceXAnchor:1,canvasSpaceYAnchor:0}),master:true})
.attach("Graphic",{keyOverride:"touchControls",level:4,graphic:cg.createGraphic({type:"touchControls",id:"touchControls",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,o:0}),master:true})
.attach("Graphic",{keyOverride:"titleScreen",level:4,graphic:cg.createGraphic({type:"titleScreen",id:"titleScreen",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5,o:0}),master:true})
.attach("Graphic",{keyOverride:"controlsTipBackground",level:4,graphic:cg.createGraphic({type:"pointText",id:"controlsTip",CGSpace:false,canvasSpaceXAnchor:1,canvasSpaceYAnchor:1,textAlign:"right",lineWidth:4,fill:false,colour:"#c8c8c8",font:"30px Lilita",text:"WASD - Move      M - Open Map      P - Achievements and Settings Menu",ox:-20,oy:-20,o:0}),master:true})
.attach("Graphic",{keyOverride:"controlsTip",level:4,graphic:cg.createGraphic({type:"pointText",id:"controlsTip",CGSpace:false,canvasSpaceXAnchor:1,canvasSpaceYAnchor:1,textAlign:"right",colour:"#fafafa",font:"30px Lilita",text:"WASD - Move      M - Open Map      P - Achievements and Settings Menu",ox:-20,oy:-20}),master:true})
.attach("Graphic",{keyOverride:"playSplash",level:4,graphic:cg.graphics.titleSplashWaitGraphic,master:true})
.attach("Animator",{keyOverride:"playSplashAnimator",anim:cg.animations.titleSplashWait,master:true})
.attach("Graphic",{keyOverride:"achievements",level:4,graphic:cg.createGraphic({type:"achievements",id:"achievements",CGSpace:false,canvasSpaceXAnchor:1,canvasSpaceYAnchor:0}),master:true})
.attach("Button",{oy:-75,button:cg.createButton({type:"rect",id:"resumeButton",width:600,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.resumeHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.resumeHover = false;
  },
  down:function(){
    interface.pause = false;
    cg.objects.interface.controlsTip.graphic.o = 0;
    cg.objects.interface.controlsTipBackground.graphic.o = 0;
    cg.objects.interface.inventory.graphic.o = 1;
    if (Player.allowTouchControls) { cg.objects.interface.touchControls.graphic.o = 1; }
    cg.objects.interface.pauseMenu.graphic.introMode = false;
    cg.unpause();
  }
}),master:false})
.attach("Button",{oy:115,button:cg.createButton({type:"rect",id:"titleButton",width:600,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.titleHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.titleHover = false;
  },
  down:function(){
    onTitleScreen = true;
    cg.objects.interface.controlsTip.graphic.colour = "#fafafa";
    cg.objects.interface.controlsTipBackground.graphic.o = 0;
    cg.objects.interface.titleScreen.graphic.o = 1;
    interface.pause = false;
    cg.unpause();
  }
}),master:false})
.attach("Button",{oy:300,ox:-160,button:cg.createButton({type:"rect",id:"toggleAudioButton",width:240,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.toggleMuteHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.toggleMuteHover = false;
  },
  down:function(){
    ChoreoGraph.AudioController.masterVolume = !ChoreoGraph.AudioController.masterVolume;
    ChoreoGraph.FMODConnector.getBus("bus:/").setVolume(ChoreoGraph.AudioController.masterVolume);
  }
}),master:false})
.attach("Button",{oy:300,ox:160,button:cg.createButton({type:"rect",id:"toggleTouchButton",width:240,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.toggleTouchHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.toggleTouchHover = false;
  },
  down:function(){
    Player.allowTouchControls = !Player.allowTouchControls;
  }
}),master:false})
.attach("Button",{oy:210,ox:600,button:cg.createButton({type:"rect",id:"play",width:450,height:220,check:"titleScreenPlay",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.titleScreen.graphic.playHover = true;
    if (cg.objects.interface.playSplashAnimator.anim.id == "titleSplashWait") {
      cg.objects.interface.playSplashAnimator.anim = cg.animations.titleSplash;
      cg.objects.interface.playSplashAnimator.reset();
    }
  },
  exit:function(){
    cg.objects.interface.titleScreen.graphic.playHover = false;
  },
  down:function(){
    cg.objects.interface.playSplashAnimator.anim = cg.animations.titleSplashWait;
    cg.objects.interface.playSplashAnimator.reset();
    cg.objects.interface.controlsTip.graphic.colour = "#333333";
    cg.objects.interface.controlsTip.graphic.o = 0;
    Player.nextDharntzTime = cg.clock + 10000 + Math.random()*20000;
    onTitleScreen = false;
    cg.objects.interface.titleScreen.graphic.o = 0;
    cg.camera.maximumSize = fancyCamera.zoomedInMaximumSize;
    cg.camera.x = Player.Transform.x;
    cg.camera.y = Player.Transform.y;
    cg.objects.interface.inventory.graphic.o = 1;
    if (Player.allowTouchControls) { cg.objects.interface.touchControls.graphic.o = 1; }
    fancyCamera.targetTargetOut = false;

    if (cg.objects.interface.pauseMenu.graphic.introMode) {
      interface.pause = true;
      cg.objects.interface.controlsTip.graphic.o = 1;
      cg.objects.interface.controlsTipBackground.graphic.o = 1;
      cg.objects.interface.inventory.graphic.o = 0;
      cg.objects.interface.touchControls.graphic.o = 0;
    }
  }
}),master:false})
.attach("Button",{oy:-95,ox:175,button:cg.createButton({type:"rect",id:"toggleCredits",width:200,height:100,check:"titleScreen",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,
  enter:function(){
    cg.objects.interface.titleScreen.graphic.creditsToggleHover = true;
  },
  exit:function(){
    cg.objects.interface.titleScreen.graphic.creditsToggleHover = false;
  },
  down:function(){
    cg.objects.interface.titleScreen.graphic.showCredits = !cg.objects.interface.titleScreen.graphic.showCredits;
  }
}),master:false})
.attach("Button",{ox:180,oy:-320,button:cg.createButton({type:"circle",id:"mapButton",radius:80,check:"gameplayTouch",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,
  enter:function(){
    cg.objects.interface.touchControls.graphic.mapHover = true;
  },
  exit:function(){
    cg.objects.interface.touchControls.graphic.mapHover = false;
  },
  down:function(){
    cg.settings.callbacks.keyDown("m");
  }
}),master:false})
.attach("Button",{ox:280,oy:-160,button:cg.createButton({type:"circle",id:"EInteractButton",radius:80,check:"gameplayTouch",CGSpace:false,canvasSpaceXAnchor:0,canvasSpaceYAnchor:1,
  enter:function(){
    cg.objects.interface.touchControls.graphic.eInteractHover = true;
  },
  exit:function(){
    cg.objects.interface.touchControls.graphic.eInteractHover = false;
  },
  down:function(){
    cg.settings.callbacks.keyDown("e");
  }
}),master:false});

cg.settings.callbacks.updateButtonChecks = function(cg) {
  return {
    "titleScreen" : onTitleScreen,
    "titleScreenPlay" : onTitleScreen&&cg.objects.interface.titleScreen.graphic.showCredits==false,
    "pauseMenu" : interface.pause,
    "gameplay" : cg.paused==false&&onTitleScreen==false,
    "gameplayTouch" : cg.paused==false&&onTitleScreen==false&&Player.allowTouchControls
  }
}