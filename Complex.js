/**
 * A complex math class in rectangular coordinates.
 *
 * @author   Ikaros Kappler
 * @date     2017-05-03
 * @modified 2017-05-30 Added the set-function an modified re() and im() for getting AND setting.
 * @version  1.0.1
 **/

var Complex = (function() {

    var constructor = function( re, im ) {
	
	this.re = function(r) { if( typeof r != 'undefined' ) re = r; return re; };
	this.im = function(i) { if( typeof i != 'undefined' ) im = i; return im; };

	this.clone = function() {
	    return new Complex(re,im);
	};
	this.set   = function(r,i) { re = r; im = i; return this; }
	this.conjugate = function(c) {
	    im = -im;
	    return this;
	};
	this.add = function(c) {
	    re += c.re();
	    im += c.im();
	    return this;
	};
	this.sub = function(c) {
	    re -= c.re();
	    im -= c.im();
	    return this;
	};
	this.mul = function(c) {
	    re = re*c.re() - im*c.im();
	    im = im*c.re() + re*c.im();
	    return this;
	};
	this.div = function(c) {
	    re = (re*c.re() - im*c.im()) / (c.re()*c.re() + c.im()*c.im());
	    im = (im*c.re() + re*c.im()) / (c.re()*c.re() + c.im()*c.im());
	    return this;
	};
	this.sqrt = function() {
	    // Huh?
	};
	this.toString = function() {
	    return '' + re + ' + i*' + im;
	};
    };

    return constructor;
})();


// TEST
if( false ) {
    var z = new Complex(3,4);
    console.log( 'test: ' + z.re() );
}
