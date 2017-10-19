/* .........................................................................................................

	Plugin.CustomForms
	
	@ 	Substitute form elements w/ custom forms
	@	author Scott Robertson
	@	Updated October 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'customForms';

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

		} 
		  
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			get it all started by calling the substitue custom
			elements method. we can always add more methods that
			may need to be called on initialization her (say if
			we need this to work cohesively with the prepForms
			plugin for validation purposes)
		..............................................................*/
		init: function () {
			
			this.substituteCustomElements();	
			FGC.uiForms = this;

		},

		/*	substitute custom elements -
		
			this method is initiated straight away. we must run
			through each assigned form on the page (to the plugin) 
			to see which input elements actually exist and call the 
			appropriate create and bind methods. we run only what
			is necessary.
		..............................................................*/
		substituteCustomElements: function() {
			var self = this,
				checkbox = 	this.$el.find('input[type="checkbox"]'),
				select = this.$el.find('select'),
				textline = this.$el.find('input[type="text"]'),
				textarea = this.$el.find('textarea'),					
				radio = this.$el.find('.radio');

				/* create/bind custom radio buttons if they exist
				................................................*/
				radio.exists(function() {

					self.radio.createElements(self,radio);
					self.radio.bindEvents(self);
					
				})
				
				/* create/bind custom select boxes if they exist
				................................................*/					
				select.exists(function() {

					self.select.createElements(self,select);
					self.select.bindEvents(self);
					
				})
				
				/* create/bind custom checkboxes if they exist
				................................................*/
				checkbox.exists(function() {

					self.checkbox.createElements(self,checkbox);
					self.checkbox.bindEvents(self,checkbox);
					
				})					
				
				/* create/bind custom textareas if they exist
				................................................*/
				textarea.exists(function() {

					self.textarea.createElements(self,textarea);
					self.textarea.bindEvents();	
					
				})
				
				/* create/bind custom textline elements if they exist
				................................................*/
				textline.exists(function() {

					self.textline.createElements(self,textline);
					self.textline.bindEvents();	
					
				})
		},
		
		
		/*	create and bind -
		
			the create bind method first inserts the new markup 
			passed by each input type createElements method. We must
			then deal with focus/blur events for all newly added
			elements, to enable tab browser and other keyboard input
			when using the form.
		..............................................................*/
		createBind: function(instance,el) {
			

			if (el.class_name === 'ui-select') { 

				this.$el.find('select').hide();
				
				instance.after(el.str);					
				
				this.$el.find('.'+el.class_name).on('focus', function(){
					$(this).addClass('focus');
				})
				this.$el.find('.'+el.class_name).blur('focus', function(){
					$(this).removeClass('focus');
				})
			
				this.$el.find("a").each(function() {
					$(this).attr("hideFocus", "true").css("outline", "none");
				});
			}
			
			else {
				instance.css({position: 'absolute', left: '-999999px' });
				
				instance.after(el.str);				
				
				instance.on('focus', function(){
					$(this).next('.'+el.class_name).addClass('focus');
					})
				instance.on('blur', function(){
					$(this).next('.'+el.class_name).removeClass('focus');
				})		
			}
		
		},
		
		
		/*  checkbox methods (create, bind, update) -
			
			create 'mock' checkbox elements, then
			bind events to these elements, mimicing the
			style and functionality of checkbox input
			elements,then call the updateForm method, 
			to update the actual associated checkbox
		................................................*/			
		checkbox: {
			
			createElements: function(self,checkbox) {
				
				checkbox.each(function() {
					var name = $(this).attr('name'),
						ui_classes = $(this).attr('class'),
						el = {},
						checked,
						disabled;

					disabled = $(this).attr("disabled") ? ' disabled' : '';													
					checked = $(this).is(":checked") ? ' checked' : '';						
					ui_classes = ui_classes ? ' '+ui_classes : '';
					ui_classes = ui_classes + checked + disabled;

					el.str = '<span id="'+name+'" class="ui-checkbox'+ui_classes+'"></span>';
					el.class_name = "ui-checkbox";

					self.createBind($(this),el);

				})
			},
			
			bindEvents: function(grand_self,checkbox) {
				var self = this;
				grand_self.$el.find('.ui-checkbox').on('click',function() {

					if ($(this).hasClass('disabled')) {
						return false;
					}
					else {
						$(this).prev('input[type="checkbox"]').focus();

						var checkbox = $(this),
							target_name = checkbox.attr('id');

						if (checkbox.hasClass('checked')) {
							checkbox.removeClass('checked');
							self.updateForm(target_name,null);
						} 
						else {
			 				checkbox.addClass('checked');
							self.updateForm(target_name,true);
						}	
					}
				})
				checkbox.bind('keydown',function(event){
					if (event.which == 32) {
						$(this).next('.ui-checkbox').toggleClass('checked');
					}
				});
			},
			
			updateForm: function(name,value) {

					if (value) {
						$('input[name="'+name+'"]').attr('checked','checked');							
					}
					else {
						$('input[name="'+name+'"]').attr('checked',null);														
					}
			}
			
		},

		/*  select methods (create, bind, update) -
			
			create 'mock' select/option elements, then
			bind events to these elements, mimicing the
			style and functionality of select/option
			form elements,then call the updateForm method, 
			to update the actual associated 
			select/option dropdown
		................................................*/			
		select: {
	
			createElements: function(grand_self,select) {
				var self = this;
				
				select.each(function() {
					var option_arr = [],
						ui_name = $(this).attr('name'),
						ui_classes = $(this).attr('class'),
						ui_current,
						el = {},
						selected,								
						select_options = '';

					ui_classes = ui_classes ? ' ' + ui_classes : '';	

					$(this).find('option').each(function(index) {
						var option,
							current;

						if ($(this).hasClass('legend')) {
							self.legend_hover = $(this).data('hover');
							ui_current = $(this).html();
							self.legend = ui_current;
						}
						else {
							
							if ($(this).prop('selected')) {
								option = '<span class="selected option'+index+'" data-value="'+$(this).val()+'">' + $(this).html() + '</span>';
								ui_current = $(this).html();
							}
							else {
								option = '<span class="option'+index+'" data-value="'+$(this).val()+'">' + $(this).html() + '</span>';									
							}
						
							option_arr.push(option);
						}
					})	

					for(var i=0;i<option_arr.length;i++) {
						select_options += option_arr[i];
					}

					el.str = '<a href="#" style="display: block" id="'+ui_name+'" class="ui-select'+ui_classes+'"><strong class="current_selected">'+ui_current+'</strong><span class="options">' + select_options + '</span></a>';
					el.class_name = "ui-select";
					
					grand_self.createBind($(this),el);
				})

			},

			bindEvents: function(grand_self) {

				var self = this,
					select = {		

						open: function (select_menu) {

							select.close();

							if (select_menu.next('.options').not(":visible")) {
								select.close();						
								select_menu.parent('.ui-select').addClass('active')
								select_menu.next('.options').fadeIn(0).css('display','block');	
								$('.link-top-inverse').not('.header-subtitle').css('opacity',0);
								$('.link-top-inverse.header-subtitle').css('borderBottom','1px solid transparent');								
							}

						},

						close: function() {
							grand_self.$el.find('.ui-select').removeClass('active').find('.options').fadeOut(0);
							
							$('.link-top-inverse').not('.header-subtitle').css('opacity',1);
							
						}

					};

				$(document).click(function(){
			        if($('.ui-select').find('.options').is(":visible")) {
		                select.close();
			        }
			    });

				
				grand_self.$el.find('.ui-select').hover( 
					function(){	
						$(this).find('.current_selected').html(self.legend_hover);
					},
					function(){
						if (!$(this).find('.options').is(':visible')) {
							var legend_text = $(this).find('span.selected').html();
							$(this).find('.current_selected').html(legend_text);	
						}
						
					}
				);

			    grand_self.$el.find('.ui-select').find('.current_selected').on('click', function(event){
			        event.preventDefault();
			        event.stopPropagation();			
					$(this).parent().focus();
					
					if ($(this).next('.options').is(':visible')) {
						select.close();
					}
					else {
						select.open($(this));						
					}
			    });

			    grand_self.$el.find('.ui-select').find('.options span').on('click', function(event){
					var name = $(this).parent().parent().attr('id');
					$(this).parent().parent().focus();
			        event.preventDefault();
			        event.stopPropagation();					
		            select.close();

					$('#'+name).find('.options span').removeClass('selected');
					$(this).addClass('selected');
					self.updateForm(name,$(this).data('value'), $(this).text());
			    });

			    grand_self.$el.find('.ui-select').bind('keydown', function(event){

					var name = $(this).attr('id'),
						current_selected = $('#'+name).find('.selected');

					if ($(this).find('.options').is(':visible')) {

						switch (event.which) {
							case 9: 
								select.close();
							break;
							case 32:
								event.preventDefault();							
								select.close();															
							break;

							case 38:
								event.preventDefault();
								if (current_selected.length === 0) {
									var last = $('#'+name).find('.options span:last-child');
									last.addClass('selected');
									self.updateForm(name,last.data('value'), last.text());																	
								}
								
								else if (current_selected.index() !== 0) {
									$('#'+name).find('.options span').removeClass('selected');
									current_selected.prev().addClass('selected');
									self.updateForm(name,current_selected.prev().data('value'),current_selected.prev().text());										
								}

							break;								

							case 40:
								event.preventDefault();		
								if (current_selected.length === 0) {
									var first = $('#'+name).find('.options span:first-child');
									first.addClass('selected');
									self.updateForm(name,first.data('value'),first.text());																	
								}
																					
								else if (current_selected.is(':last-child')) {
									break;
								} 
								else {
									$('#'+name).find('.options span').removeClass('selected');
									current_selected.next().addClass('selected');
									self.updateForm(name,current_selected.next().data('value'), current_selected.next().text());
								}
							break;								
						}
					}
					else if (event.which === 32 || event.which === 38 || event.which === 40) {
						event.preventDefault();
						select.open($(this).find('.current_selected'));
					}
			    });

			},
			
			updateForm: function(name,value,text) {
				var self = this;

				$('select[name="'+name+'"]').find('option').attr('selected',null).each(function() {

					if ($(this).val() == value) {
						current = self.legend ? self.legend+' - ' : '';
						
						$('#'+name).find('.current_selected').text(text);
						
						$(this).attr('selected','selected');
					}
				});
				
			}
			
		},


		/*  textarea methods (create, bind, update) -
			
			description
		................................................*/			
		textarea: {
			
			createElements: function(self,textarea) {

				textarea.each(function() {

				})					
				
			},
			
			bindEvents: function() {
				
			},
			
			updateForm: function() {
				
			}
			
		},

		
		/*  textline methods (create, bind, update) -
			
			description
		................................................*/			
		textline: {
			
			createElements: function(self,textline) {

				textline.each(function() {

				})					
				
			},
			
			bindEvents: function() {
				
			},
			
			updateForm: function() {
				
			}
			
		},

		/*  radio methods (create, bind, update) -
			
			create 'mock' radio button elements, then
			bind events to these elements, mimicing the
			style and functionality of radio buttons,
			then call the updateForm method, to update
			the actual associated radio element
		................................................*/			
		radio: {
			
			createElements: function(self,radio) {
				var radio_arr = [],
					radio_options = "";
					ui_name = radio.find('input').attr('name'),
					el = {},
					ui_classes = radio.attr('class');

				ui_classes = ui_classes ? ' ' + ui_classes : '';

				radio.each(function() {
					$(this).find('input').each(function() {
						if ($(this).prop('checked')) {
							radio_arr.push('<li class="checked" data-value="'+$(this).val()+'">'+$(this).next('.radio-label').html()+'</li>');									
						}
						else {
							radio_arr.push('<li data-value="'+$(this).val()+'">'+$(this).next('.radio-label').html()+'</li>');									
						}
					})
								
					for(var i=0;i<radio_arr.length;i++) {
						radio_options += radio_arr[i];
					}

					el.str = '<ul id="'+ui_name+'" class="ui-radio'+ui_classes+'">' + radio_options + '</ul>';
					el.class_name = "ui-radio";
					
					$(this).after(el.str).css({position: 'absolute', left: '-999999px'});
					
					$(this).find('input').on('focus',function() {		
						var index = $(this).parent().find('input').index(this);
						radio.next('.'+el.class_name).find('li').removeClass('focus checked');
						radio.next('.'+el.class_name).find('li:eq('+index+')').addClass('focus checked');						
					})
					$(this).find('input').on('blur',function() {
						radio.next('.'+el.class_name).find('li').removeClass('focus');
					})						
				})					
				
			},
			
			bindEvents: function(grand_self) {
				var self = this,
					name = '',
					parent = '';
					
				grand_self.$el.find('.ui-radio').find('li').on('click',function() {

					var index = $(this).index();

					$(this).addClass('focus');
					$(this).closest('.ui-radio').prev('.radio').find('input').attr('checked',null).blur();
					$(this).closest('.ui-radio').prev('.radio').find('input:eq('+index+')').focus();
					
					parent = $(this).closest('.ui-radio');
					parent.find('.checked').removeClass('checked');
					name = parent.attr('id');
					$(this).addClass('checked');
					self.updateForm(name,$(this).data('value'),parent);
				});
				
				grand_self.$el.find('.radio').bind('keyup', function(event){
					
					if (event.which === 32 || event.which === 38 || event.which === 40 || event.which === 39 || event.which === 37) {

						var parent = $(this),
							name = event.target.name;
							parent.find('.checked').removeClass('checked');				
							parent.find('input').attr('checked',null);
							self.updateForm(name,event.target.defaultValue,parent);
					}
				});
			},
			
			updateForm: function(name, value, parent) {

				// parent.find('.checked').removeClass('checked');

				$('input[name="'+name+'"]').each(function() {

					if (parseInt($(this).val()) === parseInt(value)) {	
						$(this).prop('checked','checked');

					}
				})
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