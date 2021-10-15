Gear g1, g2, g3, g4, g5, escapement, g7;
int lastSec;
boolean tick;

void setup () {
  size(750, 750);
//  noLoop();
  g1 = new Gear(width/2, height/2, 198, 68);
  g2 = new Gear(width/2 + 114, height/2, 24, 8);
  g3 = new Gear(width/2 + 114, height/2, 204, 72);
  g4 = new Gear(width/2, height/2, 432, 144);
  g5 = new Gear(width/2, height/2, 504, 168);
  escapement = new Gear(width/2, height/2 - 261, 102, 34);
  g7 = new Gear(width/2, height/2 - 261, 18, 6);
  lastSec = second();
}

void draw() {
  background(125);
  text(millis(), 25, 50);
  if (lastSec != second()) {
    lastSec = second();
    moveGears();
    tick = !tick;
  }
  g1.display();
  g2.display();
  g3.display();
  g4.display();
  g5.display();
  g7.display();
  escapement.display();
  pendulumDisplay();
  drawHands();
}

void drawHands() {}

void pendulumDisplay() {
  PVector pPosit;
  if (tick) {
    pPosit = new PVector(550, 700);
  }
  else {
    pPosit = new PVector(650, 700);
  }
  ellipse(600, 600, 25, 25);
  strokeWeight(5);
  line(600, 600, pPosit.x, pPosit.y);
  strokeWeight(1);
  ellipse(pPosit.x, pPosit.y, 25, 25);
}

void moveGears() {
  escapement.r += TWO_PI / escapement.nTeeth;
  g7.r += TWO_PI / escapement.nTeeth;
  g5.r -= TWO_PI / g5.nTeeth;
  g4.r -= TWO_PI / g5.nTeeth;
  g3.r -= TWO_PI / g4.nTeeth;
  g2.r -= TWO_PI / g4.nTeeth;
//  g3.movePlanetary(TWO_PI/g4.nTeeth);
}
