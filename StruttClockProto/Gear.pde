class Gear {
  float offsetFromHub;
  PVector posit;
  float diam;
  int teeth;
  float rotAngle;  //per sec
  float currentRot;
  float orbitAngle;
  float currentOrb;
  // 3d models added when ready
  
  Gear() {
    this.offsetFromHub = 0;
    this.posit = new PVector(0, 0);
    this.teeth = 0;
    this.diam = 300;
    this.rotAngle = 0;
    this.currentRot = 0;
    this.orbitAngle = 0;
    this.currentOrb = 0;
  }
  
  Gear(float x, float y, int t, float d, float rot, float orb) {
    this.offsetFromHub = abs(x + y);
    this.posit = new PVector(x, y);
    this.teeth = t;
    this.diam = d;
    this.rotAngle = rot;
    this.currentRot = 0;
    this.orbitAngle = orb;
    this.currentOrb = 0;
  }
  
  void display(float sc) {
    noStroke();
    fill(130, 160, 200, 75);
    pushMatrix();
    translate(hub.x + posit.x,  hub.y + posit.y);
    rotate(this.currentRot);
    if (teeth == 0) {  // draw arm and counterwieght then restore state of marks
      stroke(0);
      strokeWeight(3);
      noFill();
      rect(-((diam/2)*sc), -.075*diam*sc, diam*sc, .15*diam*sc, 15);  
      ellipse(-((diam/2)*sc)*.9, 0, 2 * sc, 2 * sc);  
      noStroke();
      strokeWeight(1);
      fill(130, 160, 200, 75);
    }
    else {
      ellipse(0, 0, this.diam * sc, this.diam * sc);
      float pitch = TWO_PI / this.teeth;
      stroke(0);
      for (int i = 0; i < this.teeth; i ++) {
        if (i == 0) {
          fill(255, 0, 0);
        } else {
          stroke(0);
          noFill();
        }
        float x = cos(pitch*i) * (this.diam/2 * sc);
        float y = sin(pitch*i) * (this.diam/2 * sc);
        ellipse(x, y, 6, 6);
      }
    }
    popMatrix();
//    ellipse(hub.x + offsetFromHub.x, hub.y + offsetFromHub.y, diam * sc, diam * sc);
    //float pitch = TWO_PI / this.teeth;
    //stroke(0);
    //for (int i = 0; i < this.teeth; i ++) {
    //  if (i == 0) {
    //    fill(255, 0, 0);
    //  } else {
    //    fill(0);
    //  }
    //  float x = hub.x + offsetFromHub.x + cos(pitch*i) * (diam/2.1 * sc);
    //  float y = hub.y + offsetFromHub.y + sin(pitch*i) * (diam/2.1 * sc);
    //  ellipse(x, y, 6, 6);
    //}
  }
  
  void move(float sc) {
     this.currentRot += this.rotAngle * speedFactor;
     if (this.orbitAngle != 0) {
       this.currentOrb += this.orbitAngle * speedFactor;
       this.posit.x = cos(currentOrb) * (offsetFromHub);
       this.posit.y = sin(currentOrb) * (offsetFromHub);
     }
     
  }
}
