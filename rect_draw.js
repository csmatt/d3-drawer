function rect_draw() {
    var self = this;
    self.type = 'rect';
    self.class = 'rect_draw';
    base_draw.call(self);

    rect_draw.prototype.getShapeProps = function(clickPoint) {
	var width = clickPoint[0] - startPoint[0], height = clickPoint[1] - startPoint[1];
	return {x: startPoint[0], y: startPoint[1], width: (width>0 ? width : 0) , height: (height>0 ? height : 0)};                 
    };

    rect_draw.prototype.redraw = function() {
	base_draw.prototype.redraw.call(self)
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; });
    };
}

rect_draw.prototype = Object.create(base_draw.prototype);//new base_draw();
rect_draw.prototype.constructor = rect_draw;

var rectBtn = addButton('Rectangle', function() { setShape('rect'); });
shapes.rect = new rect_draw();