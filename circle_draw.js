function circle_draw() {
    var self = this;
    self.type = 'circle';
    self.class = 'circle_draw';
    base_draw.call(self);

    circle_draw.prototype.redraw = function() {
	base_draw.prototype.redraw.call(self)
            .attr('cx', function(d) {return d.cx;})
            .attr('cy', function(d) {return d.cy;})
            .attr('r', function(d) {return d.r;});
    };
    circle_draw.prototype.getShapeProps = function(clickPoint) {
        // set the radius to the largest of the absolute values of the distances between the start & end points
        var radius = d3.max([Math.abs(clickPoint[0] - startPoint[0]), 
                             Math.abs(clickPoint[1] - startPoint[1])]);
        return {cx: startPoint[0], cy: startPoint[1], r: radius};        
    };
}

circle_draw.prototype = Object.create(base_draw.prototype);//new base_draw();
circle_draw.prototype.constructor = circle_draw;

var circleBtn = addButton('Circle', function() { setShape('circle'); });
shapes.circle = new circle_draw();