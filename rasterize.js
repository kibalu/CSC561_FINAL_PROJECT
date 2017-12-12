/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const INPUT_TRIANGLES_URL = "https://kibalu.github.io/prog3/cubes.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://kibalu.github.io/prog3/spheres.json"; // ellipsoids file loc


var context;
var defaultEye = vec3.fromValues(0, 0, -0.5); // default eye position in world space
var defaultCenter = vec3.fromValues(0, 0, 0.5); // default view direction in world space
var defaultUp = vec3.fromValues(0, 1, 0); // default view up vector
var lightAmbient = vec3.fromValues(1, 1, 1); // default light ambient emission
var lightDiffuse = vec3.fromValues(1, 1, 1); // default light diffuse emission
var lightSpecular = vec3.fromValues(1, 1, 1); // default light specular emission
var lightPosition = vec3.fromValues(0, 0, -0.5); // default light position
/* webgl and geometry data */
var gl = null; // the all powerful gl object. It's all here folks!
var inputTriangles = []; // the triangle data as loaded from input files
var numTriangleSets = 0; // how many triangle sets in input scene
var inputSpheres = []; // the ellipsoid data as loaded from input files
var numSpheres = 0; // how many ellipsoids in the input scene

var vertexBuffers = []; // this contains vertex coordinate lists by set, in triples
var normalBuffers = []; // this contains normal component lists by set, in triples
var triSetSizes = []; // this contains the size of each triangle set
var triangleBuffers = []; // lists of indices into vertexBuffers by set, in triples

/* shader parameter locations */
var vPosAttribLoc; // where to put position for vertex shader
var mMatrixULoc; // where to put model matrix for vertex shader
var pvmMatrixULoc; // where to put project model view matrix for vertex shader
var ambientULoc; // where to put ambient reflecivity for fragment shader
var diffuseULoc; // where to put diffuse reflecivity for fragment shader
var specularULoc; // where to put specular reflecivity for fragment shader
var shininessULoc; // where to put specular exponent for fragment shader

var anticount = 0;
var score = 0;
var miss_remain = 12;
var	batteries = 3;
var level = 1;
var fail = false;

var Eye = vec3.clone(defaultEye); // eye position in world space
var crash = new Audio('crash.mp3');
var click = new Audio('click.mp3');
var leftcount = 0;
var middlecount = 6;
var rightcount = 12;



function handleKeyDown(e) {
    //if (anticount > 23) return;
    var x = (e.pageX - 400) / 400;
    var y = -(e.pageY - 400) / 400;
    var cur = x;

    if(cur < -0.56){
    	if(inputTriangles[0].alive && leftcount < 6){
    		inputSpheres[leftcount].alive = true;
    		inputSpheres[leftcount].destination = [x, y];
    		inputSpheres[leftcount].angle = Math.atan2(y - inputSpheres[leftcount].y, x - inputSpheres[leftcount].x);
    		leftcount++;
    		click.play();
    	}else if(inputTriangles[1].alive && middlecount < 12){
    		inputSpheres[middlecount].alive = true;
    		inputSpheres[middlecount].destination = [x, y];
    		inputSpheres[middlecount].angle = Math.atan2(y - inputSpheres[middlecount].y, x - inputSpheres[middlecount].x);
    		middlecount++;
    		click.play();
    	}else if(inputTriangles[2].alive && rightcount < 18){
    		inputSpheres[rightcount].alive = true;
    		inputSpheres[rightcount].destination = [x, y];
    		inputSpheres[rightcount].angle = Math.atan2(y - inputSpheres[rightcount].y, x - inputSpheres[rightcount].x);
    		rightcount++;
    		click.play();
    	}
    }
    if(cur <= 0.56 && cur >= - 0.56){
    	if(inputTriangles[1].alive && middlecount < 12){
    		inputSpheres[middlecount].alive = true;
    		inputSpheres[middlecount].destination = [x, y];
    		inputSpheres[middlecount].angle = Math.atan2(y - inputSpheres[middlecount].y, x - inputSpheres[middlecount].x);
    		middlecount++;
    		click.play();
    	}else if(inputTriangles[2].alive && rightcount < 18){
    		inputSpheres[rightcount].alive = true;
    		inputSpheres[rightcount].destination = [x, y];
    		inputSpheres[rightcount].angle = Math.atan2(y - inputSpheres[rightcount].y, x - inputSpheres[rightcount].x);
    		rightcount++;
    		click.play();
    	}else if(inputTriangles[0].alive && leftcount < 6){
    		inputSpheres[leftcount].alive = true;
    		inputSpheres[leftcount].destination = [x, y];
    		inputSpheres[leftcount].angle = Math.atan2(y - inputSpheres[leftcount].y, x - inputSpheres[leftcount].x);
    		leftcount++;
    		click.play();
    	}
    }
    if(cur > 0.56){
    	if(inputTriangles[2].alive && rightcount < 18){
    		inputSpheres[rightcount].alive = true;
    		inputSpheres[rightcount].destination = [x, y];
    		inputSpheres[rightcount].angle = Math.atan2(y - inputSpheres[rightcount].y, x - inputSpheres[rightcount].x);
    		rightcount++;
    		click.play();
    	}else if(inputTriangles[1].alive && middlecount < 12){
    		inputSpheres[middlecount].alive = true;
    		inputSpheres[middlecount].destination = [x, y];
    		inputSpheres[middlecount].angle = Math.atan2(y - inputSpheres[middlecount].y, x - inputSpheres[middlecount].x);
    		middlecount++;
    		click.play();
    	}else if(inputTriangles[0].alive && leftcount < 6){
    		inputSpheres[leftcount].alive = true;
    		inputSpheres[leftcount].destination = [x, y];
    		inputSpheres[leftcount].angle = Math.atan2(y - inputSpheres[leftcount].y, x - inputSpheres[leftcount].x);
    		leftcount++;
    		click.play();
    	}
    }
}
var bkgdImage = new Image();
var cw, ch, iw, ih;
// set up the webGL environment
function setupWebGL() {

    document.addEventListener("click", handleKeyDown);
    // Get the image canvas, render an image in it
    var imageCanvas = document.getElementById("myImageCanvas"); // create a 2d canvas
    imageContext = imageCanvas.getContext("2d");
    cw = imageCanvas.width, ch = imageCanvas.height; 
    context = imageCanvas.getContext("2d"); 
    //var bkgdImage = new Image(); 
    bkgdImage.crossOrigin = "Anonymous";
    bkgdImage.src = "https://kibalu.github.io/prog3/sky.jpg";
    bkgdImage.onload = function () {
        iw = bkgdImage.width;
        ih = bkgdImage.height;
        imageContext.drawImage(bkgdImage, 0, 0, iw, ih, 0, 0, cw, ch);
        addscore(context);
    } // end onload callback

    // create a webgl canvas and set it up
    var webGLCanvas = document.getElementById("myWebGLCanvas"); // create a webgl canvas
    gl = webGLCanvas.getContext("webgl"); // get a webgl object from it
    try {
        if (gl == null) {
            throw "unable to create gl context -- is your browser gl ready?";
        } else {
            //gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
            gl.clearDepth(1.0); // use max when we clear the depth buffer
            gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
        }
    } // end try

    catch (e) {
        console.log(e);
    } // end catch
} // end setupWebGL

function addscore(context, flag) {

    context.clearRect(0, 0, 800, 800);

    imageContext.drawImage(bkgdImage, 0, 0, iw, ih, 0, 0, cw, ch);
    context.beginPath();

    context.font = "30px Arial";
    context.fillText("Level: " + level, 0, 20);
    context.fillText("Score: " + score, 0, 45);
    if(flag == 1){
    	context.fillText("GAME OVER", 300, 300);
    }
    context.stroke();

}


inputTriangles = [
 {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.6], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-0.85, -0.85, 0.5],[-0.75, -0.85, 0.5],[-0.75, -0.65, 0.5],[-0.85, -0.65, 0.5],
      [-0.85, -0.85, 0.6],[-0.75, -0.85, 0.6],[-0.75, -0.65, 0.6],[-0.85, -0.65, 0.6],
      [-0.85, -0.65, 0.5],[-0.75, -0.65, 0.5],[-0.75, -0.65, 0.6],[-0.85, -0.65, 0.6],
      [-0.85, -0.85, 0.5],[-0.75, -0.85, 0.5],[-0.75, -0.85, 0.6],[-0.85, -0.85, 0.6],
      [-0.85, -0.85, 0.6],[-0.85, -0.85, 0.5],[-0.85, -0.65, 0.5],[-0.85, -0.65, 0.6],
      [-0.75, -0.85, 0.6],[-0.75, -0.85, 0.5],[-0.75, -0.65, 0.5],[-0.75, -0.65, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
{
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.6], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-0.05, -0.85, 0.5],[0.05, -0.85, 0.5],[0.05, -0.65, 0.5],[-0.05, -0.65, 0.5],
      [-0.05, -0.85, 0.6],[0.05, -0.85, 0.6],[0.05, -0.65, 0.6],[-0.05, -0.65, 0.6],
      [-0.05, -0.65, 0.5],[0.05, -0.65, 0.5],[0.05, -0.65, 0.6],[-0.05, -0.65, 0.6],
      [-0.05, -0.85, 0.5],[0.05, -0.85, 0.5],[0.05, -0.85, 0.6],[-0.05, -0.85, 0.6],
      [-0.05, -0.85, 0.6],[-0.05, -0.85, 0.5],[-0.05, -0.65, 0.5],[-0.05, -0.65, 0.6],
      [0.05, -0.85, 0.6],[0.05, -0.85, 0.5],[0.05, -0.65, 0.5],[0.05, -0.65, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.6], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [0.85, -0.85, 0.5],[0.75, -0.85, 0.5],[0.75, -0.65, 0.5],[0.85, -0.65, 0.5],
      [0.85, -0.85, 0.6],[0.75, -0.85, 0.6],[0.75, -0.65, 0.6],[0.85, -0.65, 0.6],
      [0.85, -0.65, 0.5],[0.75, -0.65, 0.5],[0.75, -0.65, 0.6],[0.85, -0.65, 0.6],
      [0.85, -0.85, 0.5],[0.75, -0.85, 0.5],[0.75, -0.85, 0.6],[0.85, -0.85, 0.6],
      [0.85, -0.85, 0.6],[0.85, -0.85, 0.5],[0.85, -0.65, 0.5],[0.85, -0.65, 0.6],
      [0.75, -0.85, 0.6],[0.75, -0.85, 0.5],[0.75, -0.65, 0.5],[0.75, -0.65, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-0.65, -0.92, 0.55],[-0.55, -0.92, 0.55],[-0.55, -0.82, 0.55],[-0.65, -0.82, 0.55],
      [-0.65, -0.92, 0.6],[-0.55, -0.92, 0.6],[-0.55, -0.82, 0.6],[-0.65, -0.82, 0.6],
      [-0.65, -0.82, 0.55],[-0.55, -0.82, 0.55],[-0.55, -0.82, 0.6],[-0.65, -0.82, 0.6],
      [-0.65, -0.92, 0.55],[-0.55, -0.92, 0.55],[-0.55, -0.92, 0.6],[-0.65, -0.92, 0.6],
      [-0.65, -0.92, 0.6],[-0.65, -0.92, 0.55],[-0.65, -0.82, 0.55],[-0.65, -0.82, 0.6],
      [-0.55, -0.92, 0.6],[-0.55, -0.92, 0.55],[-0.55, -0.82, 0.55],[-0.55, -0.82, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-0.45, -0.9, 0.55],[-0.35, -0.9, 0.55],[-0.35, -0.8, 0.55],[-0.45, -0.8, 0.55],
      [-0.45, -0.9, 0.6],[-0.35, -0.9, 0.6],[-0.35, -0.8, 0.6],[-0.45, -0.8, 0.6],
      [-0.45, -0.8, 0.55],[-0.35, -0.8, 0.55],[-0.35, -0.8, 0.6],[-0.45, -0.8, 0.6],
      [-0.45, -0.9, 0.55],[-0.35, -0.9, 0.55],[-0.35, -0.9, 0.6],[-0.45, -0.9, 0.6],
      [-0.45, -0.9, 0.6],[-0.45, -0.9, 0.55],[-0.45, -0.8, 0.55],[-0.45, -0.8, 0.6],
      [-0.35, -0.9, 0.6],[-0.35, -0.9, 0.55],[-0.35, -0.8, 0.55],[-0.35, -0.8, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-0.25, -0.9, 0.55],[-0.15, -0.9, 0.55],[-0.15, -0.8, 0.55],[-0.25, -0.8, 0.55],
      [-0.25, -0.9, 0.6],[-0.15, -0.9, 0.6],[-0.15, -0.8, 0.6],[-0.25, -0.8, 0.6],
      [-0.25, -0.8, 0.55],[-0.15, -0.8, 0.55],[-0.15, -0.8, 0.6],[-0.25, -0.8, 0.6],
      [-0.25, -0.9, 0.55],[-0.15, -0.9, 0.55],[-0.15, -0.9, 0.6],[-0.25, -0.9, 0.6],
      [-0.25, -0.9, 0.6],[-0.25, -0.9, 0.55],[-0.25, -0.8, 0.55],[-0.25, -0.8, 0.6],
      [-0.15, -0.9, 0.6],[-0.15, -0.9, 0.55],[-0.15, -0.8, 0.55],[-0.15, -0.8, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [0.55, -0.9, 0.55],[0.65, -0.9, 0.55],[0.65, -0.8, 0.55],[0.55, -0.8, 0.55],
      [0.55, -0.9, 0.6],[0.65, -0.9, 0.6],[0.65, -0.8, 0.6],[0.55, -0.8, 0.6],
      [0.55, -0.8, 0.55],[0.65, -0.8, 0.55],[0.65, -0.8, 0.6],[0.55, -0.8, 0.6],
      [0.55, -0.9, 0.55],[0.65, -0.9, 0.55],[0.65, -0.9, 0.6],[0.55, -0.9, 0.6],
      [0.55, -0.9, 0.6],[0.55, -0.9, 0.55],[0.55, -0.8, 0.55],[0.55, -0.8, 0.6],
      [0.65, -0.9, 0.6],[0.65, -0.9, 0.55],[0.65, -0.8, 0.55],[0.65, -0.8, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [0.35, -0.9, 0.55],[0.45, -0.9, 0.55],[0.45, -0.8, 0.55],[0.35, -0.8, 0.55],
      [0.35, -0.9, 0.6],[0.45, -0.9, 0.6],[0.45, -0.8, 0.6],[0.35, -0.8, 0.6],
      [0.35, -0.8, 0.55],[0.45, -0.8, 0.55],[0.45, -0.8, 0.6],[0.35, -0.8, 0.6],
      [0.35, -0.9, 0.55],[0.45, -0.9, 0.55],[0.45, -0.9, 0.6],[0.35, -0.9, 0.6],
      [0.35, -0.9, 0.6],[0.35, -0.9, 0.55],[0.35, -0.8, 0.55],[0.35, -0.8, 0.6],
      [0.45, -0.9, 0.6],[0.45, -0.9, 0.55],[0.45, -0.8, 0.55],[0.45, -0.8, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [0.15, -0.9, 0.55],[0.25, -0.9, 0.55],[0.25, -0.8, 0.55],[0.15, -0.8, 0.55],
      [0.15, -0.9, 0.6],[0.25, -0.9, 0.6],[0.25, -0.8, 0.6],[0.15, -0.8, 0.6],
      [0.15, -0.8, 0.55],[0.25, -0.8, 0.55],[0.25, -0.8, 0.6],[0.15, -0.8, 0.6],
      [0.15, -0.9, 0.55],[0.25, -0.9, 0.55],[0.25, -0.9, 0.6],[0.15, -0.9, 0.6],
      [0.15, -0.9, 0.6],[0.15, -0.9, 0.55],[0.15, -0.8, 0.55],[0.15, -0.8, 0.6],
      [0.25, -0.9, 0.6],[0.25, -0.9, 0.55],[0.25, -0.8, 0.55],[0.25, -0.8, 0.6]

    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  },
  {
    "material": {"ambient": [0.3,0.3,0.3], "diffuse": [0.0,0.0,0.6], "specular": [0.3,0.3,0.3],"n": 10},
    "vertices": [
      [-1.5, -1.0, 0.0],[1.5, -1.0, 0.0],[1.5, -0.9, 0.0],[-1.5, -0.9, 0.0],
      [-1.5, -1.0, 0.8],[1.5, -1.0, 0.8],[1.5, -0.9, 0.8],[-1.5, -0.9, 0.8],
      [-1.5, -0.9, 0.0],[1.5, -0.9, 0.0],[1.5, -0.9, 0.8],[-1.5, -0.9, 0.8],
      [-1.5, -1.0, 0.0],[1.5, -1.0, 0.0],[1.5, -1.0, 0.8],[-1.5, -1.0, 0.8],
      [-1.5, -1.0, 0.8],[-1.5, -1.0, 0.8],[-1.5, -0.9, 0.0],[-1.5, -0.9, 0.8],
      [1.5, -1.0, 0.6],[1, -1.5, 0.0],[1.5, -0.9, 0.0],[1.5, -0.9, 0.8]
    ],
    "normals": [
      [0, 0, -1],[0, 0,-1],[0, 0,-1],[0, 0,-1],
      [0, 0, 1],[0, 0, 1],[0, 0, 1],[0, 0, 1],
      [0, 1, 0],[0, 1, 0],[0, 1, 0],[0, 1, 0],
      [0, -1, 0],[0, -1, 0],[0, -1, 0],[0, -1, 0],
      [-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],
      [1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]
    ],
    "triangles": [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[8,9,10],[8,10,11],[12,13,14],[12,14,15],[16,17,18],[16,18,19],[20,21,22],[20,22,23]]
  }
];


inputSpheres = [
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": -0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":0},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.0, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":1},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.8, "y": -0.7, "z": 0.5, "r":0.04, "ambient": [0.2,0.2,0.2], "diffuse": [0.1,0.2,0.2], "specular": [0.0,0.0,0.0],"n": 8,"type":"anti","battery":2},
  {"x": 0.22, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 0},
  {"x": -0.22, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 1},
  {"x": 0.0, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 2},
  {"x": -0.8, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": -0.1, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile","target" : 10},
  {"x": 0.7, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": -0.6, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": -0.45, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": -0.3, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": 0.55, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},
  {"x": 0.4, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10},

  {"x": 0.2, "y": 0.9, "z": 0.5, "r":0.04, "ambient": [0.3,0.3,0.3], "diffuse": [0.6,0.0,0.0], "specular": [0.0,0.0,0.0],"n": 8,"type":"missile", "target" : 10}

 ];
// read models in, load them into webgl buffers
function loadModels() {

    //inputTriangles = getJSONFile(INPUT_TRIANGLES_URL, "triangles"); // read in the triangle data
        // make an ellipsoid, with numLongSteps longitudes.
    // start with a sphere of radius 1 at origin
    // Returns verts, tris and normals.
   
    try {
        if (inputTriangles == String.null)
            throw "Unable to load triangles file!";
        else {
            var whichSetVert; // index of vertex in current triangle set
            var whichSetTri; // index of triangle in current triangle set
            var vtxToAdd; // vtx coords to add to the coord array
            var normToAdd; // vtx normal to add to the coord array
            var uvToAdd; // uv coords to add to the uv arry
            var triToAdd; // tri indices to add to the index array
  			
            numTriangleSets = inputTriangles.length; // remember how many tri sets
            for (var whichSet = 0; whichSet < numTriangleSets; whichSet++) { // for each tri set
                inputTriangles[whichSet].alive = true;
                // set up the vertex and normal arrays, define model center and axes
                inputTriangles[whichSet].glVertices = []; // flat coord list for webgl
                inputTriangles[whichSet].glNormals = []; // flat normal list for webgl


                var numVerts = inputTriangles[whichSet].vertices.length; // num vertices in tri set
                for (whichSetVert = 0; whichSetVert < numVerts; whichSetVert++) { // verts in set
                    vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert]; // get vertex to add
                    normToAdd = inputTriangles[whichSet].normals[whichSetVert]; // get normal to add
                    inputTriangles[whichSet].glVertices.push(vtxToAdd[0], vtxToAdd[1], vtxToAdd[2]); // put coords in set coord list
                    inputTriangles[whichSet].glNormals.push(normToAdd[0], normToAdd[1], normToAdd[2]); // put normal in set coord list
                    
                } // end for vertices in set
         
                inputTriangles[whichSet].center = [
                    (inputTriangles[whichSet].vertices[2][0] + inputTriangles[whichSet].vertices[3][0]) / 2,
                    (inputTriangles[whichSet].vertices[2][1] + inputTriangles[whichSet].vertices[3][1]) / 2,
                    (inputTriangles[whichSet].vertices[2][2] + inputTriangles[whichSet].vertices[3][2]) / 2,
                ];

                // send the vertex coords and normals to webGL
                vertexBuffers[whichSet] = gl.createBuffer(); // init empty webgl set vertex coord buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[whichSet]); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(inputTriangles[whichSet].glVertices), gl.STATIC_DRAW); // data in

                normalBuffers[whichSet] = gl.createBuffer(); // init empty webgl set normal component buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[whichSet]); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(inputTriangles[whichSet].glNormals), gl.STATIC_DRAW); // data in
                // set up the triangle index array, adjusting indices across sets
                inputTriangles[whichSet].glTriangles = []; // flat index list for webgl
                triSetSizes[whichSet] = inputTriangles[whichSet].triangles.length; // number of tris in this set
                for (whichSetTri = 0; whichSetTri < triSetSizes[whichSet]; whichSetTri++) {
                    triToAdd = inputTriangles[whichSet].triangles[whichSetTri]; // get tri to add
                    inputTriangles[whichSet].glTriangles.push(triToAdd[0], triToAdd[1], triToAdd[2]); // put indices in set list
                } // end for triangles in set

                // send the triangle indices to webGL
                triangleBuffers.push(gl.createBuffer()); // init empty triangle index buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[whichSet]); // activate that buffer
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inputTriangles[whichSet].glTriangles), gl.STATIC_DRAW); // data in

            } // end for each triangle set

            numSpheres = inputSpheres.length;

            if (inputSpheres == String.null)
                throw "Unable to load spheres file!";
            else {

                
            	var latitudeBands = 20;
    			var longitudeBands = 20;
            	var whichSetTri; // index of triangle in current triangle set
        		var vtxToAdd = []; // vtx coords to add to the coord array
        			//var ellipsoidsSets.array = [];
        		for (var whichSet = 0; whichSet < inputSpheres.length; whichSet++) {
        			if (inputSpheres[whichSet].type != "battery") {
                        inputSpheres[whichSet].mMatrix = mat4.create();
                    }

                    inputSpheres[whichSet].alive = inputSpheres[whichSet].type != "anti";
            		var curSet = inputSpheres[whichSet];
            		var ellipsoidSet = {};
            		ellipsoidSet.triBufferSize = 0;
           			ellipsoidSet.specularModel = 1;
            		ellipsoidSet.material = {};
            		ellipsoidSet.material.diffuse = curSet.diffuse;
            		ellipsoidSet.material.ambient = curSet.ambient;
            		ellipsoidSet.material.specular = curSet.specular; 
            		ellipsoidSet.material.n = curSet.n;
            		ellipsoidSet.coordArray = []; // 1D array of vertex coords for WebGL
            		ellipsoidSet.normalArray = []; // 1D array of vertex normals for WebGL
            		ellipsoidSet.indexArray = []; // 1D array of vertex indices for WebGL 
            		ellipsoidSet.triCenterArray = [];

            		var triCenter = vec3.fromValues(curSet.x, curSet.y, curSet.z);
            		ellipsoidSet.triCenterArray.push(triCenter);


            		for(var latNumber = 0; latNumber <= latitudeBands; latNumber ++) {
                	var theta = latNumber * Math.PI / latitudeBands;
                	var sinTheta = Math.sin(theta);
                	var cosTheta = Math.cos(theta);
                	for(var longNumber = 0; longNumber <= longitudeBands; longNumber ++) {
                    	var phi = longNumber * 2 * Math.PI / longitudeBands;
                    	var sinPhi = Math.sin(phi);
                    	var cosPhi = Math.cos(phi);
                    	var x = cosPhi * sinTheta;
                    	var y = cosTheta;
                    	var z = sinPhi * sinTheta;
                    	ellipsoidSet.coordArray.push(curSet.x + x * curSet.r, curSet.y + y * curSet.r, curSet.z + z * curSet.r);
                    	//console.log(ellipsoidSet.coordArray);
                    	ellipsoidSet.normalArray.push(x , y , z );
                    	//console.log("normalArray:"+ellipsoidSet.normalArray);
                	}
            	}
            	for(var latNumber = 0; latNumber < latitudeBands; latNumber ++) {
                	for(var longNumber = 0; longNumber < longitudeBands; longNumber ++,ellipsoidSet.triBufferSize += 6) {
                    	var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    	var second = first + longitudeBands + 1;
                    	ellipsoidSet.indexArray.push(first);
                    	ellipsoidSet.indexArray.push(second);
                    	ellipsoidSet.indexArray.push(first + 1);
                    	ellipsoidSet.indexArray.push(second);
                    	ellipsoidSet.indexArray.push(second + 1);
                    	ellipsoidSet.indexArray.push(first + 1);
                    	//console.log(ellipsoidSet.coordArray);
                	}
            	}
            //ellipsoidSet.vertexBuffer = gl.createBuffer();
            	vertexBuffers.push(gl.createBuffer()); // init empty webgl ellipsoid vertex coord buffer
            	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[vertexBuffers.length - 1]); // activate that buffer
            	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsoidSet.coordArray), gl.STATIC_DRAW); // data in

            	normalBuffers.push(gl.createBuffer()); // init empty webgl ellipsoid vertex coord buffer
            	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[normalBuffers.length - 1]); // activate that buffer
            	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsoidSet.normalArray), gl.STATIC_DRAW); // data in

            	triSetSizes.push(ellipsoidSet.indexArray.length);

                    // send the triangle indices to webGL
             	triangleBuffers.push(gl.createBuffer()); // init empty triangle index buffer
           		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[triangleBuffers.length - 1]); // activate that buffer
            	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ellipsoidSet.indexArray), gl.STATIC_DRAW); // data in

                } // end for each ellipsoid
            } // end if ellipsoid file loaded
        } // end if triangle file loaded
    } // end try

    catch (e) {
        console.log(e);
    } // end catch
} // end load models

// setup the webGL shaders
function setupShaders() {

    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 aVertexPosition; // vertex position
        attribute vec3 aVertexNormal; // vertex normal
        
        uniform mat4 umMatrix; // the model matrix
        uniform mat4 upvmMatrix; // the project view model matrix
        
        varying vec3 vWorldPos; // interpolated world position of vertex
        varying vec3 vVertexNormal; // interpolated normal for frag shader

        void main(void) {
            
           // vertex position
            vec4 vWorldPos4 = umMatrix * vec4(aVertexPosition, 1.0);
            vWorldPos = vec3(vWorldPos4.x,vWorldPos4.y,vWorldPos4.z);
            gl_Position = upvmMatrix * vec4(aVertexPosition, 1.0);

            // vertex normal (assume no non-uniform scale)
            vec4 vWorldNormal4 = umMatrix * vec4(aVertexNormal, 0.0);
            vVertexNormal = normalize(vec3(vWorldNormal4.x,vWorldNormal4.y,vWorldNormal4.z)); 
        }
    `;

    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float; // set float to medium precision

        // eye location
        uniform vec3 uEyePosition; // the eye's position in world
        
        // light properties
        uniform vec3 uLightAmbient; // the light's ambient color
        uniform vec3 uLightDiffuse; // the light's diffuse color
        uniform vec3 uLightSpecular; // the light's specular color
        uniform vec3 uLightPosition; // the light's position
        
        // material properties
        uniform vec3 uAmbient; // the ambient reflectivity
        uniform vec3 uDiffuse; // the diffuse reflectivity
        uniform vec3 uSpecular; // the specular reflectivity
        uniform float uShininess; // the specular exponent
        
        // geometry properties
        varying vec3 vWorldPos; // world xyz of fragment
        varying vec3 vVertexNormal; // normal of fragment
            
        void main(void) {
        
            // ambient term
            vec3 ambient = uAmbient*uLightAmbient; 
            
            // diffuse term
            vec3 normal = normalize(vVertexNormal); 
            vec3 light = normalize(uLightPosition - vWorldPos);
            float lambert = max(0.0,dot(normal,light));
            vec3 diffuse = uDiffuse*uLightDiffuse*lambert; // diffuse term
            
            // specular term
            vec3 eye = normalize(uEyePosition - vWorldPos);
            vec3 halfVec = normalize(light+eye);
            float highlight = pow(max(0.0,dot(normal,halfVec)),uShininess);
            vec3 specular = uSpecular*uLightSpecular*highlight; // specular term
            
            // combine to output color
            vec3 colorOut = ambient + diffuse + specular; // no specular yet
            gl_FragColor = vec4(colorOut, 1.0); 
        }
    `;

    try {
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader, fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader, vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
            gl.deleteShader(vShader);
        } else { // no compile errors
            var shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)

                // locate and enable vertex attributes
                vPosAttribLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition"); // ptr to vertex pos attrib
                gl.enableVertexAttribArray(vPosAttribLoc); // connect attrib to array
                vNormAttribLoc = gl.getAttribLocation(shaderProgram, "aVertexNormal"); // ptr to vertex normal attrib
                gl.enableVertexAttribArray(vNormAttribLoc); // connect attrib to array

                // locate vertex uniforms
                mMatrixULoc = gl.getUniformLocation(shaderProgram, "umMatrix"); // ptr to mmat
                pvmMatrixULoc = gl.getUniformLocation(shaderProgram, "upvmMatrix"); // ptr to pvmmat

                // locate fragment uniforms
                var eyePositionULoc = gl.getUniformLocation(shaderProgram, "uEyePosition"); // ptr to eye position
                var lightAmbientULoc = gl.getUniformLocation(shaderProgram, "uLightAmbient"); // ptr to light ambient
                var lightDiffuseULoc = gl.getUniformLocation(shaderProgram, "uLightDiffuse"); // ptr to light diffuse
                var lightSpecularULoc = gl.getUniformLocation(shaderProgram, "uLightSpecular"); // ptr to light specular
                var lightPositionULoc = gl.getUniformLocation(shaderProgram, "uLightPosition"); // ptr to light position
                ambientULoc = gl.getUniformLocation(shaderProgram, "uAmbient"); // ptr to ambient
                diffuseULoc = gl.getUniformLocation(shaderProgram, "uDiffuse"); // ptr to diffuse
                specularULoc = gl.getUniformLocation(shaderProgram, "uSpecular"); // ptr to specular
                shininessULoc = gl.getUniformLocation(shaderProgram, "uShininess"); // ptr to shininess

                // pass global constants into fragment uniforms
                gl.uniform3fv(eyePositionULoc, Eye); // pass in the eye's position
                gl.uniform3fv(lightAmbientULoc, lightAmbient); // pass in the light's ambient emission
                gl.uniform3fv(lightDiffuseULoc, lightDiffuse); // pass in the light's diffuse emission
                gl.uniform3fv(lightSpecularULoc, lightSpecular); // pass in the light's specular emission
                gl.uniform3fv(lightPositionULoc, lightPosition); // pass in the light's position

            } // end if no shader program link errors
        } // end if no compile errors
    } // end try

    catch (e) {
        console.log(e);
    } // end catch
} // end setup shaders


function resetgame() {
    miss_remain = 12;
    batteries = 3;
    count = 0;
    cur = 0;
    getran = 0
    leftcount = 0;
    middlecount = 6;
	rightcount = 12;
    var sphere;
    for (var whichSet = 0; whichSet < inputSpheres.length; whichSet++) {
        sphere = inputSpheres[whichSet];
            inputSpheres[whichSet].mMatrix = mat4.create();
        if(whichSet>=18)
        	inputSpheres[whichSet].alive = true;

    }
    inputTriangles[0].alive = true;
    inputTriangles[1].alive = true;
    inputTriangles[2].alive = true;
    mspeed += 0.001;
    level++;
    addscore(context);
}

var mspeed = 0.001;
var antispeed = 0.015;
var count = 0;
var cur = 0;
var getran = 0;
var xxx = 0;
var yyy = 0;
var dis = 0;
// render the loaded model
function renderModels() {
    if 	(batteries == 0) {
    	addscore(context, 1);
    	return;
    }
    if (miss_remain == 0) resetgame();

    var pMatrix = mat4.create(); // projection matrix
    var vMatrix = mat4.create(); // view matrix
    var mMatrix = mat4.create(); // model matrix
    var pvMatrix = mat4.create(); // hand * proj * view matrices
    var pvmMatrix = mat4.create(); // hand * proj * view * model matrices

    window.requestAnimationFrame(renderModels); // set up frame render callback

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers

    mat4.perspective(pMatrix, 0.5 * Math.PI, 1, 0.1, 10); // create projection matrix
    mat4.lookAt(vMatrix, defaultEye, defaultCenter, defaultUp); // create view matrix
    mat4.multiply(vMatrix, [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], vMatrix);
    mat4.multiply(pvMatrix, pvMatrix, pMatrix); // projection
    mat4.multiply(pvMatrix, pvMatrix, vMatrix); // projection * view

    // render each triangle set
    var currSet; // the tri set and its material properties
    for (var whichTriSet = 0; whichTriSet < numTriangleSets; whichTriSet++) {
        currSet = inputTriangles[whichTriSet];
        if (!currSet.alive) {
            continue;
        }
        mat4.multiply(pvmMatrix, pvMatrix, mMatrix); // project * view * model
        gl.uniformMatrix4fv(mMatrixULoc, false, mMatrix); // pass in the m matrix
        gl.uniformMatrix4fv(pvmMatrixULoc, false, pvmMatrix); // pass in the hpvm matrix

        // reflectivity: feed to the fragment shader
        gl.uniform3fv(ambientULoc, currSet.material.ambient); // pass in the ambient reflectivity
        gl.uniform3fv(diffuseULoc, currSet.material.diffuse); // pass in the diffuse reflectivity
        gl.uniform3fv(specularULoc, currSet.material.specular); // pass in the specular reflectivity
        gl.uniform1f(shininessULoc, currSet.material.n); // pass in the specular exponent


        // vertex buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[whichTriSet]); // activate
        gl.vertexAttribPointer(vPosAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[whichTriSet]); // activate
        gl.vertexAttribPointer(vNormAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed

        // triangle buffer: activate and render
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[whichTriSet]); // activate
        gl.drawElements(gl.TRIANGLES, 3 * triSetSizes[whichTriSet], gl.UNSIGNED_SHORT, 0); // render

    } // end for each triangle set

    // render each ellipsoid
    var sphere;
    count++;
    if(count == 150){
        getran = Math.floor(Math.random()*10);
        if(getran >= 5){
            cur = cur + Math.floor(getran/4);
        }
        count = 0;
    }

    for(var whichSphere = 0; whichSphere < Math.min(inputSpheres.length, 18 + cur);whichSphere++){
    	sphere = inputSpheres[whichSphere];
        if(!inputSpheres[whichSphere].alive){
            continue;
        }
        var angle;
        var distance;
        var center1 = vec4.fromValues(sphere.x, sphere.y, sphere.z, 1.0);
        pvmMatrix = mat4.multiply(pvmMatrix, pvMatrix, mMatrix); // premultiply with pv matrix
        gl.uniformMatrix4fv(mMatrixULoc, false, mMatrix); // pass in model matrix
          
        if(whichSphere < 18){
        	mat4.multiply(center1, sphere.mMatrix, center1);
        	for(var whichmissile = 18; whichmissile < inputSpheres.length; whichmissile++){
        		if (!inputSpheres[whichmissile].alive) 
        			continue;
        		var spheremissile = inputSpheres[whichmissile];
        		var spheremissilecenter = vec4.fromValues(spheremissile.x,spheremissile.y, spheremissile.z, 1.0);
        		mat4.multiply(spheremissilecenter, spheremissile.mMatrix, spheremissilecenter);
        		 xxx = center1[0] - spheremissilecenter[0];
        		 yyy = center1[1] - spheremissilecenter[1];
        		//getdist(center1[0] - spheremissilecenter[0], center1[1] - spheremissilecenter[1])
        		 dis = Math.sqrt(xxx * xxx + yyy * yyy);
        		if( dis <= 0.08){
        			 console.log("444");
        			 miss_remain--;
        			sphere.alive = false;
        			spheremissile.alive = false;
        			score = score + 10;
        			crash.play();
        			addscore(context);
        			
        			break;
        		}
        	}
        	if (!sphere.alive) continue;
        	//console.log("distance" + getdist(center1[0] - sphere.destination[0], center1[1] - sphere.destination[1]) );
        	xxx = center1[0] - sphere.destination[0];
        	yyy = center1[1] - sphere.destination[1];
        	dis = Math.sqrt(xxx * xxx + yyy * yyy);
        	//getdist(center1[0] - sphere.destination[0], center1[1] - sphere.destination[1])
            if (dis <= 0.005) {
            	 console.log("555");
                sphere.alive = false;
                continue;
            }
            mat4.translate(sphere.mMatrix, sphere.mMatrix, [antispeed * Math.cos(sphere.angle), antispeed * Math.sin(sphere.angle), 0]);
           	pvmMatrix = mat4.multiply(pvmMatrix, pvMatrix, sphere.mMatrix);
            gl.uniformMatrix4fv(mMatrixULoc, false, sphere.mMatrix); // pass in model matrix
        }
        if(whichSphere >=18){
            console.log("222");
            //var cursphere = inputSpheres[whichSphere];
            mat4.multiply(center1, sphere.mMatrix, center1);

            if(sphere.target == 10){
                var randomtarget = Math.floor(Math.random()*10);
                if(randomtarget == 9){
                    randomtarget = randomtarget - Math.floor(Math.random()*10);
                }
                sphere.target = randomtarget;
            }
            var curtarget = sphere.target;
            //console.log("randomtarget:" + randomtarget);

            var currentcenter  = vec4.fromValues(sphere.x, sphere.y, sphere.z, 1.0);
            mat4.multiply(currentcenter, sphere.mMatrix, currentcenter);


            angle = Math.atan2(sphere.y - inputTriangles[curtarget].center[1], sphere.x - inputTriangles[curtarget].center[0]);
            xxx = currentcenter[1] - inputTriangles[curtarget].center[1];
            yyy = currentcenter[0] - inputTriangles[curtarget].center[0];
            dis = Math.sqrt(xxx * xxx, yyy * yyy);
            distance = dis;

            if(distance <= sphere.r){
            	console.log("333");
                if(inputTriangles[curtarget].alive && curtarget < 3) {
                	batteries--;
                }
                crash.play();
                sphere.alive = false;
                inputTriangles[curtarget].alive = false;
                miss_remain--;
            }
            mat4.translate(sphere.mMatrix, sphere.mMatrix, [-mspeed * Math.cos(angle), -mspeed * Math.sin(angle), 0]);
            pvmMatrix = mat4.multiply(pvmMatrix, pvMatrix, sphere.mMatrix);
            gl.uniformMatrix4fv(mMatrixULoc, false, sphere.mMatrix); // pass in model matrix
        }
        gl.uniformMatrix4fv(pvmMatrixULoc, false, pvmMatrix); // pass in the hpvm matrix

        // reflectivity: feed to the fragment shader
        gl.uniform3fv(ambientULoc, sphere.ambient); // pass in the ambient reflectivity

        gl.uniform3fv(diffuseULoc, sphere.diffuse); // pass in the diffuse reflectivity
        gl.uniform3fv(specularULoc, sphere.specular); // pass in the specular reflectivity
        gl.uniform1f(shininessULoc, sphere.n); // pass in the specular exponent

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[numTriangleSets + whichSphere]); // activate vertex buffer
        gl.vertexAttribPointer(vPosAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed vertex buffer to shader
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[numTriangleSets + whichSphere]); // activate normal buffer
        gl.vertexAttribPointer(vNormAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed normal buffer to shader

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[numTriangleSets + whichSphere]); // activate tri buffer
        // draw a transformed instance of the ellipsoid
        gl.drawElements(gl.TRIANGLES, triSetSizes[numTriangleSets + whichSphere], gl.UNSIGNED_SHORT, 0); // render
       
    }
} // end render model


/* MAIN -- HERE is where execution begins after window load */

function main() {

    setupWebGL(); // set up the webGL environment
    loadModels(); // load in the models from tri file
    setupShaders(); // setup the webGL shaders
    renderModels(); // draw the triangles using webGL

} // end main
