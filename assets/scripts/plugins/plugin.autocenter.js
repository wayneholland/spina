/* .........................................................................................................

	Plugin.Autocenter

	@ 	Automatically centeres elements on load and window resize
	@	author Scott Robertson
	@	Updated August 2012

......................................................................................................... */


;(function ( $, window, document, undefined ) {

    var pluginName = 'autoCenter';

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
				'parent': $('#'+this.$el.data('parent')) || null,
				'width': this.$el.width(),
				'height': this.$el.height(),
				'offset_x': this.$el.data('offset-x') || 0,
				'offset_y': this.$el.data('offset-y') || 0,
				'stack': this.$el.data('stack') || 1
			}
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {

		/*	initiate -

			auto center element using the based on window dimensions,
			and bind autoCenter method on window resize
		..............................................................*/
		init: function () {

			var that = this,
					win;
			if (this.instance.parent) {
				win = this.getParentDimensions();
				this.instance.parent.css('position','relative');
			}
			else {
				win = this.getWindowDimensions();
			}

			this.autoCenter(this.isHigh(win),win);

			$(window).resize(function() {
					var win;

					if (that.instance.parent) {
						win = that.getParentDimensions();
					}
					else {
						win = that.getWindowDimensions();
					}

					that.autoCenter(that.isHigh(win),win);
			})
			$(window).on('load',function() {
				$(this).trigger('resize');
			})
		},

		/*	get window dimensions -

			you'll need the current window dimensions to find the center
		..............................................................*/
		getWindowDimensions: function() {

			var obj = {
				height: $(window).height(),
				width: $(window).width()
			}
			return obj;

		},

		getParentDimensions: function() {
			var that = this;

			var obj = {
				height: that.instance.parent.height(),
				width: that.instance.parent.width()
			}
			return obj;

		},

		/*	check instance height -

			if the height of the element is greater than the height
			of the window, return true. this will be used to set the
			prevent the element from being cut off
		.............................................................*/
		isHigh: function (win) {

			return (this.instance.height > win.height) ? true : false;

		},

		/*	auto center the element -

			using the current window dimensions, we can position the
			element in the center of the window. if the element's
			height is greater than the window (if (size)) we do not
			center it vertically (to avoide it being) cut off, and
			simply position the element to the top of the window
			instead.
		............................................................*/
		autoCenter: function(size,win) {
			var that = this;
			var pos = {
				height: (win.height - this.instance.height) / 2,
				width: (win.width - this.instance.width) / 2
			}
			if (that.instance.parent) {
				pos.setting = 'absolute';
			}
			else {
				pos.setting = 'fixed';
			}


			this.$el.css({
				position: pos.setting,
				zIndex: this.instance.stack,
				top: pos.height + this.instance.offset_y + 'px',
				left: pos.width + this.instance.offset_x + 'px'
			});

			if (size) {
				// this.$el.css({top: 0, overflowY: 'auto', height: win.height});
				this.$el.css({top: 0, height: win.height});
			}
			else {
				this.$el.css({height: ''});
			};

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
