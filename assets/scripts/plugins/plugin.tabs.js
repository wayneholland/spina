/* .........................................................................................................

	Plugin.Tabs
	
	@ 	Add tab functionality
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'tabs';

    function Plugin( element ) {
		this.el = element;
		this.$el = $(element);
		this._name = pluginName;		

		this.instance = {
			'nav': this.$el.find('.tabs-nav'),
			'anchors': this.$el.find('.tabs-anchor'),
			'container': this.$el.find('.tabs-container'),
			'views': this.$el.find('.tabs-view'),
			'length': this.$el.find('.tabs-view').length
		}   

    }

    Plugin.prototype = {
		
		init: function () {
			if (this.instance.length > 1) {
				for (var i=0;i<this.instance.length;i++) {
					this.instance.views.eq(i).attr('id','tab-'+i);
					this.instance.anchors.eq(i).attr('data-target',i);
				}

				this.bindAnchors();
				this.onHashChange();	
			}
			else {
				this.instance.views.eq(0).addClass('active');
				this.instance.anchors.eq(0).addClass('active');				
			}
		},
		
		bindAnchors: function () {
			
			var instance = this.instance,
				that = this;

			instance.anchors.click(function(event) {
				event.preventDefault();
				
				if (!$(this).hasClass('disable')) {
					location.hash = $(this).attr('href');
				}

				
			})

		},
		
		onHashChange: function() {
			var instance = this.instance;
			
			$(window).hashchange(function(){

				if (!location.hash) {
					location.hash = instance.anchors.eq(0).attr('href');
				}
				var target = null;
				instance.anchors.each(function() {
					if ($(this).attr('href') === location.hash) {
						target = $(this).data('target');
					}
				})

				if (instance.container.find('#tab-'+target).hasClass('disable')) {
					location.hash = instance.anchors.eq(0).attr('href');
					target = '0';
				}

				instance.views.removeClass('active');
				instance.anchors.removeClass('active');			
				
				if (instance.container.find('.img').length > 0) {
					instance.container.find('.img').css('display','none');
				}

				instance.container.find('#tab-'+target).addClass('active');
				instance.nav.find('.tabs-anchor[data-target='+target+']').addClass('active');
				
				if (instance.container.find('.img').length > 0) {
					instance.container.find('.img').fadeIn(600);
				}				
				
			})
			
			$(window).hashchange();
		}
		
	}
	
    $.fn[pluginName] = function () {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this ).init());
            }
        });
    }

})( jQuery, window, document );