var links;

function setup() {
  createCanvas(windowWidth, windowHeight);
  links = document.querySelectorAll(".project-title a");
}

function draw() {
	background(0,15,8);
	strokeWeight(1);
	stroke(224,202,60);
  links.forEach((x) => {
	  line(mouseX, mouseY, x.offsetWidth - 5, x.offsetTop + x.offsetHeight/2);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}