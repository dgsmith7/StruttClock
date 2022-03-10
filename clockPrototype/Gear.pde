class Gear {
  PVector centerPosit;
  PVector origPosit;
  float diam;
  int nTeeth;
  float r;
  
  Gear() {
    this.centerPosit = new PVector(width/2, height/2);
    this.origPosit = new PVector(width/2, height/2);
    this.diam = 150;
    this.nTeeth = 24;
    float r = TWO_PI / nTeeth;
  }
  
  Gear(float x, float y, float d, int t) {
    this.centerPosit = new PVector(x, y);
    this.origPosit = new PVector(x, y);
    this.diam = d;
    this.nTeeth = t;
    float r = TWO_PI / nTeeth;
  }
  
  void display() {
    noStroke();
    fill(130, 160, 200, 125);
    ellipse(centerPosit.x, centerPosit.y, diam, diam);
    float pitch = TWO_PI / this.nTeeth;
    stroke(0);
    for (int i = 0; i < this.nTeeth; i ++) {
      float x = centerPosit.x + cos(pitch*i) * (diam/2);
      float y = centerPosit.y + sin(pitch*i) * (diam/2);
      ellipse(x, y, 6, 6);
    }
    fill(0);
    ellipse(centerPosit.x + cos(0 + this.r) * (diam/2), centerPosit.y + sin(0 + this.r) * (diam/2), 5, 5);
  }
}
