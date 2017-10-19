/* .........................................................................................................

	Plugin.Swap
	
	@ 	swap / toggle from one view to another
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'swap';

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
			'swapInit': this.$el
		}   
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {

			this.bindEvents();

		},

		/*	method -

			description
		..............................................................*/
		bindEvents: function() {

			this.instance.swapInit.on('click', function(event) {

				event.preventDefault();
				
				var $target = $('#'+$(this).data('target'));

				$(this).closest('.swap').fadeOut(0, function() {

					$target.fadeIn(600, function() {
						$(this).addClass('active');
						$target.removeClass('active');
					});

				});

			})

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
