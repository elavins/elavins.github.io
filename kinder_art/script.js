import * as THREE from 'https://unpkg.com/three/build/three.module.js';
//import {OrbitControls} from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, mesh, material;
let aspect, fov;
let controls;
const drawPrev = new THREE.Vector2();
let c = "red";

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext('2d');

let paper;
let paperctx;


init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.25, 1000 );
    camera.position.set(0,4,2);
    camera.lookAt(new THREE.Vector3(0,0,0));

    //scene.add(new THREE.AmbientLight(0x505050));

   /* const spot = new THREE.SpotLight(0xffffff);
    spot.angle = Math.PI / 5;
    spot.penumbra = 0.2;
    spot.position.set(0.5,6,2.5);
    spot.castShadow = true;
    spot.shadow.camera.near = 3;
    spot.shadow.camera.far = 10;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    scene.add(spot);

    const dir = new THREE.DirectionalLight(0x55505a, 0.5);
    dir.position.set(0, 3, 0);
    dir.castShadow = true;

    dir.shadow.camera.near = 1;
    dir.shadow.camera.far = 10;
    dir.shadow.camera.right = 1;
    dir.shadow.camera.left = - 1;
    dir.shadow.camera.top	= 1;
    dir.shadow.camera.bottom = - 1;

    dir.shadow.mapSize.width = 1024;
    dir.shadow.mapSize.height = 1024;

    scene.add(dir);*/

    //--------add room--------//

    const geo = new THREE.PlaneGeometry(6, 4);
    material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x = -Math.PI/2;
	scene.add(mesh);

    const armMtrl = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("assets/arm.png"), side: THREE.DoubleSide, transparent: true});
    const arm = new THREE.Mesh(new THREE.PlaneGeometry(4,2), armMtrl);
    scene.add(arm);

    const crayonGreen = new THREE.Mesh(new THREE.PlaneGeometry(0.5,1), new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("assets/crayon_green.png"), side: THREE.DoubleSide, transparent: true}));
    crayonGreen.rotation.x = -Math.PI/2;
    crayonGreen.position.set(-1,0.1,-1);
    scene.add(crayonGreen);

   /* const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.rotation.x = -Math.PI/2;
    scene.add( line );*/

    const desk = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide}));
    desk.receiveShadow = true;
    desk.rotation.x = -Math.PI/2;
    desk.position.y = -.01;
    scene.add(desk);

    
    const room = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshNormalMaterial({side: THREE.DoubleSide}));
    scene.add(room);

    /////////////////



//////////////

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);

   // controls = new OrbitControls( camera, renderer.domElement );

    document.getElementById("container").appendChild(renderer.domElement);

   window.addEventListener("resize", onWindowResize);


   // CREATE CANVAS

   ctx.canvas.width  = window.innerWidth;
   ctx.canvas.height = window.innerHeight;
   ctx.fillStyle = 'yellow';
   ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
   ctx.fillStyle = 'white';
   ctx.stroke();
   ctx.strokeStyle = 'black';
   ctx.fillRect(window.innerWidth/4, window.innerHeight/4, window.innerWidth/2, window.innerHeight/2);
   material.map = new THREE.CanvasTexture(canvas);

   let drawing = false;

   canvas.addEventListener('mousedown', (e) => {
       drawing = true;
       drawPrev.set(e.offsetX, e.offsetY);
   });

   canvas.addEventListener('mousemove', (e) => {
       if (drawing) {
           draw(ctx, e.offsetX, e.offsetY);
       }
   });

   canvas.addEventListener('mouseup', (e) => {
       drawing = false;
   });

   window.addEventListener('mousemove', (e) => {
    e.preventDefault();
    var vector = new THREE.Vector3(( e.clientX / window.innerWidth ) * 2 - 1, -( e.clientY / window.innerHeight ) * 2 + 1, ( e.clientY / window.innerHeight ) * 2);
    vector.unproject( camera );
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.y/vector.y;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    arm.position.copy(pos);
    arm.position.x += 1.5;
    arm.position.y += 0.95;
   });

   document.getElementById("submit").addEventListener('click', onSubmit);
}

function draw(ctx, x, y) {

    ctx.beginPath();

    ctx.moveTo(drawPrev.x, drawPrev.y)
    ctx.strokeStyle = c;

       let colors = document.querySelectorAll('input[name="color"]');
        for (let x of colors) {
            if (x.checked) {
                c = x.value;
                break;
            }
        }
    ctx.lineWidth = 15;
    ctx.lineTo(x,y);
    ctx.stroke();
    drawPrev.set(x,y);
    
    ctx.closePath;

    material.map.needsUpdate = true;
}

function animation(time) {
  //  controls.update();
    renderer.render(scene, camera);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onSubmit() {
    paper = document.createElement('canvas');
    paper.id = "paper";
    paperctx = paper.getContext('2d');

    paperctx.canvas.width  = window.innerWidth/2;
    paperctx.canvas.height = window.innerHeight/2;

   // document.body.appendChild(paper);
    paperctx.drawImage(canvas, window.innerWidth/4, window.innerHeight/4, window.innerWidth/2, window.innerHeight/2, 0, 0, window.innerWidth/2, window.innerHeight/2);
    goodJob();
}

function goodJob() {
    paperctx.font = "30px Verdana";
    paperctx.fillStyle = "red";
    paperctx.fillText("Good job!! :)",window.innerWidth/4, window.innerHeight/3);

    let r = 10;
    let x = window.innerWidth/3;
    let y = window.innerHeight/3;
    paperctx.save();
    paperctx.beginPath();
    paperctx.translate(x, y);
    paperctx.moveTo(0,0-r);
    for (var i = 0; i < 5; i++) {
        paperctx.rotate(Math.PI / 5);
        paperctx.lineTo(0, 0 - (r*2));
        paperctx.rotate(Math.PI / 5);
        paperctx.lineTo(0, 0 - r);
    }
    paperctx.closePath();
    paperctx.fill();
    paperctx.restore();

    var img = paper.toDataURL("image/png");
    var w = window.open("");
    w.document.write('<img src="'+img+'"/>');
    w.document.close();

   // camera.rotation.set(1,1,1);
   //let i = 0;
   //while (i < 3) {
   // camera.lookAt(0,i,0);

    //camera.updateProjectionMatrix();
   // i += 0.001;
   //}
/*
    let sticker = new Image();
    sticker.src = 'assets/goodjob.png';
    ctx.drawImage(sticker, window.innerWidth/4, window.innerHeight/4);*/
}