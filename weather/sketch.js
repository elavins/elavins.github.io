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
let bg;
let move;

async function getWeather() {
  const res = await fetch('http://api.openweathermap.org/data/2.5/weather?zip=06031&APPID=8e2f0046b8abe8dbaa9b65b3e4a1ee05', {
      mode: 'cors'
  });
  return await res.json();
}

function preload() {
  bg = loadImage("bg.jpg");
  font = loadFont("ShareTechMono-Regular.ttf", (e) => {console.log("error" + e);});
}

function setup() {
  var cnv = createCanvas(innerWidth, innerHeight);
  cnv.style('display', 'block');

  textFont(font);
  
  // noLoop();

  p = document.createElement("p");
  p.setAttribute("style","position: absolute");
  document.body.appendChild(p);
  p = document.querySelector("p");
  
  windows.push(new Item(10, 50, 150, 150));
  windows.push(new Email(10, 100, 150, 150));
  windows.push(new Weather(100, 50, 300, 150));
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  image(bg, 0, 0);

  c1 = color(20, 0, 10, 188);
  c2 = color(60, 100, 100, 80);
 // setGradient(c1, c2);

 // debugMode();
  //orbitControl(0.2,0.2,0);
  
  push();
  fill(0,150,180,120);
  translate(20,20);
  noStroke();
  rect(0,0,width-40, height-40, 20, 5, 20, 5);

  translate(-width/2/1.2,-height/2/1.2,0);
  line(0, 20, width/2, 20);
  fill("white");
  textSize(24);
  text("X| menu",10,20);
  text("The quick brown fox jumped over the lazy dog.",10,20,70,80);
  pop();


  noFill();
 // glitch();
  addUI(color(40,170,170));

  i++;
  if (i > 400) {i = 0;}

  c = color(255, 255, 255, 255);
  
  stroke(c);
  fill(c);
 
  move = circle(100, 100, 30);

  translate(0,0,105);

  windows.forEach((i) => {
    i.drawFrame()
    i.fillContent();
  });

}

function mouseDragged() {
  for (let i = 0; i < windows.length; i++) {
    let curr = windows[i];
    if (mouseX >= curr.x && mouseX <= curr.x + curr.width &&
        mouseY >= curr.y && mouseY <= curr.y + curr.height) {
        let off = createVector(mouseX - pmouseX, mouseY - pmouseY);
        windows[i].move(off);
        return;
    }
  };
}

function mouseClicked() {
  for (let i = 0; i < windows.length; i++) {
    let curr = windows[i];
    if (mouseX >= curr.x && mouseX <= curr.x + 20 &&
        mouseY >= curr.y && mouseY <= curr.y + 20) {
        windows[i].close();
        return;
    } else if (mouseX >= curr.x + 20 && mouseX <= curr.x + 30 &&
        mouseY >= curr.y && mouseY <= curr.y + 20) {
        windows[i].min();
        return;
    }

    
  };

}


/**
 * 
 */
class Item {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.z = 100;
    this.width = w;
    this.height = h;
    this.nav = "X|-|o|";
    this.title = "menu";
    this.content;
  }

  drawFrame() {
    push();
    fill(color(255,255,255,50));
    noStroke();
    rect(this.x,this.y,this.width,this.height, 5, 5, 5, 5);
    line(this.x,this.y + 20,this.x + this.width,this.y + 20);
    fill(color(255,255,255,255));
    textSize(24);
    text(this.nav + this.title,this.x,this.y + 20);
    pop();
  }

  fillContent() {}

  move(vec) {
    push();
    console.log(vec);
    this.x = vec.x + this.x;
    this.y = vec.y + this.y;
    this.drawFrame();
    pop();
  }

  close() {
    this.width = 0;
    this.height = 0;
    this.nav = "";
    this.title = "";
    this.content = "";
  }

  min() {
    this.height = 20;
    this.content = "";
  }
}

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
class Email extends Item {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.title = "email";
    this.inbox = [];
    this.getEmails();
    this.fillContent();
  }

  getEmails() {
    this.inbox.push(new Message("hey", "please do"));
    this.inbox.push(new Message("hey2", "eterter"));
    this.inbox.push(new Message("hey3", "ertertertert"));
    this.content = this.inbox;
  }

  fillContent() {
    fill(color(255,255,255,255));
    noStroke();
    textSize(12);

    for (let i = 0; i < this.content.length; i++) {
      text(this.content[i].title, this.x, this.y + 40 + 40*i);
      text("-----------", this.x, this.y + 60 + 40*i);
    }
  }

  openEmail() {
    
  }
}

/**
 * 
 */
class Weather extends Item {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.title = "weather";
    this.data = getWeather();
  }

  display() {
  //  p.innerHTML = data.name;
    console.log(this.data);
  }
}

/**
 * 
 */
class Message {
  constructor(title, txt) {
    this.title = title;
    this.message = txt;
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