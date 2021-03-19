//



let data;
let p;
let i = 0;

let h = height;
let w = width;

async function getWeather() {
    const res = await fetch('http://api.openweathermap.org/data/2.5/weather?zip=06031&APPID=8e2f0046b8abe8dbaa9b65b3e4a1ee05', {
        mode: 'cors'
    });

    data = await res.json();
    
    p.innerHTML = data.name;
    console.log(data);
}

function setup() {
    // createCanvas should be the first statement
    var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.style('display', 'block');
    stroke(255); // Set line drawing color to white
   // noLoop();

   /* let inp = createInput('zip');
    inp.input(myInputEvent);*/

    // Define colors

    p = document.createElement("p");
    p.setAttribute("style","position: absolute");
    document.body.appendChild(p);
    p = document.querySelector("p");
    
    getWeather();
  
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function draw() {
background(205, 102, 94);
    c1 = color(20, 0, 10);
  c2 = color(60, 100, 100);
  setGradient(c1, c2);



    
  

    stroke("pink");
    strokeWeight(4);
    bezier(100+5+i, 90, 133+5+i, 50, 166+5+i, 150, 200+5+i, 110);

    stroke("lightblue");
    bezier(100-5+i, 90, 133-5+i, 50, 166-5+i, 150, 200-5+i, 110);

    stroke(255, 255, 255);

    rect(-width/2, 20, width - 40, height - 40, 20, 15, 10, 5);

    bezier(100+i, 90, 133+i, 50, 166+i, 150, 200+i, 110);

    i+= 1;

    
    fill(255,255,255,10);
    //noFill();
    strokeWeight(1);
    // ellipse(50,50,80,80);
    translate(0,0,100);
    rotateY(millis() / 1000);
    rotateX(millis() / 1000);
    sphere(100, 10, 8, 2);
    
}

function setGradient(c1, c2) {
    for (var y = -height/2; y < height/2; y++) {
      var inter = map(y, 0, height/2, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(-width/2, y, 0, width/2, y, 0);
    }
  }

function myInputEvent() {
    console.log('you are typing: ', this.value());
  }


 