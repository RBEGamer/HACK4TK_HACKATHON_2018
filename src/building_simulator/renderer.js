'use strict';
var fs = require('fs');



function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



var grid = 20;
 var grid_w = 10;
 var grid_h = 14+17;
var uuoid = 0;
var canvas = new fabric.Canvas('c', { selection: false,width: grid_w*grid, height: grid_h*grid  });

// create grid



for (let w = 0; w < grid_w; w++) {
   for (let h = 0; h < grid_h; h++) {
  
// create a rectangle object

var col = '#ccc';

if(w == 0 && h == 0){
    col = '#000';
}
var rect = new fabric.Rect({
    left: w*grid,
    top: h*grid,
    width: grid,
    height: grid,
    fill: col,
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
function add_elevator_obj(_x,_y,_type){




    var obj =new fabric.Rect({ 
        left: _x*grid, 
        top: _y*grid, 
        width: grid, 
        height: grid, 
        fill: '#faa', 
        originX: 'left', 
        originY: 'top',
        centeredRotation: true,
        uuid:guid(),
        inc_uuid:uuoid,
        evevator_track_part:true,
        track_type:_type,
        pos_x:_x,
        pos_y:_y
      });
      uuoid++;
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
      
}

canvas.on('mouse:down', function (e) {

    if(!document.getElementById("del_box").checked){return;}
    // clicked item will be
  
      var id = canvas.getObjects().indexOf(e.target);
      var obj = canvas.getObjects()[id];
    

      if(obj.evevator_track_part != undefined && obj.evevator_track_part != null && obj.evevator_track_part){
        canvas.remove(obj);
        document.getElementById("del_box").checked = false;
      }
      
     // canvas.renderAll();
      
    });



// snap to grid

canvas.on('object:moving', function(options) { 

    

  options.target.set({
    left: Math.round(options.target.left / grid) * grid,
    top: Math.round(options.target.top / grid) * grid,

    pos_x:options.target.left / grid,
    pos_y:options.target.top / grid
  });
  
});



add_elevator_obj(1,1,0);



  document.getElementById("add_vert_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    add_elevator_obj(0,0,0);
  }, false);



  document.getElementById("export_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    export_json();
  }, false);



  function export_json(){
var arr = [];
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];

        if(element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part){
           // debugger;
            arr.push({track_type:element.track_type,pos_x:element.pos_x,pos_y:element.pos_y,uuid:element.uuid, inc_uuid:element.inc_uuid});
          }


        
    }    
    fs.writeFile ("grid_data.json", JSON.stringify({grid:grid, grid_w:grid_w,grid_h:grid_h,tracks:arr}), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
  }