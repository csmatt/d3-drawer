d3.selection.prototype.attrs = function(attrs) {
    for( var attr in attrs ) {
        if ( attrs.hasOwnProperty(attr) ) {
            this.attr(attr, attrs[attr]);
        }
    }
    return this;
};
$(function() {
    var vis = d3.select("#playground").append('svg').append('g'),
    w = 500, h=500, lines = [], 
    shapes = {
        line: new line_draw(),
        circle: new circle_draw(),
        rect: new rect_draw()
    },
    startPoint, snapTo, beginSnap = true, shape;
    setShape('line');    
    var x = d3.scale.linear().range([0, w]),y = d3.scale.linear().range([h, 0]);
    var line = d3.svg.line().x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); });

    vis.append('rect').attrs({width: w, height: h, name: 'main'}).style('fill', 'black'); // main box

    function button(pos, text, clickHandler) {
	var btn = vis.append('g').attr("transform", "translate("+pos[0]+","+pos[1]+")");
	btn.append('rect').attrs({width: 50, height: 20, fill: 'grey'}); // container/background
	btn.append('text').attrs({dy: ".35em", y: 10}).text(text);
	btn.on('click', function() { startPoint = undefined; clickHandler(); d3.event.stopPropagation();});
	return btn;
    }
    var rectBtn = button([370, 10], 'Rectangle', function() { setShape('rect'); });
    var circleBtn = button([370, 30], 'Circle', function() { setShape('circle'); });
    var lineBtn = button([370, 50], 'Line', function() { setShape('line'); });
    var clearBtn = button([425,10], 'Clear', function(){ 
        for (var key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                shapes[key].collection = [];
                shapes[key].redraw();
            }
        }
    });
    var undoBtn = button([425, 30], 'Undo', function() { shape.collection.pop(); shape.redraw(); });
    var dragBtn = button([425, 50], 'Drag', function() { setShap('drag'); });

    function setShape(shapeType) {
	vis.on('.mousemove', null);
	vis.on('.click', null);
	shape = shapes[shapeType];
	vis.on('mousemove', shape.mousemoveHandler);
	vis.on('click', shape.clickHandler);    
    }
    /*function shape_draw() {
      var self = this;
      self.collection = [];
      }
      function draw_draw() {
      var self = this;
      self.type = 'drag';
      self.clickHandler = function(d) {
      
      }
      }*/
    function rect_draw() {
        var self = this;
        self.collection = [];
        self.type = 'rect';
        self.class = 'rect_draw';
        self.selector = self.type + '.' + self.class;
        self.clickHandler = function(d) {
            var clickPoint = d3.mouse(this);
            if (startPoint) {
                self.collection.push(getRectProps(clickPoint));
                startPoint = undefined;
                self.redraw();
            } else {
                startPoint = clickPoint;   
            }
        };
        self.mousemoveHandler = function(d) {
            var clickPoint = d3.mouse(this), rectProps;
            if (startPoint) {
                rectProps = getRectProps(clickPoint);
                vis.select(self.selector + '.crnt').remove();
                vis.selectAll(self.selector + '.crnt')
                    .data([startPoint, clickPoint]).enter()
                    .append(self.type).attrs({'class':self.class+' crnt', stroke: 'white', 'stroke-width': 2}).attrs(rectProps);                
            }
        };
	self.redraw = function() {
            vis.selectAll(self.selector).remove();   
            vis.selectAll(self.selector)
		.data(self.collection).enter()
		.append(self.type)
		.attrs({stroke: 'white', 'stroke-width': 2, 'class': self.class})
		.attr('x', function(d) { return d.x; })
		.attr('y', function(d) { return d.y; })
		.attr('width', function(d) { return d.width; })
		.attr('height', function(d) { return d.height; });
	};
        function getRectProps(clickPoint) {
            var width = clickPoint[0] - startPoint[0],
            height = clickPoint[1] - startPoint[1];
            return {x: startPoint[0], y: startPoint[1], width: (width>0 ? width : 0) , height: (height>0 ? height : 0)};                 
        }
    }
    function circle_draw() {
	var self = this;
	self.collection = [];
	self.type = 'circle';
	self.clickHandler = function(d) {
            var clickPoint = d3.mouse(this);
            if (startPoint) {
		self.collection.push(getCircleProps(clickPoint));
		startPoint = undefined;
		self.redraw();
            } else {
		startPoint = clickPoint;
            }
	};
	self.mousemoveHandler = function(d) {
            var clickPoint = d3.mouse(this), circleProps;
            if (startPoint) {
		circleProps = getCircleProps(clickPoint);
		vis.select(self.type + '.crnt').remove();
		vis.selectAll(self.type + '.crnt')
                    .data([startPoint, clickPoint]).enter()
		    .append(self.type).attrs({'class':'crnt', stroke: 'white', 'stroke-width': 2}).attrs(circleProps);
            }  
	};
	self.redraw = function() {
            vis.selectAll(self.type).remove();
            vis.selectAll(self.type)
		.data(self.collection).enter()
		.append(self.type)
		.attrs({stroke: 'white', 'stroke-width': 2})
		.attr('cx', function(d) {return d.cx;})
		.attr('cy', function(d) {return d.cy;})
		.attr('r', function(d) {return d.r;});
	};
	function getCircleProps(clickPoint) {
            // set the radius to the largest of the absolute values of the distances between the start & end points
            var radius = d3.max([Math.abs(clickPoint[0] - startPoint[0]), 
				 Math.abs(clickPoint[1] - startPoint[1])]);
            return {cx: startPoint[0], cy: startPoint[1], r: radius};        
	}
    }

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
});