/* .........................................................................................................

	Plugin.Sticky
	
	@ 	Sticky footer
	@	by ScottusRobus.com
	@	Updated May 2012
	@	Learn more with other wizards at Wigolia.com
		
......................................................................................................... */

;(function( $ ){

  $.fn.sticky = function() {  

    return this.each(function() {

		/* .........................................................................................................
			set options
		......................................................................................................... */
		var sticky = {
			footer : $(this).outerHeight(),
			header: $('header').outerHeight(),
			container : $('.sticky-offset')
		};

		
		/* .........................................................................................................
			bind events
		......................................................................................................... */
		var calc = $(window).height() - (sticky.footer + 15 + sticky.header);
		sticky.container.css('minHeight',calc);
		
		$(window).resize(function() {
		var calc = $(window).height() - (sticky.footer + 15 + sticky.header);
			sticky.container.css('minHeight',calc);
		})

    });

  };
})( jQuery );