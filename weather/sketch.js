//





let p;
let font;
let i = 0;
let c;
let pos;
let test3;
let j = 2;
let windows = [];
let eyeZ;
let surface;

let z = Math.floor(Math.random() * 10);

let goRight = true;

let bg;

let m = 0;
let n = 1;

let cloudscatter = [];

let data = earth;

let temp;

let items = [];
let inp;

let move;
let sel;
let button;
let units;

let isEarth;

async function getWeather() {
  let zip = inp.value();

  //let unit = '&units=imperial';

  const res = await fetch('https://api.openweathermap.org/data/2.5/weather?zip='+zip+'&APPID=8e2f0046b8abe8dbaa9b65b3e4a1ee05', {
      mode: 'cors'
  });

  data = await res.json();
  console.log(data);
  populateClouds();
}

function preload() {
  bg = loadImage("bg.jpg");
  font = loadFont("ShareTechMono-Regular.ttf", (e) => {console.log("error" + e);});
 // getWeather();
}

function setup() {
  var cnv = createCanvas(innerWidth, innerHeight, WEBGL);
  cnv.style('display', 'block');

  camera(0, -40, 600, 0, 0, 0, 0, 1, 0);
  eyeZ = height/2/tan((30 * PI)/180);
  surface = new IntersectPlane(0, 0, 1, 0, 0, 0);
  //normalMaterial();
  textFont(font);
  // noLoop();

  sel = createSelect();
  sel.position(30,30);
  sel.option(sun.name);
  sel.option(mercury.name);
  sel.option(venus.name);
  sel.option("Old Earth");
  sel.option(mars.name);
  sel.option(jupiter.name);
  sel.option(saturn.name);
  sel.option(uranus.name);
  sel.option(neptune.name);
  sel.option(pluto.name);
  sel.selected("Old Earth");
  sel.changed(selHandler);

  units = createSelect();
  units.position(30,60);
  units.option("standard units");
  units.option("metric");
  units.option("imperial");
  units.selected("standard units");
  units.changed(unitsHandler);
  temp = data.main.temp + "°K";

  setEarth();

  for (let i = 0; i < data.clouds.all; i++) {
    cloudscatter.push(new p5.Vector(Math.floor(Math.random()*600), Math.floor(Math.random()*20), Math.floor(Math.random()*300)));
  }
}


function setEarth() {
  isEarth = true;
  inp = createInput("enter US zip code");
  inp.position(130,30);
  button = createButton("submit");
  button.position(300,30);
  button.mousePressed(getWeather);
}

function removeEarth() {
  isEarth = false;
  inp.remove();
  button.remove();
}

function selHandler() {
  if (sel.value() == sun.name) {data = sun; removeEarth();}
  if (sel.value() == mercury.name) {data = mercury; removeEarth();}
  if (sel.value() == venus.name) {data = venus; removeEarth();}
  if (sel.value() == mars.name) {data = mars; removeEarth();}
  if (sel.value() == jupiter.name) {data = jupiter; removeEarth();}
  if (sel.value() == saturn.name) {data = saturn; removeEarth();}
  if (sel.value() == uranus.name) {data = uranus; removeEarth();}
  if (sel.value() == neptune.name) {data = neptune; removeEarth();}
  if (sel.value() == pluto.name) {data = pluto; removeEarth();}
  if (sel.value() == "Old Earth") {data = earth; setEarth();}

  unitsHandler();
  populateClouds();
}

function unitsHandler() {
  if (units.value() == "standard units") {
    temp = data.main.temp + "°K";
  }
  if (units.value() == "metric") {
    temp = toF(data.main.temp) + "°F";
  }
  if (units.value() == "imperial") {
    temp = toC(data.main.temp) + "°C";
  }
}

function populateClouds() {
  cloudscatter = []; 

  for (let i = 0; i < data.clouds.all; i++) {
    cloudscatter.push(new p5.Vector(Math.floor(Math.random()*600), Math.floor(Math.random()*20), Math.floor(Math.random()*300)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  orbitControl();

  // BG
  push();
  translate(-width*2, -height*3, -1000);
  image(bg, 0, 0, bg.width*4, bg.height*4);
  pop();

 /* c1 = color(20, 0, 10, 188);
  c2 = color(60, 100, 100, 80);
  setGradient(c1, c2);*/
  
  push();
  let c = color(0,170,255,100);
  noStroke();
  ambientLight(c);
  specularColor(200, 200, 200);
 // pointLight(255, 200, 200, 0, -400, 200);
  directionalLight(color(255), -5, 10, -1);
  specularMaterial(c);
  plane(650, 400);
  pop();
  
  strokeWeight(1);
  stroke(255);
  fill(color(255, 255, 255, 150));
  
  push();
  translate(100,0,0);
  line(0,0,80,80,-80,100);
  push();
  translate(0,0,80);
  fill("red");
  if (Math.floor(millis()/1000) % 2 == 0) {noFill()};
  noStroke();
  sphere(3);
  pop();
  push();
  translate(0,0,100);
  line(80,-80,0,120,-80,0);
  if (isEarth) {
    text("lon " + data.coord.lon + "\nlat " + data.coord.lat, 80, -100);
  }
  noStroke();
  fill(color(255,255,255,40));
  translate(0,0,-20);
  rect(80, -80, 80, -40);
  pop();
  rotateY(millis() / 1000);
  sphere(80);
  rotateX(millis() / 10000);
  noStroke();
  torus(100, 3);
  rotateY(millis() / 10000);
  torus(120, 1);
  pop();

  push();
  translate(-325,-200,10);
 // triangle(20, 50, 60, 10, 100, 50);
 // triangle(20, 60, 60, 100, 100, 60);

 // noFill();
 // rect(40,160,140,150);
 // arc(100,100,200,200,300,300);
  fill("white");
  textSize(16);
  let date = new Date(data.dt * 1000);
  text("Old Earth/Historical Weather Data/" + data.sys.country + "/" + 
        data.sys.id + data.name,10,20);
  push();
  if (Math.floor(millis()/1000) % 2 == 0) {noFill()};
  text(date.toLocaleString(),10,40);
  pop();
  line(10,50,300,50);
  line(300,50,350,100);
  let s1 = new Date(data.sys.sunrise * 1000);
  let s2 = new Date(data.sys.sunset * 1000);
  text("sunrise " + s1.toLocaleTimeString() + 
      "\nsunset " + s2.toLocaleTimeString(), 10, 300);

  textSize(24);
  text(data.weather[0].description, 40, 150);
  textSize(65);

  text(temp,30,250);

  /** CLOUDS */
  push();
  translate(0,-10,50);
  noStroke();
  fill(color(255,150));

  for (let i = 0; i < cloudscatter.length; i++) {
    push();
    translate(cloudscatter[i]);   
    if (goRight) {
      m+=0.01;
      if (m > 100) {goRight = false}
    } else {
      m-= 0.01;
      if (m < 0) {goRight = true}
    }
    translate(m,0,0);

    // if drizzling, add rain
    if (Math.floor(data.weather[0].id/100) == 3) {
      push();
      if (Math.floor(millis()/1000) % 2 == 0) {
        translate(10*n,40*n,10*n);
        n *= -1;
      };
      strokeWeight(2);
      stroke(255,200);
      line(10,50,10,80);
      translate(100,30,30);
      line(10,50,10,80);
      pop();
    } 

    sphere(20,10,8);
    translate(20,0,0);
    sphere(20,10,8);
    translate(0,-10,0);
    sphere(20,10,8);
    translate(20,10,0);
    sphere(20,10,8);
    pop();
  }

  // add sun if clear
  if (Math.floor(data.weather[0].id/100) == 8) {
    push();
    fill(color(255,255,0,100));
    translate(325,-40,0);
    rotateY(millis()/1000);
    sphere(50);
    pop();
  }
  pop();
  /** END CLOUDS */
  pop();

 // noFill();
  //glitch();
//  addUI(color(40,170,170));

  i++;
  if (i > 400) {i = 0;}


 // translate(0,0,10);

/* for (let i = 0; i < items.length; i++) {
  if (mouseX > items[i].x && 
    mouseX < items[i].x + items[i].height &&
    mouseY > items[i].y && 
    mouseY < items[i].y + items[i].height) {
      translate(m);
  }
};*/

 // mouseHandler();


  /*windows.forEach((i) => {
    i.drawFrame()
    i.fillContent();
  });*/
}

function mouseHandler() {
  const x = mouseX - width / 2;
  const y = mouseY - height / 2;
  const Q = createVector(0, 0, eyeZ); // A point on the ray and the default position of the camera.
  const v = createVector(x, y, -eyeZ); // The direction vector of the ray.

  let intersect; // The point of intersection between the ray and a plane.
  let closestLambda = eyeZ * 10; // The draw distance.
  let lambda = surface.getLambda(Q, v); // The value of lambda where the ray intersects the object


  let m = new p5.Vector(mouseX - pmouseX, mouseY - pmouseY);
  

  if (lambda < closestLambda && lambda > 0) {
    // Find the position of the intersection of the ray and the object.
    intersect = p5.Vector.add(Q, p5.Vector.mult(v, lambda));
    closestLambda = lambda;
  }

  
// windows[i].move(intersect);

for (let i = 0; i < items.length; i++) {
    if (mouseX > items[i].x && 
      mouseX < items[i].x + items[i].height &&
      mouseY > items[i].y && 
      mouseY < items[i].y + items[i].height) {
        translate(m);
    }
  };
  

 // translate(m);
}

function toC(k) {let ans = (k-273.15).toFixed(2); return ans}
function toF(k) {let ans = ((9/5)*(k - 273.15) + 32).toFixed(2); return ans}

/**
 * 
 */
class IntersectPlane {
  constructor(n1, n2, n3, p1, p2, p3) {
    this.normal = createVector(n1, n2, n3); // The normal vector of the plane
    this.point = createVector(p1, p2, p3); // A point on the plane
    this.d = this.point.dot(this.normal);
  }

  getLambda(Q, v) {
    return (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
  }
}


/**
 * 
 */
function addUI (color) {
  push();
  translate(-width/4,-height/4,0);
  stroke(color);
  strokeWeight(4);

  /*for (let i = 0; i < 100; i++) {
    color.setAlpha(i);
    translate(0,0,1);
    rect(0, 0, width/2, height/2, 20, 10, 15, 10);
  }*/
  
  bezier(100 + i, 90, 133 + i, 50, 166 + i, 150, 200 + i, 110);
  circle(160, 100, 30);
  arc(65, 105, 0, 0, PI+PI/1.5, 0, OPEN);
  arc(100, 100, 50, 50, PI, 0, OPEN);
  arc(135, 105, 30, 30, PI+PI/3, 0, OPEN);

  circle(130, 100, 50);
  circle(160, 100, 30);
  pop();
}

function glitch() {
  push();
  translate(-2,-2,-5);
  addUI(color(0,255,255));
  pop();
  push();
  translate(5,5,-15);
  addUI(color(255,0,255));
  pop();
}

function setGradient(c1, c2) {
  push();
 // drawingContext.shadowBlur = 10;
 // drawingContext.shadowColor = "white";
  for (var y = -height/4; y < height/4; y++) {
    var inter = map(y, 0, height/4, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(-width/4, y, -40, width/4, y, -40);
  }
  pop();
}

function myInputEvent() {
    console.log('you are typing: ', this.value());
}

function mouseMoved(e) {
    j++;
}