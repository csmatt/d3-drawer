var undoBtn = addButton('Undo', function() { shape.collection.pop(); shape.redraw(); });
var dragBtn = addButton('Drag', function() { setShape('drag'); });
var selectBtn = addButton('Select', function() {selecting = !selecting; if (!selecting){selection = [];}});
var clearBtn = addButton('Clear', function(){ 
    for (var key in shapes) {
        if (shapes.hasOwnProperty(key)) {
            shapes[key].collection = [];
            shapes[key].redraw();
        }
    }
});

function setShape(shapeType) {
    vis.on('.mousemove', null);
    vis.on('.click', null);
    shape = shapes[shapeType];
    vis.on('mousemove', shape.mousemoveHandler);
    vis.on('click', shape.clickHandler);    
}
setShape('line');    
