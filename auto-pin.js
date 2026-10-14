'use strict';
/* Stop detection uses every good fix, independently of recorded track thinning. */
class AutoPinDetector {
 constructor(distance, locks={}, onLocksChanged=()=>{}) {
  this.distance=distance; this.locks=Object.assign(Object.create(null),locks);
  this.onLocksChanged=onLocksChanged; this.reset();
 }
 reset(){this.sessionId=null;this.candidate=null;this.lastGood=null;this.latestTime=null;}
 noteVisit(sessionId,fix,automaticAt=null,visitId=null){
  this.locks[sessionId]={lat:fix.lat,lng:fix.lng,automaticAt,visitId};
  this.candidate=null;this.onLocksChanged(this.locks);
 }
 justSavedAutomatically(sessionId,fix,now){
  const lock=this.locks[sessionId];
  return lock && Number.isFinite(lock.automaticAt) && now>=lock.automaticAt &&
   now-lock.automaticAt<15000 && this.distance(lock,fix)<=30;
 }
 update(sessionId,fix,receivedAt){
  if(this.sessionId!==sessionId){this.reset();this.sessionId=sessionId;}
  const t=Date.parse(fix.time);
  if(!Number.isFinite(t)||!Number.isFinite(receivedAt)||!Number.isFinite(fix.lat)||Math.abs(fix.lat)>90||
   !Number.isFinite(fix.lng)||Math.abs(fix.lng)>180||!Number.isFinite(fix.accuracy)||fix.accuracy<0||
   t>receivedAt+5000||receivedAt-t>15000){
   this.candidate=null;return null;
  }
  if(this.latestTime!==null && t<=this.latestTime){this.candidate=null;return null;}
  this.latestTime=t;
  if(this.lastGood && (t-this.lastGood.t>=30000 || receivedAt-this.lastGood.receivedAt>=30000))this.candidate=null;
  if(fix.accuracy>30)return null;
  if(this.lastGood){
   const elapsed=(t-this.lastGood.t)/1000;
   if(elapsed>0 && this.distance(this.lastGood.fix,fix)/elapsed>65){this.candidate=null;return null;}
  }
  this.lastGood={fix,t,receivedAt};
  const lock=this.locks[sessionId];
  if(lock){
   if(this.distance(lock,fix)<=60){this.candidate=null;return null;}
   delete this.locks[sessionId];this.onLocksChanged(this.locks);this.candidate=null;
  }
  if(!this.candidate || this.distance(this.candidate.anchor,fix)>30){
   this.candidate={anchor:{lat:fix.lat,lng:fix.lng},start:t,receivedStart:receivedAt,count:0,x:0,y:0,z:0,accuracy:0};
  }
  const c=this.candidate,lat=fix.lat*Math.PI/180,lng=fix.lng*Math.PI/180;
  c.count++;c.x+=Math.cos(lat)*Math.cos(lng);c.y+=Math.cos(lat)*Math.sin(lng);c.z+=Math.sin(lat);
  c.accuracy=Math.max(c.accuracy,fix.accuracy);
  if(t-c.start<120000 || receivedAt-c.receivedStart<120000)return null;
  const representative={lat:Math.atan2(c.z,Math.hypot(c.x,c.y))*180/Math.PI,
   lng:Math.atan2(c.y,c.x)*180/Math.PI,accuracy:c.accuracy,time:fix.time};
  this.candidate=null;
  return representative;
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=AutoPinDetector;
