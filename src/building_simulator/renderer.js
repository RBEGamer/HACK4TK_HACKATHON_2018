'use strict';
var fs = require('fs');




var express = require('express');
var app = express();



var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://marcelochsendorf.com');






var grid = 50;
var grid_w = 10;
var grid_h = 17;
var uuoid = 0;
var cabine_storage = new Map();


var web_ui_person_id = guid();
var web_ui_person_state = "";

var web_ui_person_to = "";
var web_ui_person_from = "";


var sim_running = false;
var canvas = new fabric.Canvas('c', {
    selection: false,
    width: grid_w * grid,
    height: grid_h * grid
});



client.on('connect', function () {
    client.subscribe('elevator_pos_update');

})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    var obj = null;
    try {
        obj = JSON.parse(message.toString());
    } catch (error) {
        console.log("parse error");
        return;
    }


    if (topic == "elevator_pos_update") {
        if (obj.x == undefined || obj.x == null) { return; }
        if (obj.y == undefined || obj.y == null) { return; }
        if (obj.uuid == undefined || obj.uuid == null) { return; }
        if (obj.timestamp == undefined || obj.timestamp == null || (Math.floor(Date.now() / 1000) - obj.timestamp) > 10) { return; }
        place_cabine(obj.x, obj.y, obj.uuid);
    }

    if (topic == "elevator_person_update") {
        if (obj.x == undefined || obj.x == null) { return; }
        if (obj.y == undefined || obj.y == null) { return; }
        if (obj.uuid == undefined || obj.uuid == null) { return; }
        if (obj.timestamp == undefined || obj.timestamp == null || (Math.floor(Date.now() / 1000) - obj.timestamp) > 10) { return; }
        if (obj.state == undefined || obj.state == null) { return; }
       
       
       if(web_ui_person_id != "" && web_ui_person_id == obj.uuid){
        web_ui_person_state = obj.state;
           
       }
        place_person(obj.x, obj.y, obj.uuid, obj.state);
    }


});






function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}




app.get('/call', function (req, res) {
    //TODO GEN JSON PAYLOAD

    var from = Math.floor(Math.random() * 10) +3; 
    var to = Math.floor(Math.random() * 10) +3; 

    var tmp ={from:from,to:to,timestamp:Math.floor(Date.now() / 1000),uuid:web_ui_person_id};

    web_ui_person_to = to;
    web_ui_person_from = from;

    client.publish("elevator_person_call",JSON.stringify(tmp));
    console.log(JSON.stringify(tmp));
    res.json(tmp);
});


app.get('/caller_state', function (req, res) {
    res.json({uuid:web_ui_person_id,state:web_ui_person_state});
});


app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});








// create grid
function import_json() {

    console.log("\n *STARTING IMPORT* \n");
    // Get content from file
    var contents = fs.readFileSync("./grid_data.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    grid = jsonContent.grid;
    grid_h = jsonContent.grid_h;
    grid_w = jsonContent.grid_w;

    canvas = new fabric.Canvas('c', {
        selection: false,
        width: grid_w * grid,
        height: grid_h * grid
    });

    create_grid();

    for (let index = 0; index < jsonContent.tracks.length; index++) {
        const element = jsonContent.tracks[index];
        add_elevator_obj(element.pos_x, element.pos_y, element.track_type, element.uuid);
    }

}


function create_grid() {
    for (let w = 0; w < grid_w; w++) {
        for (let h = 0; h < grid_h; h++) {

            // create a rectangle object

            var col = '#ccc';

            var rect = new fabric.Rect({
                left: w * grid,
                top: h * grid,
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
function add_elevator_obj(_x, _y, _type, _uuid = null) {



    var col = "#FFF";

    if (_type == 0) {
        col = "./img/track_vertical.png";
    } else if (_type == 1) {
        col = "./img/track_horizontal.png";
    } else if (_type == 2) {
        col = "./img/exchanger.png";
    } else if (_type == 3) {
        col = "./img/exchanger.png";
    } else if (_type == 4) {
        col = "./img/exchanger.png";
    } else if (_type == 5) {
        col = "./img/exchanger.png";
    } else if (_type == 6) {
        col = "./img/lift_cart_static.png";
    } else if (_type == 7) {
        col = "./img/lift_cart.png";
    } else if (_type == 8) {
        col = "./img/door_close_person.png";
    } else if (_type == 9) {
        col = "./img/door_open.png";
    } else if (_type == 10) {
        col = "./img/door_close.png";
    }

    var rect = new fabric.Image.fromURL(col, function (myImg) {
        canvas.add(myImg.set({
            width: grid,
            hasControls: false,
            //cornerColor: 'green',cornerSize: 16,transparentCorners: false,
            selection: false,
            lockRotation: true,
            lockMovement: true, lockMovementY: true, lockMovementX: true,
            lockUniScaling: true, lockScalingY: true, lockScalingX: true,
            hoverCursor: 'default',
            hasRotatingPoint: false,
            hasBorders: true, borderColor: 'red', borderSize: 2,
            transparentBorder: false,
            height: grid,
            angle: 0,
            cornersize: 10,
            originX: 'left',
            originY: 'top',
            uuid: _uuid || guid(),
            inc_uuid: uuoid,
            evevator_track_part: true,
            track_type: _type,
            pos_x: _x,
            pos_y: _y,
            left: _x * grid,
            top: _y * grid,
            last_pos_update: Math.floor(Date.now() / 1000),
            state: null
        }));
    });


}

canvas.on('mouse:down', function (e) {

    if (!document.getElementById("del_box").checked) {
        return;
    }
    // clicked item will be

    var id = canvas.getObjects().indexOf(e.target);
    var obj = canvas.getObjects()[id];


    if (obj.evevator_track_part != undefined && obj.evevator_track_part != null && obj.evevator_track_part) {
        canvas.remove(obj);
        document.getElementById("del_box").checked = false;
    }

    // canvas.renderAll();

});



// snap to grid

canvas.on('object:moving', function (options) {

    options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top: Math.round(options.target.top / grid) * grid,

        pos_x: Math.round(options.target.left / grid),
        pos_y: Math.round(options.target.top / grid)
    });

});




setInterval(function () {
    //  cabine_timeout_remove();
}, 1000);




function place_person(_x, _y, _uuid, _state) {


    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            if (element.track_type != undefined && element.track_type != null && (element.track_type == 8 || element.track_type == 9 || element.track_type == 10)) {
                if (element.uuid != undefined && element.uuid != null && element.uuid == _uuid) {
                    canvas.remove(element);
                }
            }
        }
    }

    if (_state == "0") {
        add_elevator_obj(_x, _y, 8, _uuid); //add a simulation cabin
    } else if (_state == "1") {
        add_elevator_obj(_x, _y, 9, _uuid); //add a simulation cabin
    } else if (_state == "2") {
        add_elevator_obj(_x, _y, 10, _uuid); //add a simulation cabin

        setTimeout(function () { place_person(0, 0, _uuid, 3); }, 5000); //clear icon after 5sek
    }



}





function place_cabine(_x, _y, _uuid) {
    if (cabine_storage.get(_uuid) == undefined || cabine_storage.get(_uuid) == null) {
        add_elevator_obj(_x, _y, 7, _uuid); //add a simulation cabin
        cabine_storage.set(_uuid, {
            x: _x,
            y: _y,
            last_update: Math.floor(Date.now() / 1000)
        });
        return;
    }
    //UPDATE POSITION
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            if (element.track_type != undefined && element.track_type != null && element.track_type == 7) {
                if (element.uuid != undefined && element.uuid != null && element.uuid == _uuid) {
                    canvas.getObjects()[index].set({
                        left: _x * grid,
                        top: _y * grid,
                        pos_x: _x,
                        pos_y: _y,
                        last_pos_update: Math.floor(Date.now() / 1000)
                    });
                    canvas.renderAll();
                    break;
                }
            }
        }
    }
}


function cabine_timeout_remove() {
    var ts = Math.floor(Date.now() / 1000);
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            if (element.track_type != undefined && element.track_type != null && element.track_type == 7) {
                var ts_tmo = (ts - element.last_pos_update);
                if (element.last_pos_update != undefined && element.last_pos_update != null && ts_tmo > 20) {
                    canvas.remove(element);
                }
            }
        }
    }
}

function load_sample_loop() {

    add_elevator_obj(1, 0, 1);

    add_elevator_obj(0, 0, 3);
    add_elevator_obj(0, 1, 0);
    add_elevator_obj(0, 2, 0);
    add_elevator_obj(0, 3, 0);
    add_elevator_obj(0, 4, 0);
    add_elevator_obj(0, 5, 0);
    add_elevator_obj(0, 6, 0);
    add_elevator_obj(0, 7, 0);
    add_elevator_obj(0, 8, 0);
    add_elevator_obj(0, 9, 0);
    add_elevator_obj(0, 10, 0);
    add_elevator_obj(0, 11, 0);
    add_elevator_obj(0, 12, 0);
    add_elevator_obj(0, 13, 0);
    add_elevator_obj(0, 14, 0);
    add_elevator_obj(0, 15, 0);
    add_elevator_obj(0, 16, 3);

    add_elevator_obj(1, 16, 1);

    add_elevator_obj(2, 0, 3);
    add_elevator_obj(2, 1, 0);
    add_elevator_obj(2, 2, 0);
    add_elevator_obj(2, 3, 0);
    add_elevator_obj(2, 4, 0);
    add_elevator_obj(2, 5, 0);
    add_elevator_obj(2, 6, 0);
    add_elevator_obj(2, 7, 0);
    add_elevator_obj(2, 8, 0);
    add_elevator_obj(2, 9, 0);
    add_elevator_obj(2, 10, 0);
    add_elevator_obj(2, 11, 0);
    add_elevator_obj(2, 12, 0);
    add_elevator_obj(2, 13, 0);
    add_elevator_obj(2, 14, 0);
    add_elevator_obj(2, 15, 0);
    add_elevator_obj(2, 16, 3);

}
load_sample_loop();




document.getElementById("export_btn").addEventListener("click", function (event) {
    // display the current click count inside the clicked div
    if (sim_running) {
        return;
    }
    export_json();
}, false);

document.getElementById("import_btn").addEventListener("click", function (event) {
    // display the current click count inside the clicked div
    if (sim_running) {
        return;
    }
    import_json();
}, false);





document.getElementById("rum_sim_btn").addEventListener("click", function (event) {
    // display the current click count inside the clicked div

    if (sim_running) {
        stop_sim_btn();
        return;
    }
    run_simulation();
}, false);




function export_json() {
    var arr = [];
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            arr.push({
                track_type: element.track_type,
                pos_x: element.pos_x,
                pos_x_floor: element.pos_x + 1,
                pos_y: element.pos_y,
                pos_y_floor: grid_h - element.pos_y,
                uuid: element.uuid,
                inc_uuid: element.inc_uuid
            });
        }
    }
    fs.writeFile("./grid_data.json", JSON.stringify({
        grid: grid,
        grid_w: grid_w,
        grid_h: grid_h,
        tracks: arr
    }), function (err) {
        if (err) throw err;
        console.log('complete');
    });
}








function stop_sim_btn() {

    //TODO REMOVE ALL DOORS


    //remove all objects with track_type_7
    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            if (element.track_type != undefined && element.track_type != null && element.track_type == 7) {
                canvas.remove(element);
            }
        }
    }





}



function run_simulation() {
    //TODO CREATE GRAPH AN SEND IT TO PYTHON
    // var graph = create_yamlgraph();
    client.last_pos_update("elevator_start_simulation", "FullDayTraffic-b.csv");
    sim_running = true;
    //
}

function create_yamlgraph() {

    var str = "";

    // \
    str += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    str += "<graphml xmlns=\"http://graphml.graphdrawing.org/xmlns\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd\">";


    str += "<key id=\"position_x\" for=\"node\" attr.name=\"position_in_graph_x\" attr.type=\"int\"/>";
    str += "<key id=\"position_y\" for=\"node\" attr.name=\"position_in_graph_y\" attr.type=\"int\"/>";
    str += "<key id=\"height\" for=\"edge\" attr.name=\"weight\" attr.type=\"int\"/>";

    str += "<graph id=\"G\" edgedefault=\"directed\">";


    var floorx = 0;
    var floory = 0;


    for (let index = 0; index < canvas.getObjects().length; index++) {
        const element = canvas.getObjects()[index];
        if (element.evevator_track_part != undefined && element.evevator_track_part != null && element.evevator_track_part) {
            // arr.push({track_type:element.track_type,pos_x:element.pos_x,pos_x_floor:element.pos_x+1,pos_y:element.pos_y,pos_y_floor:grid_h-element.pos_y,uuid:element.uuid, inc_uuid:element.inc_uuid});
            floorx = element.pos_x + 1;
            floory = grid_h - element.pos_y;
            str += "<node id=\"floor" + floorx + "_" + floory + "\"><data key=\"position_x\">" + floorx + "</data><data key=\"position_y\">" + floory + "</data></node>";
        }
    }



    //EDGE BUILDING

    var ed_from_x = 0;
    var ed_from_y = 0;
    var ed_to_x = 0;
    var ed_to_y = 0;
    var heigth = 4;
    str += "<edge id=\"floor" + ed_from_x + "_" + ed_from_y + "_floor" + ed_to_x + "_" + ed_to_y + "\" source=\"floor" + ed_from_x + "_" + ed_from_y + "\" target=\"floor" + ed_to_x + "_" + ed_to_y + "\"><data key=\"height\">" + heigth + "</data></edge>";





    fs.writeFile("./grid_graph.graphml", str, function (err) {
        if (err) throw err;
        console.log('complete');
    });



}