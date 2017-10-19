/* .........................................................................................................

	Global

	@ 	The Global Object
	@	by the Arishill Co. (arishill.com)
	@	author Scott Robertson
	@	Updated April 2013

......................................................................................................... */
jQuery.fn.exists = function(func){this.length && func.apply(this);return this;}
function log(msg){if (typeof console == "undefined" || typeof console.log == "undefined") return; console.log(msg)}

var SPN = SPN || {};

SPN.urls = {
	images: '/',
	products: '/',
};

;$('html').addClass('loading');


(function (window,document,$,SPN) {


	/* create utilities object
	.............................................................................................. */
	SPN.utils = SPN.utils || {};

	/* create modules object
	.............................................................................................. */
	SPN.modules = SPN.modules || {};

	/* create views object
	.............................................................................................. */
	SPN.views = SPN.views || {};

	/* create catalog object
	.............................................................................................. */
	SPN.catalog = SPN.catalog || {};

	/* create overlays object
	.............................................................................................. */
	SPN.overlays = SPN.overlays || {};

	SPN.Plugins = SPN.Plugins || {};
	SPN.Plugin = SPN.Plugin || {};
	SPN.Utils = SPN.Utils || {};

	/* create properties object
	.............................................................................................. */
	SPN.prop = {
		win: {},
		lastScroll : '',
		map: {}
	};

	/* create bag object
	.............................................................................................. */
	SPN.bag = {
		count: 0,
		items: [],
		total: 0,
		subtotal: 0,
		tax: 0,
		shipping: 0
	};

	/* create constants
	.............................................................................................. */
	SPN.CONSTANTS = {
	};


})(window,document,jQuery,SPN);
