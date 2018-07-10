'use strict';
var fs = require('fs');

var mqtt = require('mqtt');


function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



var grid = 30;
 var grid_w = 10;
 var grid_h = 17;
var uuoid = 0;


var sim_running = false;
var canvas = new fabric.Canvas('c', { selection: false,width: grid_w*grid, height: grid_h*grid  });

// create grid
function import_json(){
   
    console.log("\n *STARTING IMPORT* \n");
   // Get content from file
    var contents = fs.readFileSync("./grid_data.json");
   // Define to JSON type
    var jsonContent = JSON.parse(contents);
grid = jsonContent.grid;
grid_h = jsonContent.grid_h;
grid_w = jsonContent.grid_w;

canvas = new fabric.Canvas('c', { selection: false,width: grid_w*grid, height: grid_h*grid  });

    create_grid();

    for (let index = 0; index < jsonContent.tracks.length; index++) {
        const element = jsonContent.tracks[index];
        add_elevator_obj(element.pos_x,element.pos_y,element.track_type,element.uuid);
    }

}


function create_grid(){
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
}
create_grid();

// add objects
function add_elevator_obj(_x,_y,_type, _uuid = null){



var col = "#FFF";

if(_type == 0){
    col = '#F95243';
}else if(_type == 1){
    col = '#F3F04A';
}else if(_type == 2){
    col = '#347C76';
}else if(_type == 3){
    col = '#6ECD61'
}else if(_type == 4){
    col = '#FD7A38';
}else if(_type == 5){
    col = '#FD7A38';
}else if(_type == 6){
    col = '#715794';
}else if(_type == 7){
    col = '#715794';
}

    var obj =new fabric.Rect({ 
        left: _x*grid, 
        top: _y*grid, 
        width: grid, 
        height: grid, 
        fill: col, 
        originX: 'left', 
        originY: 'top',
        centeredRotation: true,
        uuid:_uuid || guid(),
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

    pos_x:Math.round(options.target.left / grid),
    pos_y:Math.round(options.target.top / grid)
  });
  
});



function load_sample_loop(){

    add_elevator_obj(1,0,0);

    add_elevator_obj(0,0,0);
    add_elevator_obj(0,1,0);
    add_elevator_obj(0,2,0);
    add_elevator_obj(0,3,0);
    add_elevator_obj(0,4,0);
    add_elevator_obj(0,5,0);
    add_elevator_obj(0,6,0);
    add_elevator_obj(0,7,0);
    add_elevator_obj(0,8,0);
    add_elevator_obj(0,9,0);
    add_elevator_obj(0,10,0);
    add_elevator_obj(0,11,0);
    add_elevator_obj(0,12,0);
    add_elevator_obj(0,13,0);
    add_elevator_obj(0,14,0);
    add_elevator_obj(0,15,0);
    add_elevator_obj(0,16,0);

    add_elevator_obj(1,16,0);

    add_elevator_obj(2,0,0);
    add_elevator_obj(2,1,0);
    add_elevator_obj(2,2,0);
    add_elevator_obj(2,3,0);
    add_elevator_obj(2,4,0);
    add_elevator_obj(2,5,0);
    add_elevator_obj(2,6,0);
    add_elevator_obj(2,7,0);
    add_elevator_obj(2,8,0);
    add_elevator_obj(2,9,0);
    add_elevator_obj(2,10,0);
    add_elevator_obj(2,11,0);
    add_elevator_obj(2,12,0);
    add_elevator_obj(2,13,0);
    add_elevator_obj(2,14,0);
    add_elevator_obj(2,15,0);
    add_elevator_obj(2,16,0);

}
load_sample_loop();


  document.getElementById("add_vert_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    add_elevator_obj(0,0,0);
  }, false);



  document.getElementById("export_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    export_json();
  }, false);

  document.getElementById("import_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    import_json();
  }, false);




  document.getElementById("add_hori_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    add_elevator_obj(0,0,1);
  }, false);

  document.getElementById("add_cabin_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    add_elevator_obj(0,0,6);
  }, false);


  
  document.getElementById("add_changer_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    add_elevator_obj(0,0,3);
  }, false);


  document.getElementById("add_stop_track_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    if(sim_running){return;}
    add_elevator_obj(0,0,4);
  }, false);


  document.getElementById("rum_sim_btn").addEventListener("click", function( event ) {
    // display the current click count inside the clicked div

    if(sim_running){ stop_sim_btn();return;}
    run_simulation();
  }, false);
  



  function export_json(){
var arr = [];
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if(element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part){
            arr.push({track_type:element.track_type,pos_x:element.pos_x,pos_x_floor:element.pos_x+1,pos_y:element.pos_y,pos_y_floor:grid_h-element.pos_y,uuid:element.uuid, inc_uuid:element.inc_uuid});
          }  
    }    
    fs.writeFile ("./grid_data.json", JSON.stringify({grid:grid, grid_w:grid_w,grid_h:grid_h,tracks:arr}), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
  }








function stop_sim_btn(){
  

}


  function run_simulation(){
    var graph = create_yamlgraph();
    //
  }

  function create_yamlgraph(){

var str = "";

// \
str += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
str +="<graphml xmlns=\"http://graphml.graphdrawing.org/xmlns\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd\">";


str += "<key id=\"position_x\" for=\"node\" attr.name=\"position_in_graph_x\" attr.type=\"int\"/>";
str += "<key id=\"position_y\" for=\"node\" attr.name=\"position_in_graph_y\" attr.type=\"int\"/>";
str += "<key id=\"height\" for=\"edge\" attr.name=\"weight\" attr.type=\"int\"/>";

str +=   "<graph id=\"G\" edgedefault=\"directed\">";


var floorx = 0;
var floory  =0;


for (let index = 0; index < canvas.getObjects().length; index++) {
    const element = canvas.getObjects()[index];
    if(element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part){
       // arr.push({track_type:element.track_type,pos_x:element.pos_x,pos_x_floor:element.pos_x+1,pos_y:element.pos_y,pos_y_floor:grid_h-element.pos_y,uuid:element.uuid, inc_uuid:element.inc_uuid});
      floorx = element.pos_x+1;
      floory = grid_h-element.pos_y;
       str+="<node id=\"floor"+floorx+"_"+floory+"\"><data key=\"position_x\">"+floorx+"</data><data key=\"position_y\">"+floory+"</data></node>";    
    }  
}    



//EDGE BUILDING

var ed_from_x = 0;
var ed_from_y = 0;
var ed_to_x = 0;
var ed_to_y = 0;
var heigth = 4;
str +="<edge id=\"floor"+ed_from_x+"_"+ed_from_y+"_floor"+ed_to_x+"_"+ed_to_y+"\" source=\"floor"+ed_from_x+"_"+ed_from_y+"\" target=\"floor"+ed_to_x+"_"+ed_to_y+"\"><data key=\"height\">"+heigth+"</data></edge>";





fs.writeFile ("./grid_graph.graphml", str, function(err) {
    if (err) throw err;
    console.log('complete');
    }
);



  }