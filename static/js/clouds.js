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
  worldXAngle and worldYAngle are floats that hold the world rotations,
  d is an int that defines the distance of the world from the camera
*/
let world = document.getElementById("cloud_world");
let viewport = document.getElementById("cloud_viewport");
let worldXAngle = 0;
let worldYAngle = 0;
let d = 0;

/*
  Event listener to transform mouse position into angles
  from -180 to 180 degress, both vertically and horizontally
*/
window.addEventListener( "mousemove", function(event) {
  worldYAngle = -( .5 - ( event.clientX / window.innerWidth ) ) * 180;
  worldXAngle = ( .5 - ( event.clientY / window.innerHeight ) ) * 180;
  updateView();
});

/*
  Changes the transform property of world to be
  translated in the Z axis by d pixels,
  rotated in the X axis by worldXAngle degrees and
  rotated in the Y axis by worldYAngle degrees.
*/
function updateView() {
  world.style.transform = "translateZ( " + d + "px ) \
  rotateX( " + worldXAngle + "deg) \
  rotateY( " + worldYAngle + "deg)";
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
    objects.push(createCloud());
  }
}

/*
  Creates a single cloud base and adds several cloud layers.
  Each cloud layer has random position ( x, y, z ), rotation (a)
  and rotation speed (s). layers[] keeps track of those divs.
*/
function createCloud() {
  let cloud_base = document.createElement("div");
  cloud_base.className = "cloud_base";

  let cloud_x = Math.random() * 500;
  let cloud_y = Math.random() * 500;
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
      x: -128 + Math.random() * 256,
      y: -128 + Math.random() * 256,
      z: -100 + Math.random() * 200,
      rotation: Math.random() * 360,
      scale: 0.25 + Math.random(),
      speed: -1/16 + Math.random()/8
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

/*
  Iterate layers[], update the rotation and apply the
  inverse transformation currently applied to the world.
  Notice the order in which rotations are applied.
*/
function update(){
  for( var j = 0; j < layers.length; j++ ) {
    var layer = layers[ j ];
    let data = layer.data;
    data.rotation += data.speed;

    layer.style.transform = `
      translateX(${data.x}px)
      translateY(${data.y}px)
      translateZ(${data.z}px)
      rotateY(${-worldYAngle}deg)
      rotateX(${-worldXAngle}deg)
      rotateZ(${data.rotation}deg)
      scale(${data.scale})
    `;
  }

  requestAnimationFrame(update);
}

update();