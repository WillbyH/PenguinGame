const interface = {
  pause: false
}

cg.createObject({"id":"pauseObject",x:70,y:70})
.attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"rectangle",ox:0,height:80,width:80,fill:true,colour:"#fafafa",CGSpace:false}),keyOverride:"leftBox",master:true})
.attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"rectangle",ox:-20,height:60,width:20,fill:false,lineWidth:4,colour:"black",CGSpace:false}),keyOverride:"leftBox",master:true})
.attach("Graphic",{level:1,graphic:cg.createGraphic({"type":"rectangle",ox:20,height:60,width:20,fill:false,lineWidth:4,colour:"black",CGSpace:false}),keyOverride:"rightBox",master:true})
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
    cg.pause();
  }
}),master:false});

ChoreoGraph.graphicTypes.pauseMenu = new class pauseMenu {
  setup(graphic,graphicInit,cg) {
    graphic.resumeHover = false;
    graphic.toggleAudioHover = false;
  }
  draw(g,cg,ax,ay) {
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
    cg.globalAlpha = 1;

    cg.c.font = "100px Lilita";
    cg.c.fillStyle = "#333333";
    cg.c.textAlign = "center";
    cg.c.fillText("PAUSED",ax,ay-225);
    cg.c.textBaseline = "middle";
    cg.c.font = "60px Lilita";
    cg.c.fillText("Resume",ax,ay-75);
    cg.c.fillText("Menu (not added)",ax,ay+115);
  }
}
ChoreoGraph.graphicTypes.inventory = new class inventory {
  setup(g,graphicInit,cg) {
    g.items = {};
    g.images = {
      "stone" : "stoneIcon",
      "stick" : "stickIcon",
      "fish" : "fishIcon"
    }
    g.padX = 10;
    g.padY = 10;
    g.circleRadius = 50;
    g.spacing = 105;
    g.textX = 0.9;
    g.textY = 1.1;
    g.imageSize = 80;

    g.add = function(item,amount) {
      if (this.items[item]) {
        this.items[item] += amount;
      } else {
        this.items[item] = amount;
      }
    }
    g.remove = function(item,amount) {
      if (this.items[item]) {
        this.items[item] -= amount;
        if (this.items[item]<=0) {
          delete this.items[item];
        }
      }
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
  }
}
ChoreoGraph.graphicTypes.achievements = new class achievements {
  setup(g,graphicInit,cg) {
    g.goals = {
      "5pond" : {
        "name" : "Pond Spinner",
        "description" : "Run around a pond 5 times",
        "completed" : false
      },
      "staring" : {
        "name" : "Staring Contest",
        "description" : "Stare into the penguins eyes for a minute",
        "completed" : false
      },
      "fishing" : {
        "name" : "Fishing",
        "description" : "Catch a fish",
        "completed" : false
      },
      "stone" : {
        "name" : "Stone Aficionado",
        "description" : "Collect 5 stones",
        "completed" : false,
        "goal" : 5,
        "current" : 0
      }
    };
    g.padX = 10;
    g.padY = 10;
    g.circleRadius = 50;
    g.spacing = 105;
    g.textX = 0.9;
    g.textY = 1.1;
    g.imageSize = 80;

    g.add = function(item,amount) {
      if (this.items[item]) {
        this.items[item] += amount;
      } else {
        this.items[item] = amount;
      }
    }
    g.remove = function(item,amount) {
      if (this.items[item]) {
        this.items[item] -= amount;
        if (this.items[item]<=0) {
          delete this.items[item];
        }
      }
    }
  }
  draw(g,cg) {
    let column = 0;
    for (let itemId in g.items) {
      cg.c.fillStyle = "#dddddd";
      cg.c.globalAlpha = 0.5;
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
  }
}
cg.createObject({"id":"interface",x:0,y:0})
.attach("Graphic",{keyOverride:"pauseMenu",level:4,graphic:cg.createGraphic({type:"pauseMenu",id:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5}),master:true})
.attach("Graphic",{keyOverride:"inventory",level:4,graphic:cg.createGraphic({type:"inventory",id:"inventory",CGSpace:false,canvasSpaceXAnchor:1,canvasSpaceYAnchor:0}),master:true})
.attach("Button",{oy:-75,button:cg.createButton({type:"rect",id:"resumeButton",width:600,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.resumeHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.resumeHover = false;
  },
  down:function(){
    interface.pause = false;
    cg.unpause();
  }
}),master:false})
.attach("Button",{oy:300,ox:-200,button:cg.createButton({type:"rect",id:"toggleAudioButton",width:200,height:150,check:"pauseMenu",CGSpace:false,canvasSpaceXAnchor:0.5,canvasSpaceYAnchor:0.5,
  enter:function(){
    cg.objects.interface.pauseMenu.graphic.toggleAudioHover = true;
  },
  exit:function(){
    cg.objects.interface.pauseMenu.graphic.toggleAudioHover = false;
  },
  down:function(){
    ChoreoGraph.AudioController.masterVolume = !ChoreoGraph.AudioController.masterVolume;
  }
}),master:false});

cg.settings.callbacks.updateButtonChecks = function(cg) {
  return {
    "pauseMenu" : interface.pause,
    "gameplay" : cg.paused==false
  }
}