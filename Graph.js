/**
 * A simple graph class.
 *
 * @author  Ikaros Kappler
 * @date    2017-05-30
 * @version 1.0.0
 **/

var Graph = (function() {

    // The constructor.
    //
    // The first param is a list of points of which type whatever you want/need.
    // The graph class will not modify this list ever.
    //
    // The second param contains the settings (such as undirected).
    var constructor = function( pointList, options ) {

	options = options || {};
	
	// A two-dimensional object { a : { b : true|false, ... }, ... }
	var relation =  {};

	var setConnected = function(a,b,connected) {
	    if( connected ) {
		if( !(a in relation) )
		    relation[a] = {};	
		relation[a][b] = connected; // This also allows weighted graphs.		
	    } else {
		if( a in relation && b in relation[a] ) {
		    delete( relation[a][b] );
		    // Keep our relation object clean.
		    if( Object.keys(relation[a]).length == 0 )
			delete( relation[a] );
		}
	    }
	};

	var getConnected = function(a,b,undirected) {
	    if( !(a in relation) || !(b in relation[a]) || !relation[a][b] ) {
		if( undirected )
		    return getConnected(b,a,false);
		else
		    return false;
	    } else {
		return relation[a][b];
	    }
	};
	
	var _export = this;
	_export.points    = function() { return pointList; };
	_export.connect   = function(a,b,weight) { setConnected(a,b,weight||true); };
	_export.unconnect = function(a,b) { setConnected(a,b,false); };
	_export.connected = function(a,b) { return getConnected(a,b,options.undirected); };
    };

    return constructor;

} )();


// Self test
if( true ) {
    var graph = new Graph( [] );
    console.log( '1-2 is connected? ' + graph.connected(1,2) );
    graph.connect(1,2,10);
    console.log( '1-2 should be connected now: ' + graph.connected(1,2) );
    graph.unconnect(1,2);
    console.log( '1-2 should be unconnected again: ' + graph.connected(1,2) );
};
