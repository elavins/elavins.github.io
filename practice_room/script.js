
//
//
//

import * as TONE from 'https://unpkg.com/tone/build/Tone.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import {GLTFLoader} from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

//---------------variables-----------------//

let camera, scene, renderer;
let aspect, fov;
let instrument, sel;

let bbox, bboxPiano, bboxChair;
let room, model, chair, piano;

let thighL, thighR, calveL, calveR, lowerarmL, lowerarmR, upperarmL, upperarmR;

const loader = new GLTFLoader();

let points = 0;

const materials = {
    instrument: new THREE.MeshPhongMaterial({color: 0xffff00}),
    room: new THREE.MeshPhongMaterial({color: 0xfffbaf, side: THREE.BackSide}),
    model: new THREE.MeshPhongMaterial({color: 0xb5fffc, skinning: true}),
    chair: new THREE.MeshPhongMaterial({color: 0xffbaff}),
    piano: new THREE.MeshPhongMaterial({color: 0xb5bab5})
}

//---------------visuals for player actions---------------//

const action = {
    isSitting: false,
    isWalking: false,
    isPlaying: false,
    play: () => {
        instruments[sel].playPos();
        addPoint();
        console.log(points);
    },
    stopPlay: () => {
        action.isPlaying = false;
        instruments[sel].restPos();
    },
    forward: () => {
        updatebbox();
        if (!action.isSitting) {
            if (thighL.rotation.z > 0.3) {
                thighL.rotation.z *= -1;
                thighR.rotation.z *= -1;
            } else {
                thighL.rotation.z += 0.03;
                thighR.rotation.z += 0.03;
            }
            model.translateZ(0.05);            
            checkCollision(1);
        }  
    },
    turnL: () => {
        updatebbox();
        model.rotation.y += 0.1;
        checkCollision(1);
    },
    turnR: () => {
        updatebbox();
        model.rotation.y -= 0.1;
        checkCollision(1);
    },
    back: () => {
        updatebbox();
        if (!action.isSitting) {
            if (thighL.rotation.z > 0.3) {
                thighL.rotation.z *= -1;
                thighR.rotation.z *= -1;
            } else {
                thighL.rotation.z += 0.03;
                thighR.rotation.z += 0.03;
            }
            model.translateZ(-0.05);
            checkCollision(-1);
        }  
    },
    sit: () => {
        action.isSitting = true;
        thighL.rotation.z = 1;
        thighR.rotation.z = -1;
        calveL.rotation.z = -2;
        calveR.rotation.z = 2;
        model.position.y = 0.6;    
    },
    stand: () => {
        thighL.rotation.z = 0;
        thighR.rotation.z = 0;
        calveL.rotation.z = 0;
        calveR.rotation.z = 0;
        model.position.y = 1;
    }
}

//---------objects for user controls-----------//

const controller = {
    87: {pressed: false, func: action.forward},
    65: {pressed: false, func: action.turnL},
    68: {pressed: false, func: action.turnR},
    83: {pressed: false, func: action.back},
    32: {pressed: false, func: action.sit},
}

const keyhandler = {
    down: (e) => {
        if (controller[e.keyCode]) {
            controller[e.keyCode].pressed = true}
        },
    up: (e) => {
        if (controller[e.keyCode]) {
            controller[e.keyCode].pressed = false;
        }
        if (!controller[87].pressed) {
            action.isWalking = false;
            action.stand();
        }
        if (!controller[32].pressed) {
            action.isSitting = false;
            action.stand();
        }
    }
}

//-------------sound-related objects and variables--------------//

let synth;
const now = Tone.now();

const notes = ["C","D","E","F","G","A","B"];

const instruments = {
    airtube: {
        geo: new THREE.CylinderGeometry(0.03, 0.06, 0.6),
        timbre: new Tone.Synth().toDestination(),
        make: () => {
            instrument = new THREE.Mesh(instruments.airtube.geo, materials.instrument);
            instrument.rotation.x = -0.4;
            instrument.position.set(0.25, 0.4, 0.25);
            instrument.castShadow = true;
            instrument.receiveShadow = true;

            synth = instruments.airtube.timbre;
        },
        playPos: () => {
            lowerarmL.rotation.x = 2.2;
            lowerarmL.rotation.z = -0.4;

            lowerarmR.rotation.x = 1.3;
            lowerarmR.rotation.z = 0.6;

            instrument.rotation.x = -0.4;
          //  instrument.position.set(0.25, 0.4, 0.25);
        },
        restPos: () => {
            upperarmL.rotation.y = 0;
            lowerarmL.rotation.x = 1.8;
            lowerarmL.rotation.z = -0.5;

            upperarmR.rotation.y = 0;
            lowerarmR.rotation.x = 1.3;
            lowerarmR.rotation.z = 0.6;

            instrument.rotation.x = 0;
        }
    },
    trumpet: {
        geo: new THREE.CylinderGeometry(0.03, 0.1, 0.6),
        timbre: new Tone.AMSynth().toDestination(),
        make: () => {
            instrument = new THREE.Mesh(instruments.trumpet.geo, materials.instrument);
            instrument.rotation.x = 0;
            instruments.trumpet.restPos();
            instrument.castShadow = true;
            instrument.receiveShadow = true;

            synth = instruments.trumpet.timbre;
        },
        playPos: () => {
            upperarmL.rotation.y = -0.6;
            lowerarmL.rotation.x = 2;
            lowerarmL.rotation.z = -0.6;
            
            upperarmR.rotation.y = 0.6;
            lowerarmR.rotation.x = 2;
            lowerarmR.rotation.z = 0.6;

            instrument.rotation.x = -1.5;
            instrument.position.set(0.25, 0.65, 0.4);
        },
        restPos: () => {
            upperarmL.rotation.y = -0.6;
            lowerarmL.rotation.x = 1;
            lowerarmL.rotation.z = -0.4;
            
            upperarmR.rotation.y = 0.6;
            lowerarmR.rotation.x = 1;
            lowerarmR.rotation.z = 0.4;

            instrument.rotation.x = 0;
            instrument.position.set(0.25, 0.35, 0.4);
        }
    }
}

const sound = {
    start: (e) => {
        synth.triggerAttack(sound.getPitch(e.offsetY), now);
        action.play();
    },
    change: (e) => {
        synth.setNote(sound.getPitch(e.offsetY), now)
    },
    stop: () => {
        synth.triggerRelease(now);
        action.stopPlay();
    },
    getPitch: (y) => {
        let octave = Math.round(8 * (y/window.innerHeight));
        let oRange = Math.round(window.innerHeight/8);
        let oMin = octave * oRange;
        let oMax = oMin + oRange;
        let mouseScaled = Math.abs(Math.round(6 * (y-oMin)/(oMax-oMin) + 3));
        let note = notes[6 - mouseScaled];
    
        return note + (8 - octave);
    }
}

const metronome = {
    on: false,
    press: () => {
        if (!metronome.on) {metronome.start(); metronome.on = true;}
        else {metronome.stop(); metronome.on = false;} //unsure if this is the right way to handle this
    },
    start: () => {
        const metro = new Tone.MembraneSynth().toDestination();
        Tone.Transport.bpm.value = document.getElementById("bpm").value;
        Tone.Transport.scheduleRepeat((time) => {
            metro.triggerAttackRelease("C2");
        }, "4n");
        Tone.Transport.start();
    },
    stop: () => {Tone.Transport.stop()}
}


//
//
//
//

init();

//---------------initialize-----------------//

function init() {

    //--------scene--------//
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);

    //--------camera--------//
    aspect = window.innerWidth/window.innerHeight;
    fov = 5;

    camera = new THREE.OrthographicCamera(fov*aspect/-2, fov*aspect/2, fov/2, fov/-2, 0.1, 1000);
    camera.position.set(2,2.5,2);
    camera.lookAt(new THREE.Vector3(0,1,0));

    //--------lights--------//
    scene.add(new THREE.AmbientLight(0x505050));

    const spot = new THREE.SpotLight(0xffffff);
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

    scene.add(dir);

    //--------add room--------//
    room = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 4), materials.room);
    room.position.y = 2;
    room.receiveShadow = true;
    scene.add(room);

    //--------add instrument--------//
    instruments.airtube.make();

    //--------add player--------//
    loader.load('assets/model.glb', function(gltf) {
        model = gltf.scene;
        model.traverse(function(child) {
            if (child.isBone) {
                if (child.name === 'thighL') {thighL = child;}
                if (child.name === 'thighR') {thighR = child;}
                if (child.name === 'calveL') {calveL = child;}
                if (child.name === 'calveR') {calveR = child;}
                if (child.name === 'lowerarmL') {lowerarmL = child;}
                if (child.name === 'lowerarmR') {lowerarmR = child;}
                if (child.name === 'upperarmL') {upperarmL = child;}
                if (child.name === 'upperarmR') {upperarmR = child;}
            } else if (child.isMesh) {
                child.material = materials.model;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })

        model.position.y = 1;
        model.add(instrument);
        scene.add(model);
        
        bbox = new THREE.Box3().setFromObject(model.children[0]);
        }, undefined, function( err ){
            console.error( "Error loading object" + err)
        }
    );
    
    //--------add chair--------//
    loader.load('assets/chair.glb', function(gltf) {
        chair = gltf.scene;
        chair.position.set(1, 0.1, -1);
        chair.rotation.y = 1;
        chair.traverse(function(child) {
                if (child.isMesh) {
                    child.material = materials.chair;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            })
        scene.add(chair);
        bboxChair = new THREE.Box3().setFromObject(chair);
        }, undefined, function(err) {
            console.error("Error loading object" + err);
        }
    );

    //--------add piano--------//
    loader.load('assets/piano.glb', function(gltf) {
        piano = gltf.scene;
        piano.position.set(-1.2, 0.5, -0.8);
        piano.rotation.y = 0;
        piano.traverse(function(child) {
                if (child.isMesh) {
                    child.material = materials.piano;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            })
        scene.add(piano);
        bboxPiano = new THREE.Box3().setFromObject(piano);
        }, undefined, function(err) {
            console.error("Error loading object" + err);
        }
    );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);

    fillDOM();
}

function fillDOM() {
    document.getElementById("container").appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('keydown', keyhandler.down, false);
    document.addEventListener('keyup', keyhandler.up, false);

    document.getElementById("soundWrapper").addEventListener('mousedown', sound.start);
    document.getElementById("soundWrapper").addEventListener('mousemove', sound.change);
    document.addEventListener('mouseup', sound.stop);

    document.getElementById("metro").addEventListener('click', metronome.press);
    document.getElementById("instrument").addEventListener('click', changeInstr);

    var p = document.createElement('p');
    p.innerHTML = "practice points: " + points;
    document.getElementById("info").appendChild(p);

    for (var i in instruments) {
        var opt = document.createElement("option");
        var txt = document.createTextNode(i);
        opt.appendChild(txt);
        opt.setAttribute("value",i);
        document.getElementById("instrument").appendChild(opt);
    }

    sel = document.getElementById("instrument").value;
}


function addPoint() {
    points++;
    var p = document.getElementsByTagName('p');
    p.innerHTML = "practice points: " + points;
}

function animation(time) {
    executeMoves();
    renderer.render(scene, camera);
}

const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
        controller[key].pressed && controller[key].func();
    });
}


function changeInstr() {
    sel = document.getElementById("instrument").value;
    model.remove(instrument);
    instruments[sel].make();
    instruments[sel].restPos();
    model.add(instrument);
}

function updatebbox() {
    bbox.setFromObject(model);
    bbox.min.y = -2;
    bbox.min.x = model.position.x;
    bbox.min.z = model.position.z;
    bbox.max.y = 4;
}

function checkCollision(dir) {
    if (bbox.intersectsBox(bboxPiano) ||
            bbox.intersectsBox(bboxChair)) {
        console.log("hit");
        model.translateZ(dir * -0.05);
    }

    if (model.position.x > 1.5 || model.position.x < -1.5 ||
        model.position.z > 2 || model.position.z < -2 ) {
        model.translateZ(dir * -0.05);
    }
}

function onWindowResize(){
    aspect = window.innerWidth/window.innerHeight;
    camera.left = fov * aspect/-2;
    camera.right = fov * aspect/2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
