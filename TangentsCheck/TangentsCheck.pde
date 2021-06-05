float sf = 50;

void setup() {
  size(800, 800);
  noFill();
}

void draw() {
  background(125);
  ellipse(width/2, height/2 - 290, 2.26 * sf, 2.26 * sf);//
  ellipse(width/2, height/2 - 290, 0.4 * sf, 0.4 * sf);//
  ellipse(width/2, height/2, 11.2 * sf, 11.2 * sf);//
  ellipse(width/2, height/2, 9.6 * sf, 9.6 * sf);//
  ellipse(width/2, height/2 + 130, 4.8 * sf, 4.8 * sf);
  ellipse(width/2, height/2, 0.4 * sf, 0.4 * sf);
  ellipse(width/2 + 127, height/2, 4.53 * sf, 4.53 * sf);
  ellipse(width/2 + 127, height/2, 0.53 * sf, 0.53 * sf);
  ellipse(width/2, height/2, 4.53 * sf, 4.8 * sf);
  ellipse(width/2, height/2, 4.53 * sf, 4.8 * sf);
}
