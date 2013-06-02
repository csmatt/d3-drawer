d3.selection.prototype.attrs = function(attrs) {
    for( var attr in attrs ) {
        if ( attrs.hasOwnProperty(attr) ) {
            this.attr(attr, attrs[attr]);
        }
    }
    return this;
};


var vis = d3.select("#playground").append('svg').append('g'),
w = 500, h=500, shapes = {},startPoint, snapTo, beginSnap = true, shape, selecting = false, selection = [];
var x = d3.scale.linear().range([0, w]),y = d3.scale.linear().range([h, 0]);
var line = d3.svg.line().x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); });
var lastBtnPos = [425,10];
vis.append('rect').attrs({width: w, height: h, name: 'main'}).style('fill', 'black'); // main box

function addButton(text, clickHandler) {
    lastBtnPos[1] += 20;
    var btn = vis.append('g').attr("transform", "translate("+lastBtnPos[0]+","+lastBtnPos[1]+")");
    btn.append('rect').attrs({width: 50, height: 20, fill: 'grey'}); // container/background
    btn.append('text').attrs({dy: ".35em", y: 10}).text(text);
    btn.on('click', function() { startPoint = undefined; clickHandler(); d3.event.stopPropagation();});
    return btn;
}

