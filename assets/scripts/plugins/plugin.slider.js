/* .........................................................................................................

	Plugin.Name
	
	@ 	Simple slider plugin
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'slider';

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
			'progress_bar': null,
			'progress_pos': null,			
			'progress_handle': null,			
			'progress': null,
			'dragging': false,
			'base': 100,			
			'input_el': this.$el.find('input[type="text"]')
		}   
		
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {			

			this.createSlider();
			
		},

		/*	method -

			description
		..............................................................*/
		createSlider: function() {
			var self = this,
				local = {
		
					init: function() {
						this.prepareSlider(self.bindEventsToSlider);
					},

					prepareSlider: function(callback) {
						var slider = {
							ui_classes: self.$el.attr('class'),
							html: '',
							val: '',
							starting_width: 0
						}

						slider.ui_classes = slider.ui_classes ? ' '+slider.ui_classes : '';						
						slider.html = '<div class="'+slider.ui_classes+'"><div class="slider-bar"><span class="slider-progress"></span><span class="slider-handle"></span></div></div>';
												
						this.insertSlider(slider,callback);
					},
					
					insertSlider: function(slider,callback) {
						self.$el.after(slider.html).next('.slider-bar');
						
						self.instance.limit = self.$el.next('.slider').find('.slider-bar').width();
						slider.val = parseInt(self.instance.input_el.val());
						slider.starting_width = (slider.val / self.instance.base) * self.instance.limit;		
						
						self.instance.progress_bar = self.$el.next('.slider').find('.slider-progress');
						self.instance.progress_bar.css('width',slider.starting_width);

						self.instance.progress_handle = self.$el.next('.slider').find('.slider-handle');
						self.instance.progress_handle.css('left',slider.starting_width);						


						self.instance.progress_pos = slider.starting_width;
						callback.call(self);
					}
				}
			
			local.init();

		},
		
		bindEventsToSlider: function() {
			var self = this,
				local = {
					init: function() {
						this.makeHandleDraggable();
					},
					
					makeHandleDraggable: function() {
						var last_pageX;

						self.instance.progress_handle.on('mousedown', function(event) {
							last_pageX = event.pageX;
							event.preventDefault();							
							self.instance.dragging = true;
							self.instance.progress_handle.addClass('dragging');
						});
						
						$(document).on('mouseup', function() {
							self.instance.dragging = false;
							self.instance.progress_handle.removeClass('dragging');							
						});
						
						$(document).on('mousemove',function(event) {
							event.preventDefault();	
							if (self.instance.dragging) {																														
								if (event.pageX > last_pageX && self.instance.progress_pos !== self.instance.limit) {
									var move = event.pageX - last_pageX;
									self.instance.progress_pos = self.instance.progress_pos + move;

									if (self.instance.progress_pos >= self.instance.limit) {
										move = self.instance.limit;
										self.instance.progress_pos = move;
									}
									else {
										move = '+='+move+'px';										
									}
									self.instance.progress_handle.css({ left: move });
									local.adjustProgress(self.instance.progress_pos);
									last_pageX = event.pageX;
								}
								else if (event.pageX < last_pageX && self.instance.progress_pos !== 0) {
									var move =  last_pageX - event.pageX;
									self.instance.progress_pos = self.instance.progress_pos - move;
									
									if (self.instance.progress_pos <= 0) {
										move = 0;
										self.instance.progress_pos = move;																			
									}
									else {
										move = '-='+move+'px';
									}

									self.instance.progress_handle.css({ left: move });
									local.adjustProgress(self.instance.progress_pos);									
									last_pageX = event.pageX;									
								}							
							}
						});
					},
					
					adjustProgress: function(width) {
						self.instance.progress_bar.css('width',width);
						self.setFormInputFromSlider(width);
					}
				}
				
			local.init();				
		},
		
		setFormInputFromSlider: function(width) {
			var self = this;
			self.instance.input_el.val((width/self.instance.limit)*self.instance.base); 
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


/* 

1. Create a form element of radio buttons
2. 



*/
