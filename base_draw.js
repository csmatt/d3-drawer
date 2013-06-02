function base_draw() {
    var self = this;
    self.collection = [];
    self.selector = self.type + '.' + self.class;

    base_draw.prototype.redraw = function() {
	vis.selectAll(self.selector).remove();
        return vis.selectAll(self.selector)
            .data(self.collection).enter()
            .append(self.type)
	    .on('click', this.selectHandler)
            .attrs({stroke: 'white', 'stroke-width': 2, 'class': self.class});
    };
    base_draw.prototype.selectHandler = function(event) {
	if(selecting) {
	    var selected = this,
	    indexOfSelected = selection.indexOf(selected), 
	    isSelected = indexOfSelected >= 0;

	    d3.select(selected).classed('selected', !isSelected);
	    if (isSelected) {
		selection.splice(indexOfSelected, 1);
	    } else {
		selection.push(selected);
	    }

	    d3.event.stopPropagation();
	}
    };
    base_draw.prototype.clickHandler = function(d) {
	var clickPoint = d3.mouse(this);
	if (startPoint) {
            self.collection.push(self.getShapeProps(clickPoint));
            startPoint = undefined;
            self.redraw();
	} else {
            startPoint = clickPoint;   
	}
    };
    base_draw.prototype.mousemoveHandler = function(d) {
	var clickPoint = d3.mouse(this), shapeProps;
	if (startPoint) {
            shapeProps = self.getShapeProps(clickPoint);
            vis.select(self.selector + '.crnt').remove();
            vis.selectAll(self.selector + '.crnt')
		.data([startPoint, clickPoint]).enter()
		.append(self.type).attrs({'class':self.class+' crnt', stroke: 'white', 'stroke-width': 2}).attrs(shapeProps);
	}
    };
}