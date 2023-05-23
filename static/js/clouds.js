/*
MIT License

Copyright (c) 2020 Jaume Sanchez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/spite/CSS3DClouds/
*/

/*
  Defining our variables
  world and viewport are DOM elements,
  world_angle_x and world_angle_y are floats that hold the world rotations,
  distance is an int that defines the distance of the world from the camera
*/
let world = document.getElementById("cloud_world");
let viewport = document.getElementById("cloud_viewport");
let world_angle_x = 0;
let world_angle_y = 0;
let distance = 0;
let frame_count = 0;
let previous_time = 0;
let previous_frame = 0;
let framerate;

window.addEventListener("mousemove", event => {
  let degrees = 90; //camera rotation range
  world_angle_y = -(0.5 - (event.clientX / window.innerWidth)) * degrees;
  world_angle_x = (0.5 - (event.clientY / window.innerHeight)) * degrees;
  update_view();
});

window.addEventListener("scroll", event => {
  let pos = document.documentElement.scrollTop || document.body.scrollTop;
  distance = pos;
  update_view();
})

/*
  Changes the transform property of world to be
  translated in the Z axis by distance pixels,
  rotated in the X axis by world_angle_x degrees and
  rotated in the Y axis by world_angle_y degrees.
*/
function update_view() {
  world.style.transform = `
    translateZ(${distance}px)
    rotateX(${world_angle_x}deg)
    rotateY(${world_angle_y}deg)
  `;
}

/*
  objects is an array of cloud bases
  layers is an array of cloud layers
*/
var objects = [],
layers = [];
/*
  Clears the DOM of previous clouds bases
  and generates a new set of cloud bases
*/
function generate() {
  objects = [];
  layers = [];
  if ( world.hasChildNodes() ) {
    while (world.childNodes.length >= 1) {
      world.removeChild(world.firstChild);
    }
  }

  for( var j = 0; j < 5; j++ ) {
    objects.push(create_cloud());
  }
}

/*
  Creates a single cloud base and adds several cloud layers.
  Each cloud layer has random position ( x, y, z ), rotation (a)
  and rotation speed (s). layers[] keeps track of those divs.
*/
function create_cloud() {
  let cloud_base = document.createElement("div");
  cloud_base.className = "cloud_base";

  let cloud_x = -window.innerWidth/4 + Math.random()*window.innerWidth/2;
  let cloud_y = -window.innerHeight/4 + Math.random()*window.innerHeight/2;
  let cloud_z = Math.random() * 200;

  cloud_base.style.transform = `
    translateX(${cloud_x}px)
    translateY(${cloud_y}px)
    translateZ(${cloud_z}px)
  `;
  world.append(cloud_base);

  let iterations = 5 + Math.round(Math.random()*10);
  for (let i=0; i<iterations; i++) {
    let cloud_layer = document.createElement("div");
    let data = {
      x: -256 + Math.random() * 512,
      y: -256 + Math.random() * 512,
      z: -256 + Math.random() * 512,
      rotation: Math.random() * 360,
      scale: 0.25 + Math.random()/2,
      speed: -1/32 + Math.random()/16
    };
    cloud_layer.className = "cloud_layer";
    cloud_layer.style.transform = `
      translateX(${data.x}px)
      translateY(${data.y}px)
      translateZ(${data.z}px)
      rotateZ(${data.rotation}deg)
      scale(${data.scale})
    `;
    cloud_layer.data = data;

    cloud_base.append(cloud_layer);
    layers.push(cloud_layer);
  }

  return cloud_base;
}

function timer() {
  let now = performance.now()/1000;
  framerate = (frame_count - previous_frame) / (now - previous_time);
  previous_frame = frame_count;
  previous_time = now;
}

setInterval(timer, 500);

function apply_rotations() {
  for (let layer of layers) {
    let data = layer.data;
    data.rotation += data.speed;
    data.rotation %= 360;
  }
}

setInterval(apply_rotations, 50/3) //60 times/sec

/*
  Iterate layers[], update the rotation and apply the
  inverse transformation currently applied to the world.
  Notice the order in which rotations are applied.
*/
function update(){
  for( var j = 0; j < layers.length; j++ ) {
    var layer = layers[ j ];
    let data = layer.data;

    layer.style.transform = `
      translateX(${data.x}px)
      translateY(${data.y}px)
      translateZ(${data.z}px)
      rotateY(${-world_angle_y}deg)
      rotateX(${-world_angle_x}deg)
      rotateZ(${data.rotation}deg)
      scale(${data.scale})
    `;
  }

  frame_count++;
  requestAnimationFrame(update);
}

update();