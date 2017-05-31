/**
 * The main script for the generative mesh test.
 *
 * @requies  Complex, Graph
 *
 * @author   Ikaros Kappler
 * @date     2017-05-30
 * @version  1.0.0
 **/

$( document ).ready( function() {

    var $canvas       = $( 'canvas#my_canvas' );
    var ctx           = $canvas[0].getContext('2d');
    var $debug        = $( 'div#debug' );

    var canvas_width  = 640;
    var canvas_height = 640;

    var offset        = { x : canvas_width/2, y : canvas_height/2 };
    var scale         = { x : 1.0, y : 1.0 };

    var irand         = function(n) {
	return Math.floor( Math.random()*n );
    };

    var randomPoint   = function(max_x, max_y) {
	return new Complex( irand(max_x), irand(max_y) );
    };

    var circlePoint   = function( r, alpha ) {
	return new Complex( Math.cos(alpha)*r, Math.sin(alpha)*r );
    };
    
    // Make n random points
    var n = 5+irand(5);
    var graph         = new Graph( [], { directed : false } );
    for( var i = 0; i < n; i++ ) {
	//graph.points().push( randomPoint() );
	var p = circlePoint( canvas_width/3, Math.PI*2*(i/n) );
	var jitter = randomPoint( (canvas_width-canvas_width/2)/3, (canvas_height-canvas_height/2)/3  );
	p.add( jitter );
	graph.points().push( p );
	if( i > 0 ) graph.connect(i-1,i);
	if( i+1 >= n ) graph.connect(i,0);
    }

    var locateGraphPointAt = function(pos, tolerance) {
	for( index in graph.points() ) {
	    var p = graph.points()[index];
	    console.log( 'pos='+pos+', p='+p+', distance=' + distance(p,pos) );
	    if( distance(p,pos) <= tolerance ) {
		console.log( 'Point found! ('+index+')' );
		return index;
	    }
	}
	return -1;
    };

    var distance = function( a, b ) {
	return Math.sqrt( Math.pow(a.re()-b.re(),2) + Math.pow(a.im()-b.im(),2) )
    };
    
    function draw(ctx) {
	// Cleaning canvas?
	ctx.fillStyle='white';
	ctx.fillRect(0,0,canvas_width,canvas_height);
	// Draw origin
	ctx.translate(0.5,0.5); // Fix for the half-pixel issue
	ctx.beginPath();
	ctx.moveTo( 0, offset.y );
	ctx.lineTo( canvas_width, offset.y );
	ctx.moveTo( offset.x, 0 );
	ctx.lineTo( offset.x, canvas_height );
	ctx.strokeStyle = '#a8ffd8';
	ctx.lineWidth   = 0.5;
	ctx.stroke();
	// Draw shape
	draw_shape( ctx );
	ctx.translate(-0.5,-0.5); // Fix for the half-pixel issue
    }

    function draw_shape( ctx ) {

	ctx.beginPath();
	for( var a = 0; a < n; a++ ) {
	    for( var b = 0; b < n; b++ ) {
		if( graph.connected(a,b) ) {
		    ctx.moveTo( offset.x+graph.points()[a].re()*scale.x,
				offset.y+graph.points()[a].im()*scale.y );
		    ctx.lineTo( offset.x+graph.points()[b].re()*scale.x,
				offset.y+graph.points()[b].im()*scale.y );
		}
	    }
	}
	ctx.strokeStyle = 'black';
	ctx.stroke();
	
    }

    draw(ctx);

    $( 'input#iterations' ).change( draw );
    $( 'input#cell_size' ).change( draw );
    $( 'input#line_width' ).change( draw );

    var canvasPosition2Complex = function(event) {
	var rect = $canvas[0].getBoundingClientRect();
        var x = event.clientX - rect.left,
	    y = event.clientY - rect.top;

	//return { x : x, y : y };
	return new Complex( (x-offset.x)/scale.x, (y-offset.y)/scale.y );
    };

    var mouseDown                = false;
    var mouseDownPosition        = null;
    var draggedPointIndex        = -1;
    var draggedPoint             = null;
    var mouseDownPointDifference = null;
    $canvas.mousedown( function(event) {
	mouseDown = true;
	mouseDownPosition = canvasPosition2Complex(event);
	draggedPointIndex = locateGraphPointAt( mouseDownPosition, 10 );
	if( draggedPointIndex != -1 ) {
	    draggedPoint             = graph.points()[draggedPointIndex];
	    mouseDownPointDifference = draggedPoint.clone().sub( mouseDownPosition );
	    console.log( 'begin drag of point ' + draggedPointIndex + ' difference=' + mouseDownPointDifference );
	} else {
	    draggedPoint             = null;
	    mouseDownPointDifference = null;
	}
	
	//draw_shape( ctx );
    } );
    $canvas.mouseup( function(event) {
	mouseDown         = false;
	mouseDownPosition = null;
	if( draggedPointIndex != -1 )
	    console.log( 'end drag of point ' + draggedPointIndex );
	draggedPointIndex = -1;
	draggedPoint      = null;
    } );
    $canvas.mousemove( function(event) {
	if( !mouseDown ) 
	    return;
	var z = canvasPosition2Complex(event);
	$debug.empty().html( JSON.stringify(z) );

	var diff = mouseDownPosition.clone().sub( z );
	if( draggedPoint ) {
	    console.log( 'move difference: ' + diff );
	    draggedPoint.sub( diff );
	}
	mouseDownPosition = z;
	
	draw_shape( ctx );
    } );
   
} );


var getFloatInput = function(id) {
    return parseFloat( document.getElementById(id).value );
}

var getIntegerInput = function(id) {
    return parseInt( document.getElementById(id).value );
}

