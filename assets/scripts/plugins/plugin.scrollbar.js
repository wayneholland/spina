/* .........................................................................................................

	Plugin.Scrollbar
	
	@ 	Adds custom scrollbar functionality
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'scrollbar';

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
			'dragging': false
		}
		
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {
			this.prepareElements();
			this.makeHandleDraggable();
		},

		/*	method -

			description
		..............................................................*/
		prepareElements: function() {
			var scrollbar_handle = '<div class="scrollbar-handle"></div>',
				scrollbar_classes = this.$el.attr('class');
				scrollbar_container = '<div class="scrollbar-container">';
				
				scrollbar_classes = scrollbar_classes.split("scrollbar");
				
			if (scrollbar_classes[1]) {
				this.$el.removeClass(scrollbar_classes[1]);
				scrollbar_container = '<div class="scrollbar-container '+scrollbar_classes[1]+'">';								
			}
			else if (scrollbar_classes[0]) {
				this.$el.removeClass(scrollbar_classes[0]);
				scrollbar_container = '<div class="scrollbar-container '+scrollbar_classes[0]+'">';				
			}


			this.$el.wrapInner(scrollbar_container);
			this.$el.prepend(scrollbar_handle);		
					
			this.instance.progress_pos = 0;			
	 		this.instance.parent_height = this.$el.outerHeight(true);			
	 		this.instance.handle = this.$el.find('.scrollbar-handle');
	 		this.instance.container = this.$el.find('.scrollbar-container');
	 		this.instance.area_height = this.$el.find('.scrollbar-container').outerHeight(true);
			this.instance.scroll_height = this.instance.parent_height / (this.instance.area_height/this.instance.parent_height);						
	 		this.instance.limit = this.instance.parent_height - this.instance.scroll_height;
				
			this.instance.handle.height(this.instance.scroll_height);
		},
		
		
		/*	method -

			description
		..............................................................*/
		makeHandleDraggable: function() {
			var self = this,
			 	last_pageY;

			self.instance.handle.on('mousedown', function(event) {
				last_pageY = event.pageY;
				event.preventDefault();							
				self.instance.dragging = true;
				self.instance.handle.addClass('dragging');
				self.instance.progress_pos = self.instance.handle.position().top;
			});
			
			$(document).on('mouseup', function() {
				self.instance.dragging = false;
				self.instance.handle.removeClass('dragging');							
				self.instance.progress_pos = self.instance.handle.position().top;
			});
			
			$(document).on('mousemove',function(event) {
				event.preventDefault();	
				if (self.instance.dragging) {																														
					if (event.pageY > last_pageY && self.instance.progress_pos !== self.instance.limit) {
						var move = event.pageY - last_pageY;
						self.instance.progress_pos = self.instance.progress_pos + move;						
						
						if (self.instance.progress_pos >= self.instance.limit) {
							move = self.instance.limit;
							self.instance.progress_pos = move;
						}
						else {
							move = '+='+move+'px';										
						}
														
						self.instance.handle.css({ top: move });
						self.scrollContent(self.instance.progress_pos);
						last_pageY = event.pageY;
					}
					else if (event.pageY < last_pageY && self.instance.progress_pos !== 0) {
							var move =  last_pageY - event.pageY;
							self.instance.progress_pos = self.instance.progress_pos - move;
							
							if (self.instance.progress_pos <= 0) {
								move = 0;
								self.instance.progress_pos = move;																			
							}
							else {
								move = '-='+move+'px';
							}

							self.instance.handle.css({ top: move });
							self.scrollContent(self.instance.progress_pos);							
							last_pageY = event.pageY;						
					}							
				}
			});
		},
		
		scrollContent: function(height) {
			this.instance.container.css({top: -(height*(this.instance.area_height/this.instance.parent_height)-1)});
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
