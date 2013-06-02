function line_draw() {
    var self = this;
    self.collection = [];
    self.type = 'line';
    self.clickHandler = function(d) {
        var clickPoint = d3.mouse(this);
        if (startPoint) {
            self.collection.push([startPoint, getSnapPoint(clickPoint)]);
            startPoint = undefined;
            self.redraw();
        } else {
            startPoint = clickPoint;
            if (beginSnap && self.collection.length > 0) {
		startPoint = getSnapPoint(clickPoint);
            }
        }
        snapTo = undefined;
    };
    self.mousemoveHandler = function(d) {
        if(startPoint){
            var mousePosition = getSnapPoint(d3.mouse(this));
	    
            vis.select(self.type + '.crnt').remove();
            vis.selectAll(self.type + '.crnt')
		.data([startPoint, mousePosition]).enter()
		.append(self.type)
		.attrs({'class': 'crnt', stroke: "white", "stroke-width": 2})
		.attr("x1", function(d){return startPoint[0];})
		.attr("y1", function(d){return startPoint[1];})
		.attr("x2", function(d){return d[0];})
		.attr("y2", function(d){return d[1];});
        }
    };
    self.redraw = function() {
        vis.selectAll(self.type).remove();
        vis.selectAll(self.type)
            .data(self.collection).enter()
            .append(self.type)
            .attrs({stroke: "white", "stroke-width": 2})
            .attr("x1", function(d){return d[0][0];})
            .attr("y1", function(d){return d[0][1];})
            .attr("x2", function(d){return d[1][0];})
            .attr("y2", function(d){return d[1][1];});        
    };
    function getSnapPoint(mousePosition) {
	if (!d3.event.ctrlKey) {
            // don't snap to point if the ctrl key isn't being pressed
            return mousePosition;
	}
	var retVal, line, i;
	for( i = 0; i < self.collection.length; i++ ) {
            line = self.collection[i];
            if (Math.abs(mousePosition[0] - line[0][0]) <= 10 && Math.abs(mousePosition[1] - line[0][1]) <= 10) {
		retVal = line[0];
            } else if (Math.abs(mousePosition[0] - line[1][0]) <= 10 && Math.abs(mousePosition[1] - line[1][1]) <= 10) {
		retVal = line[1];
            }
	}
	return retVal || mousePosition;
    }
}
var lineBtn = addButton('Line', function() { setShape('line'); });
shapes.line = new line_draw();