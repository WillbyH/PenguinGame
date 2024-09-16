const npcs = [];

function createNPC(x,y) {
  let id = "npc_"+npcs.length;
  let newNPC = cg.createObject({id:id,stopNPC:true,x:x,y:y});
  newNPC.penAnim = createPenguinGraphicsPackage();
  let firstFrame = newNPC.penAnim.idleSouth.data[0][1];
  newNPC.attach("Graphic",{level:2,graphic:firstFrame,master:true})
  .attach("Animator",{anim:newNPC.penAnim.idleSouth})
  .attach("Collider",{collider:cg.createCollider({type:"circle",id:id+"_collider",radius:10,groups:[0],master:true}),oy:5})
  .attach("Collider",{collider:cg.createCollider({type:"circle",trigger:true,id:id+"_trigger",radius:13,groups:[1],enter:function(collider){
    if (collider.object.stopNPC) {
      this.object.atTarget = true;
      this.object.lastTargetArriveTime = cg.clock;
    }
  },master:true}),oy:5})
  .attach("RigidBody",{gravity:0,useColliderForPhysics:true})
  .attach("Script",{updateScript:function(object){
    if (object.atTarget) {
      setIdleAnimations(object);
      if (object.lastTargetArriveTime + 3000 < cg.clock) {
        object.lastTargetArriveTime = cg.clock;
        let ox = Math.floor(Math.random()*80)-40;
        let oy = Math.floor(Math.random()*80)-40;
        let x = object.Transform.x + ox;
        let y = object.Transform.y + oy;
        object.targetLoc = [x,y];
        object.atTarget = false;
        object.lastTargetDepartTime = cg.clock;
      }
    } else {
      if (object.lastTargetDepartTime + 6000 < cg.clock) { // Time out movement
        object.atTarget = true;
        object.lastTargetArriveTime = cg.clock;
      }
      let x = object.Transform.x;
      let y = object.Transform.y;
      let targetX = object.targetLoc[0];
      let targetY = object.targetLoc[1];
      let dist = Math.sqrt(Math.pow(targetX-x,2)+Math.pow(targetY-y,2));
      if (dist < 1) {
        object.atTarget = true;
        object.lastTargetArriveTime = cg.clock;
      } else {
        let angle = Math.atan2(targetY-y,targetX-x);
        let speed = 15;
        object.RigidBody.xv = Math.cos(angle)*speed;
        object.RigidBody.yv = Math.sin(angle)*speed;
      }
      let magnitude = Math.sqrt(Math.pow(object.RigidBody.xv,2)+Math.pow(object.RigidBody.yv,2));
      if (magnitude > 10) {
        let aimVector = [object.RigidBody.xv/magnitude,object.RigidBody.yv/magnitude];
        setWalkingAnimations(aimVector,object);
      } else {
        setIdleAnimations(object);
      }
    }
    object.RigidBody.xv *= Math.min(Math.max(0.03*cg.timeDelta,0),1);
    object.RigidBody.yv *= Math.min(Math.max(0.03*cg.timeDelta,0),1);
  }});
  newNPC.targetLoc = [x,y];
  newNPC.lastTargetArriveTime = 0;
  newNPC.lastTargetDepartTime = 0;
  newNPC.atTarget = false;
  npcs.push(newNPC);
}

createNPC(-30,16*8);
createNPC(70,16*20);

// createNPC(30,16*5);
// createNPC(-40,16*5.5);
// createNPC(50,16*6);
// createNPC(-60,16*6.5);
// createNPC(70,16*7);
// createNPC(-80,16*7.5);
// createNPC(90,16*8);

createNPC(2450,-27);
createNPC(2486,5);
createNPC(2547,-22);
createNPC(2504,-45);

for (let i=0;i<20;i++) { createNPC(400,-360); }
for (let i=0;i<20;i++) { createNPC(-260,-490); }
for (let i=0;i<5;i++) { createNPC(-560,-220); }