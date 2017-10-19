/* .........................................................................................................

	Plugin.Cart
	
	@ 	Description
	@	author Scott Robertson
	@	Updated January 2013
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'cart';

	/* contructor function
	................................................*/
    function Plugin( element ) {

		/* plugin base variables
		.............................................*/
		this.el = element;
		this.$el = $(element);
		this._name = pluginName;

		/* plugin instance options/variables
		.............................................*/
		this.instance = {
			'add': this.$el.find('.add'),
			'empty': this.$el.find('.empty'),
			'remove': this.$el.find('.remove'),
			'cart': {
				'count' : 0,
				'items' : [],
				'inventory' : [],
				'total' : 0,
				'subtotal' : 0,
				'est_tax' : 0,
				'est_shipping' : 0,
				'shipping_zip' : null
			}
		}   
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {
			this.populateCart();
			this.bindEvents();
		},

		/*	add to cart -

			description
		..............................................................*/
		populateCart: function() {

		}

		/*	add to cart -

			description
		..............................................................*/
		bindEvents: function() {

		}

		/*	add to cart -

			description
		..............................................................*/
		add: function() {

		},

		/*	add to cart -

			description
		..............................................................*/
		remove: function() {

		},

		/*	add to cart -

			description
		..............................................................*/
		clear: function() {

		}

		/*	add to cart -

			description
		..............................................................*/
		calc: function() {

		}		


		
	}
	
	/*	return a new object for each instance
	.............................................*/
    $.fn[pluginName] = function () {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this ).init());
            }
        });
    }

})( jQuery, window, document );
