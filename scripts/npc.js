const npcs = [];

function createNPC(x,y) {
  x += Math.random()/2;
  y += Math.random()/2;
  let id = "npc_"+npcs.length;
  let newNPC = cg.createObject({atTarget:false,stopNPC:true,lastTouchedPlayer:-Infinity,transformInit:{x:x,y:y}},id);
  let firstFrame = cg.Animation.animations.idleSouth.data[1][2];
  newNPC.attach("Graphic",{collection:"entities",graphic:firstFrame,master:true})
  .attach("Animator",{animation:cg.Animation.animations.idleSouth})
  .attach("RigidBody",{
    gravity : 0,
    mass : 2,
    collider:cg.Physics.createCollider({
    type:"circle",
    radius : 10,
    groups : [0],
    transformInit : {oy:5},
    object : newNPC,
    collide : (collided,_b,self) => {
      if (collided.id==="playerCollider") {
        self.object.lastTouchedPlayer = cg.clock;
      }
      if (collided.static) {
        if (cg.clock - self.object.lastTouchedPlayer < 1000) {
          cg.graphics.achievements.progress("push",1);
        }
      }
      self.object.atTarget = true;
      self.object.lastTargetArriveTime = cg.clock;
    }})})
  .attach("Script",{
    updateScript : (object) => {
    if (cg.ready==false) { return; }
    if (object.atTarget) {
      setIdleAnimations(object);
      if (object.lastTargetArriveTime + 5000 < cg.clock) {
        let ox = Math.floor(Math.random()*160)-80;
        let oy = Math.floor(Math.random()*160)-80;
        let x = object.transform.x + ox;
        let y = object.transform.y + oy;
        object.targetLoc = [x,y];
        object.atTarget = false;
        object.lastTargetDepartTime = cg.clock;
      }
    } else {
      if (object.lastTargetDepartTime + 12000 < cg.clock) { // Time out movement
        object.atTarget = true;
        object.lastTargetArriveTime = cg.clock;
      }
      let x = object.transform.x;
      let y = object.transform.y;
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
  cg.scenes.main.addObject(newNPC);
}

createNPC(-30,16*8);
createNPC(70,16*20);

createNPC(2600,-27);
createNPC(2486,5);
createNPC(2547,-22);
createNPC(2504,-35);

for (let i=0;i<20;i++) { createNPC(400,-360); }
for (let i=0;i<20;i++) { createNPC(-260,-490); }
for (let i=0;i<5;i++) { createNPC(-560,-220); }