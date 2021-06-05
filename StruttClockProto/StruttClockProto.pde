PVector hub;
Gear[] allGears = new Gear[11];
//                         n      d      p
Gear outer;          //  168    11.2    15
Gear inner;          //  144     9.6
Gear escape;         //   34     2.26
Gear escapePinion;   //    6     0.4
Gear planet;  //   68     4.53
Gear planetPinion;   //    8     0.53
Gear arm;            // just an arm with counterweight for planet gear pinned to center arbor
Gear sunFreeHour;    //   72     4.53   15.88
Gear sunFixed;       //   66     4.53   14.55   pinned to frame
Gear drive;          //  120     4.8   24.7
Gear drivePinionMinutes;    //   10     0.4    24.7
int lastSecond;
boolean firstHalf = true;
float scaleFactor = 50;
float speedFactor = 1;

void setup() {
  size(750, 750);
  textSize(35);
  hub = new PVector (width/2, height/2);
  initGears();
  lastSecond = second();
}

void draw() {
  background(125);
  if (second() != lastSecond) {
    lastSecond = second();
    tick();
  }
  drawGears();
  drawHands();
  text(speedFactor, 50, 50);
}

void initGears() {
  // if we had 3d models we would import them here and add to objects
  Gear escape = new Gear(0, -290, 34, 2.26, -radians(14.0929481132076), 0); // done
  allGears[0] = escape;
  Gear escapePinion = new Gear(0, -290, 6, 0.4, -radians(14.0929481132076), 0); // done
  allGears[1] = escapePinion;
  Gear outer = new Gear(0, 0, 168, 11.2, radians(0.503319575471701), 0); // dpne
  allGears[2] = outer;
  Gear inner = new Gear(0, 0, 144, 9.6, radians(0.503319575471701), 0); // done
  allGears[3] = inner;
  Gear drive = new Gear(68, 110, 120, 4.8, -radians(.1), 0); // done
  allGears[4] = drive;
  Gear drivePinionMinutes = new Gear(0, 0, 10, 0.4, radians(.1), 0); // done
  allGears[5] = drivePinionMinutes;
  Gear arm = new Gear(0, 0, 0, 6.2, radians(.1), 0); // done
  allGears[6] = arm;;
  Gear planet = new Gear(127, 0, 68, 4.53, radians(0.854716981132079), radians(0.1)); // done
  allGears[7] = planet;
  Gear planetPinion = new Gear(127, 0, 8, 0.53, radians(0.854716981132079), radians(0.1)); // done
  allGears[8] = planetPinion;
  Gear sunFreeHour = new Gear(0, 0, 72, 4.53, radians(0.00833333), 0); // done
  allGears[9] = sunFreeHour;
  Gear sunFixed = new Gear(0, 0, 66, 4.53, 0, 0);
  allGears[10] = sunFixed;
}

void tick() {
  println("Tick");
  for (Gear g : allGears) {
    g.move(scaleFactor);
  }
}

void drawGears() {
  for (Gear g : allGears) {
    g.display(scaleFactor);
  }
}

void drawHands() {
  strokeWeight(5);

  // draw hour hand from sunFreeHour data
  pushMatrix();
  translate(hub.x, hub.y);
  rotate(allGears[9].currentRot);
  line(0, 0, allGears[9].diam/1.9 * scaleFactor, allGears[9].diam/1.9 * scaleFactor);
  popMatrix();

  // draw minute hand from drivePiniontMinutes data
  pushMatrix();
  translate(hub.x, hub.y);
  rotate(allGears[5].currentRot);
  line(0, 0, allGears[5].diam/.1 * scaleFactor, allGears[5].diam/.1 * scaleFactor);
  popMatrix();
  strokeWeight(1);

  // draw red second hand althought there are no physical gears for it - pure math  
  stroke(255, 0 , 0);
  pushMatrix();
  translate(hub.x, hub.y);
  rotate(allGears[5].currentRot * 60);
  line(0, 0, allGears[5].diam/.1 * scaleFactor, allGears[5].diam/.1 * scaleFactor);
  popMatrix();

  stroke(0);
}

void keyPressed() {
  if (keyCode == UP) {
    speedFactor += 0.5;
  }
  if (keyCode == DOWN) {
    speedFactor -= 0.5;
  }
}
