/* .........................................................................................................

	Plugin.Fill
	
	@ 	fill image to screen (assumes fill image is landscape ratio)
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'fillScreen';

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
			'img': this.$el.find('img'),
			'width': this.$el.find('img').width(),
			'height': this.$el.find('img').height(),
			'ratio': this.$el.data('ratio')		
		};
		console.log(this);
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {

			var that = this,
			 	win = this.getWindowProperties();
			
			that.checkScreen(win);
			
			$(window).resize(function(){
				var win = that.getWindowProperties();
				that.checkScreen(win);
			})
		},

		/*	get window properities -

			get the current window size (height and width) and 
			calculate the ratio
		..............................................................*/
		getWindowProperties: function() {
			var data = {
				'width': $(window).width(),
				'height': $(window).height() - $('header').height(),
 				'ratio': $(window).width() / ($(window).height() + $('header').height())
			}
			
			return data;
		},
		
		/*	check screen -

			determine what the current screen ratio is and what
			params will be necessary to fill the screen - then
			pass to the adjustImage method.
		..............................................................*/
		checkScreen: function(win) {

			var that = this,
				margin = -(Math.abs(win.width - (win.height * this.instance.ratio)) / 2);
				
			if (win.width > win.height) {
				if (win.ratio > that.instance.ratio) {
					that.adjustImage(0,'100%','auto');
				}

				else if (win.ratio < that.instance.ratio) {
					that.adjustImage(margin,(win.height * this.instance.ratio),win.height)	;
				}
			}

			else if (win.width < win.height) {
				that.adjustImage(margin,'auto',win.height);
			}
		},
		
		/*	adjust image size -

			set the image's css to fill window with params pass
			via checkScreen
		..............................................................*/		
		adjustImage: function(margin,width,height) {
			this.instance.img.css({marginLeft: margin, width: width, height: height })			
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