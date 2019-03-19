
let video;
let yolo;
let status;
let objects = [];

let sclassprob;
let sfilterboxes;
let sclassprobvalue;
let sfilterboxesvalue;
let rojo,verde,azul;

let canvas;
let spinnerModel;

//Opciones de captura de objetos
let filterBoxesThreshold = 0.01; 
let IOUThreshold = 0.4; 
let classProbThreshold = 0.4;
let options = { 
  filterBoxesThreshold: filterBoxesThreshold, 
  IOUThreshold: IOUThreshold, 
  classProbThreshold: classProbThreshold 
}

function setup() {
 
  canvas = createCanvas(600, 400);
  canvas.parent('videocanvas');
  video = createCapture(VIDEO);
  video.size(200, 100);

  spinnerModel = select('#spinnermodel');

  sclassprob = select('#sclassprob');
  classProbThreshold = sclassprob.value();
  sclassprobvalue = select('#sclassprobvalue');
 
  sfilterboxes = select('#sfilterboxes');
  filterBoxesThreshold = sfilterboxes.value();
  sfilterboxesvalue = select('#sfilterboxesvalue');

  status = select('#status');

  // Create a YOLO method
  yolo = ml5.YOLO(video, options, () => {
    status.html('Modelo cargado');
    spinnerModel.hide();
    detect();
  });

  video.hide();
 
}

function draw() {
  imageVideo = image(video, 0, 0, width, height);
  
  let newClassProb = sclassprob.value();
  let newFilterBoxes = sfilterboxes.value();
  if(!isNaN(newClassProb) && !isNaN(newFilterBoxes)){
    if( (classProbThreshold != newClassProb) || (filterBoxesThreshold != newFilterBoxes) ){
      classProbThreshold = newClassProb;
      filterBoxesThreshold = newFilterBoxes;
      resetModel(filterBoxesThreshold,IOUThreshold,classProbThreshold);
    }
    
    sclassprobvalue.html(newClassProb);
    sfilterboxesvalue.html(newFilterBoxes);
  
    
    for (let i = 0; i < objects.length; i++) {
      noStroke();
      let claseObjeto = objects[i].className;
      let probObjeto = (parseFloat(objects[i].classProb)*100).toFixed(2);
      
      if(probObjeto<=33){
        rojo = 255;
        verde = 0;
        azul = 0;
      }
      else if(probObjeto>33 && probObjeto<=66){
        rojo = 0;
        verde = 255;
        azul = 0;
      }
      else {
        rojo = 0;
        verde = 0;
        azul = 255;
      }
  
      fill(rojo, verde, azul);
  
      text(claseObjeto, objects[i].x * width, objects[i].y * height - 20);
      text('Prob: ' + probObjeto + ' %', objects[i].x * width, objects[i].y * height - 5);
      noFill();
      strokeWeight(4);
      stroke(rojo, verde, azul);
      rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    }
  }
  
}

function detect() {
  yolo.detect((err, results) => {
    objects = results;
    detect();
  });
}

function resetModel(filterBoxesThreshold=0.01,IOUThreshold=0.5,classProbThreshold=0.4){
  status.html('Cargando modelo...');
  spinnerModel.show();
  options = { 
    filterBoxesThreshold: filterBoxesThreshold, 
    IOUThreshold: IOUThreshold, 
    classProbThreshold: classProbThreshold 
  }
  
  yolo = ml5.YOLO(video, options, () => {
    status.html('Modelo cargado');
    spinnerModel.hide();
  });
  
}