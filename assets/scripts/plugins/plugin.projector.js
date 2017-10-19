/* .........................................................................................................

	Plugin.Name
	
	@ 	Description
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'projector';

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
			'el': this.$el,
			'nav_id': this.$el.data('nav-id') || false,
			'neigbhor': this.$el.data('neighbor') || false,
			'index': this.$el.data('index') || false,
			'transition': this.$el.data('transition') || 'fade',
			'auto': this.$el.data('auto') || false,
			'continuous': this.$el.data('continuous') || false,
			'container': this.$el.find('.projector-box'),
			'slides': {
				'all' : this.$el.find('.projector-slide'),
				'active' : null,
				'next' : null,
				'previous' : null,
				'current_width' : null,
				'slide_increment': null,
				'active_increment': false,
				'active_finished': false,
				'current_increment' : 0,
				'num': this.$el.find('.projector-slide').length,
			},
			'width': this.$el.width(),
			'height':  this.$el.height(),
			'swipeLabel': this.$el.data('swipe-label') || false
		}   
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {
			var self = this;
			
			/* if more than one slide, prepare
			................................... */
			if (this.instance.slides.num > 1) {

				if (this.instance.nav_id) {
					
					this.create.nav(self);					
					this.create.slides(self);
					this.bindings();
					this.prepareSlides();
					
				}

			}
			else if (this.instance.slides.num === 1) {
				self.instance.slides.all.eq(0).addClass('active');
			}
		},

		/*	method -

			description
		..............................................................*/
		create: {
			
			nav: function(self) {			

				self.instance.nav = {
					container: $('#'+self.instance.nav_id)
				};
				
				if (self.instance['neighbor']) {
					var nav = '<div class="projector-neighbor"><a href="next" class="nav-next">Next</a><a href="previous" class="nav-previous">Previous</a></div>'
					
					self.instance.nav.container.append(nav);
					self.instance.nav['next'] = self.instance.nav.container.find('.nav-next');
					self.instance.nav['previous'] = self.instance.nav.container.find('.nav-previous');
				}

				if (self.instance['index']) {
					var nav_index = '<ul class="projector-index group"></ul>';

					self.instance.nav['container'].append(nav_index);
					
					self.instance.nav['index'] = self.instance.nav['container'].find('.projector-index');
					self.create.index(self);
				}
			},
			
			index: function(self) {
				var index = '';
					
				for (i=0;i<self.instance.slides.all.length;i++) {

					if (i===0) { var active = ' class="active"'; } else { var active = ''; }
					index += '<li class="projector-slide-num link-top"><a href="#" data-slide-id="'+i+'"'+active+'>'+(i+1)+'</a></li>';
					self.instance.slides.all.eq(i).attr('data-slide-id',i).attr('id','slide-'+i);
				}

				self.instance.nav.index.append(index);
			},
			
			slides: function(self) {
				for (i=0;i<self.instance.slides.all.length;i++) {
					self.instance.slides.all.eq(i).attr('data-slide-id',i).attr('id','slide-'+i);
				}				
			}			
		},
		
		/*	method -

			description
		..............................................................*/
		events: {
			
			next: function(grand_self) {
				var nav = grand_self.instance.nav;
				
				if (!grand_self.$el.hasClass('disabled-link')) {
					if (grand_self.isLast(grand_self.instance.slides.active)) {
						var id = 0;
					}
					else {
						var id = grand_self.instance.slides.active.next().data('slide-id');
					}				
					grand_self.$el.addClass('disabled-link');
					grand_self.transitionSlide(id,'next');
				}

			},
			
			previous: function() {			
			},
					
			jump: function(el, grand_self) {
				var nav = grand_self.instance.nav;

				if (!grand_self.$el.hasClass('disabled-link')) {
					var id = el.data('slide-id');					
					grand_self.$el.addClass('disabled-link');
					grand_self.transitionSlide(id,'jump');				
				}				
			}				
		},
		
		transitionSlide: function(id,direction) {
			var grand_self = this;
			
			activate = grand_self.instance.slides.all.filter('#slide-'+id);
			
			grand_self.instance.nav['index'].find('a').removeClass('active');				
			grand_self.instance.nav['index'].find('a[data-slide-id="'+id+'"]').addClass('active');
						
			activate.find('img').css('zIndex', 3).fadeIn(1000, function () {
				grand_self.$el.removeClass('disabled-link');
				grand_self.order.assign(grand_self, activate);
			});			
		},
		
		bindings: function() {

			var grand_self = this;
			
			if (grand_self.instance['neighbor']) {			
				this.instance.nav['next'].on('click',function(event) {
					event.preventDefault();
					grand_self.events.next(grand_self);				
				})
			
				this.instance.nav['previous'].on('click',function(event) {
					event.preventDefault();
					grand_self.events.previous();				
				})
			}

			if (grand_self.instance['index']) {			
				this.instance.nav['index'].find('a').on('click',function(event) {
					event.preventDefault();
					if ($(this).data('slide-id') !== grand_self.instance.slides.active.data('slide-id')) {
						grand_self.events.jump($(this),grand_self);													
					}
				})
			}

			$('.tooltip-pad').on('click',function(event) {
				event.preventDefault();
				
				if ($('.product-slideshow .tooltip').length > 0) {
					$('.product-slideshow .tooltip').remove();
				}
				
				grand_self.events.next(grand_self);
			})
			
		},
		
		order: {
			assign: function(grand_self,activate) {
				grand_self.instance.slides.all.filter('.active').removeClass('active').find('img').css({zIndex: '1', display:'none'});
				activate.addClass('active').find('img').css('zIndex','1');
				grand_self.instance.slides.active = activate;
							
			}
		},
		
		/*	prepare slides

			set slide and navigation states for slide initiation
		..............................................................*/
		prepareSlides: function() {
			var self = this;
			switch (self.instance.transition) {
				case 'fade':
					self.instance.slides.all.eq(0).addClass('active');
					self.instance.slides.active = self.instance.slides.all.filter('.active');
					break;
				
			}
		},		
			
		/*	is last -

			check if the current active slide is the last slide
		..............................................................*/
	 	isLast: function(slide) {
			if (slide === null) {
				return false;
			}
			else {
				return (parseInt(slide.data('slide-id')) === this.instance.slides.num - 1) ? true : false;	
			}
		},


		/*	is first -

			check if the current active slide is the first slide
		..............................................................*/
		isFirst: function(slide) {
			if (slide === null) {
				return false;
			}
			else {
				return (parseInt(slide.data('slide-id')) === 0) ? true : false;				
			}
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
