'use strict';

var grid = 20;
 var grid_w = 10;
 var grid_h = 14+17;

var canvas = new fabric.Canvas('c', { selection: false,width: grid_w*grid, height: grid_h*grid  });

// create grid



for (let w = 0; w < grid_w; w++) {
   for (let h = 0; h < grid_h; h++) {
  
// create a rectangle object
var rect = new fabric.Rect({
    left: w*grid,
    top: h*grid,
    width: grid,
    height: grid,
    fill: '#ccc',
    stroke: 'white',
    strokeWidth: 1,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    grid_ground: true,
    lockMovementX: true,
    lockMovementY: true
  });
  rect.setControlsVisibility({
    mt: false, 
    mb: false, 
    ml: false, 
    mr: false, 
    bl: false,
    br: false, 
    tl: false, 
    tr: false,
    mtr: false, 
});
  // "add" rectangle onto canvas
  canvas.add(rect);


   }
    
}
for (var i = 0; i <grid_w*grid_h; i++) {
  
}

// add objects

var obj =new fabric.Rect({ 
  left: grid, 
  top: grid, 
  width: grid, 
  height: grid, 
  fill: '#faa', 
  originX: 'left', 
  originY: 'top',
  centeredRotation: true,

});
obj.setControlsVisibility({
    mt: false, 
    mb: false, 
    ml: false, 
    mr: false, 
    bl: false,
    br: false, 
    tl: false, 
    tr: false,
    mtr: false, 
});
canvas.add(obj);


canvas.on({'object:selected': selectedObject
});

function selectedObject(e) {
    var id = canvas.getObjects().indexOf(e.target);
    console.log(id);
  
}

// snap to grid

canvas.on('object:moving', function(options) { 

    

  options.target.set({
    left: Math.round(options.target.left / grid) * grid,
    top: Math.round(options.target.top / grid) * grid
  });
});