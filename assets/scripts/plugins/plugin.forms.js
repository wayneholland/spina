/* .........................................................................................................

	Plugin.PrepForms
	
	@ 	Adds placeholder fix, validation for forms
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'prepareForms';

	/* contructor function
	................................................*/
    function Plugin( element ) {
    	var self = this;

		/* plugin base variables
		.............................................*/
		self.el = element;
		self.$el = $(element);
		self._name = pluginName;		
		self.pages = {};

		/* plugin instance options/variables
		.............................................*/
		self.submitBtn = self.$el.find('input[type="submit"]');
		self.allInput = this.$el.find('input').add(this.$el.find('select')).add(this.$el.find('textarea')).not('input[type="submit"]').not($('.checkbox').find('input'));
		self.msgs = self.$el.data('msgs') || false;
		self.setInit = this.$el.find('.set-init') || null;
		self.library = self.$el.data('library') || false;
		self.processing = self.$el.data('processing');
		self.url = self.$el.attr('action');
		self.errors = {
			letters: [],
			num: [],
			email: [],
			password: [],
			password_confirm: [],
			integers: [],
			zip: [],
			exact: [],
			range: [],
			cap: [],
			phone: [],
			begin: [],
			required: [],
			year: [],
			num_cap: [],		
			specific: [],
			checkbox: [],			
			status : false
		};
		self.patterns = {
			containsLetters: /[A-Za-z]/,
			password:	/^[A-Za-z].*[0-9]|[0-9].*[A-Za-z]$/,
			email: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
			zip: /^\d{5}$|^\d{5}-\d{4}$/,
			integers: /^[0-9]+$/,
			phone: /^[0-9]{10}$/,
			letters: /^[a-zA-Z]+$/
		}

		if (self.$el.find('.validate-page').length > 0) {

			
			self.continueAction = self.$el.find('.validate-page');
			self.continueCallback = null;

			$.each(self.continueAction, function(index, value) {
				
				var id = $(value).data('target');

				self.pages[id] = {};
				self.pages[id].parentEl = self.$el.find('#'+id);

				var parentEl = self.pages[id].parentEl;

				self.pages[id].formEls = {
					'allInput': parentEl.find('input').add(parentEl.find('select')).add(parentEl.find('textarea')).not('input[type="submit"]').not($('.checkbox').find('input')),
					'letters': parentEl.find('.text'),
					'checkbox': parentEl.find('.checkbox'),
					'exact': parentEl.find('.exact'),
					'email': parentEl.find('input[type="email"]').add(parentEl.find('.email')),
					'password': parentEl.find('input[type="password"]'),
					'password_confirm': parentEl.find('.confirm-password'),
					'password_set': parentEl.find('.set-password'),
					'num': parentEl.find('.num'),
					'year': parentEl.find('.year'),
					'range': parentEl.find('.range'),
					'cap': parentEl.find('.cap'),
					'num_cap': parentEl.find('.num_cap'),			
					'begin': parentEl.find('.begin'),			
					'zip': parentEl.find('.zip'),						
					'phone': parentEl.find('.phone'),
					'specific': parentEl.find('.specific'),
					'total': parentEl.find('.total').length || false
				}

				self.pages[id].formEls.required = self.pages[id].formEls.allInput.not(parentEl.find(".optional"));
				
			});

		}

		else {
			
			self.continueAction = false;
			self.pages['default'] = {};
			self.pages['default'].formEls = {
				'allInput': this.$el.find('input').add(this.$el.find('select')).add(this.$el.find('textarea')).not('input[type="submit"]').not($('.checkbox').find('input')),
				'letters': this.$el.find('.text'),
				'checkbox': this.$el.find('.checkbox'),
				'exact': this.$el.find('.exact'),
				'email': this.$el.find('input[type="email"]').add(this.$el.find('.email')),
				'password': this.$el.find('input[type="password"]'),
				'password_confirm': this.$el.find('.confirm-password'),
				'password_set': this.$el.find('.set-password'),
				'num': this.$el.find('.num'),
				'year': this.$el.find('.year'),
				'range': this.$el.find('.range'),
				'cap': this.$el.find('.cap'),
				'num_cap': this.$el.find('.num_cap'),			
				'begin': this.$el.find('.begin'),			
				'zip': this.$el.find('.zip'),						
				'phone': this.$el.find('.phone'),
				'specific': this.$el.find('.specific'),
				'total': this.$el.find('.total').length || false
			};
			self.pages['default'].formEls.required = self.pages['default'].formEls.allInput.not(self.pages['default'].formEls.allInput.find(".optional"));
		}
		
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			description
		..............................................................*/
		init: function () {
			this.addPlaceholder();

			if (this.setInit){
				this.bindSameAs();
			}
			
			// if (this.instance.total) {
			// 	this.bindTotalEvents();
			// }
			
			this.bindValidate();
			this.bindErrorFX();

		},


		/*	bind same as shipping

			allow billing

		..............................................................*/
		bindSameAs: function() {
			var self = this;
				arr = [
					'first',
					'last',
					'address-1',
					'address-2',
					'city',
					'state',
					'country',
					'zip',
					'phone',
					'email'
				]

			self.setShipping = this.$el.find('.set-shipping');
			self.getShipping = this.$el.find('.get-shipping');

			self.setInit.on('click',function(event) {

				event.preventDefault();

				$.each(arr, function(index,value) {

					var item = self.getShipping.find('.get-'+value);

					if (item.is('select')) {
						var set_prop = item.find(':selected').val(),
							get_name = self.setShipping.find('.set-'+value).attr('name');

							FGC.uiForms.select.updateForm(get_name,set_prop);
					}
					else {
						self.setShipping.find('.set-'+value).val(item.val());
					}

				})

			})

		},


		/*	add placeholder -

			add placeholder functionality for IE
		..............................................................*/
		addPlaceholder: function() {
			var self = this,
				placeholder_group = this.$el.find('[placeholder]');

			if (placeholder_group.length > 0) {
				placeholder_group.each(function() {
					if ($(this).attr('type') === 'password') {
						var placeholder = $(this).attr('placeholder');
						$(this).removeAttr('placeholder');
						$(this).after('<span class="placeholder blur">'+placeholder+'</span>');
					}

					else if ($(this).val() == '') {
						$(this).addClass("blur");
						var placeholder = $(this).attr("placeholder");
						$(this).val(placeholder);
					}
				});

				placeholder_group.on("focus",function(){ 
					
					if ($(this).attr('type') === 'password') {
						var placeholder = $(this).next('.placeholder').text();
						$(this).parent().find('.placeholder').fadeOut(0);
					}

					else {
						var placeholder = $(this).attr("placeholder");
						if ($(this).val() === placeholder) { 
							$(this).removeClass("blur").val("");
						}	
					}
					
				});
				
				placeholder_group.on("blur", function() {
					
					if ($(this).attr('type') === 'password') {
						var placeholder = $(this).next('.placeholder').text();
						if ($(this).val() === "") {
							$(this).parent().find('.placeholder').fadeIn(0);	
						}
						
					}

					else {
						var placeholder = $(this).attr("placeholder");
						if ($(this).val() == "") {
							$(this).addClass("blur").val(placeholder);
						}	
					}
					
				})	

				this.$el.on('click', 'span', function() {
					if ($(this).hasClass('placeholder')) {
						$(this).fadeOut(0);
						$(this).parent().find('input').focus();
					}

				})
			}
		},

		/*	clear placeholder -

			to ensure things are validated properly we need to clear 
			the generated placeholder (per the addPlaceholder method)
			before validation
		..............................................................*/
		clearPlaceholder: function(el) {
			var self = this;
			
			if (el === 'all') {

				self.allInput.each(function() {
					var placeholder = $(this).attr('placeholder');
					if (placeholder && placeholder == $(this).val()) {
						$(this).val('');
					}		
				})
			}
			else {
				var placeholder = el.attr('placeholder');
				if (placeholder && placeholder == el.val()) {
					el.val('');
				}	
			}
			
		},

		/*	add error message -

			if any input item does not validate, the form is marked 
			invalid, an error message is added to the instance's error 
			object we add a class of error to the input element and we 
			add an error message (either the default or self which is
			specified in the input element's data-error-msg attribute) 
			after the invalid field in the DOM
		..............................................................*/
		addErrorMsg: function(el, err, arr) {

			if (!el.next().hasClass('form-error')) {
				
				if (this.msgs) { 
					if (el.data('error-msg')) {
						err = el.data('error-msg');						
					}
					var err_msg = '<span class="form-error">'+err+'<span class="arrow"></span></span>';
					if (el.hasClass('detachError')) {
						var target = el.data('detachto');						
						target ? $('.'+target).append(err_msg) : $('body').append(err_msg);
						el.addClass('error');						
					}
					else {
						el.addClass('error').after(err_msg);						
					}

				}
				else {
					el.addClass('error');
				}
			}					
			arr.push(err);
			this.errors.status = true;
		},

		/*	validate -

			this is the core functionality self runs through each 
			input field (based on its assigend type via its class or
			input type) and checks it against a validation pattern.
			if all is well, nothing is return. if an error, the
			addErrorMsg is called with a default error message.
		..............................................................*/		
		validate: function(page_name) {
			
			var self = this;

			self.pages[page_name].formEls.required.each(function(){
				
				self.clearPlaceholder($(this));
				if ($(this).val() === "") {
					var err = 'Required Field.';
					self.addErrorMsg($(this),err,self.errors.required);
			     }
			
			})
			
			self.pages[page_name].formEls.letters.each(function(){

				self.clearPlaceholder($(this));
				if ($(this).val() === "" || !self.patterns.letters.test($(this).val())) {						
					var err = 'Please use letters only (A-Z, a-z)';
					self.addErrorMsg($(this),err,self.errors.letters);
			     }
			})
			

			self.pages[page_name].formEls.password_confirm.each(function(){
				
				self.clearPlaceholder($(this));
				if ($(this).val() !== self.pages[page_name].password_set.val()) {

						var err = 'Oops! Password does not match.';
						self.addErrorMsg($(this),err,self.errors.password);
				     
			     }
			})

			self.pages[page_name].formEls.password.each(function(){
				var error = false,
					el = $(this);

				self.clearPlaceholder(el);
				if (el.val() === "") {
					if (el.hasClass('confirm-password')) {
						var err = 'Please confirm your password';	
					}
					else {
						var err = 'Please enter your password';	
					}

					error = true;
			     }

			     else if (el.hasClass('set-password') && el.val().length < 5) {

			     	var err = 'Password must be a minimum of 5 characters.';	
					error = true;

			     }

			     else if (el.hasClass('set-password') && !self.patterns.password.test(el.val())) {
					
					var err = 'Password must contain at least one letter and one number.';	
					error = true;

			     }

				 else if (el.hasClass('set-password') && el.val().length > 50) {
					
					var err = 'Password cannot be more than 50 characters long.';	
					error = true;

			     }

			     if (error && !el.next().hasClass('form-error')) {
					self.addErrorMsg(el,err,self.errors.password); 	
			     }
				
		     	
			})
			
			self.pages[page_name].formEls.checkbox.each(function(){

				if (!$(this).find('input[type="checkbox"]').is(':checked')) {
					if (!$(this).next().hasClass('form-error')) {
						var err = 'Please select one or more options';
						self.addErrorMsg($(this),err,self.errors.checkbox);
				     }
			     }
			})
		
			self.pages[page_name].formEls.email.each(function(){
				self.clearPlaceholder($(this));
				
				if ($(this).val() === "") {		
					if (!$(this).next().hasClass('form-error')) {					
						var err = 'Please enter your email address';
						self.addErrorMsg($(this),err,self.errors.email);
					}
				}	
				else if (!self.patterns.email.test($(this).val())) {		
					if (!$(this).next().hasClass('form-error')) {					
						var err = 'Please enter a valid email address';
						self.addErrorMsg($(this),err,self.errors.email);
					}
				}			
			})
			
			self.pages[page_name].formEls.num.each(function(){
				if ($(this).val() === "" || !self.patterns.integers.test($(this).val())) {

					if (!$(this).next().hasClass('form-error')) {
						
						var err = 'Please enter a valid whole number (no decimals)';
						self.addErrorMsg($(this),err,self.errors.integers);
				     }				
				   }
			})
			
			self.pages[page_name].formEls.num_cap.each(function(){
				self.clearPlaceholder($(this));			
		  		
				var data = parseInt($(this).val());
				var cap = parseInt($(this).data('cap'));
				
				if (data > cap) {

					if (!$(this).next().hasClass('form-error')) {
						var err = 'Must be less than or equal to ' + cap + '.';
						self.addErrorMsg($(this),err,self.errors.num_cap);
				     }				
			     }
			})
			
			self.pages[page_name].formEls.phone.each(function(){
				
				var data = $(this).val().replace(/[^0-9]+/g,'');

				if (data === "" || !self.patterns.integers.test(data) || self.patterns.containsLetters.test($(this).val()) || parseInt(data.length) < 10)
				 {
					if (!$(this).next().hasClass('form-error')) {
						
						var err = 'Please enter a valid phone number';						
						self.addErrorMsg($(this),err,self.errors.phone);
				     }				
			     }
			})

			self.pages[page_name].formEls.year.each(function(){
		    	var data = $(this).val().toString();
				if ($(this).val() === "" || !self.patterns.integers.test($(this).val()) || parseInt(data.length) !== 4) {
					
					if (!$(this).next().hasClass('form-error')) {					
						var err = 'Please enter a valid year (format xxxx)';
						self.addErrorMsg($(this),err,self.errors.year);
				     }
				}
			})
						
			self.pages[page_name].formEls.zip.each(function(){
		    	var data = $(this).val().toString();
				if ($(this).val() === "" || !self.patterns.integers.test($(this).val()) || parseInt(data.length) !== 5) {
					
					if (!$(this).next().hasClass('form-error')) {					
						var err = 'Please enter a valid zip code (format xxxxx)';
						self.addErrorMsg($(this),err,self.errors.zip);
				     }
				}
			})
			
			self.pages[page_name].formEls.exact.each(function(){
		    	var data = $(this).val().toString();
				var length = $(this).data('limit');
				if (data.length !== length) {

					if (!$(this).next().hasClass('form-error')) {
						var err = 'Must be exactly ' + length + ' characters long';
						self.addErrorMsg($(this),err,self.errors.exact);
				     }				
			     }
			})
			
			self.pages[page_name].formEls.specific.each(function(){
		    	var data = $(this).val();
				var specific = $(this).data('specific');
				if (data != specific) {
					if (!$(this).next().hasClass('form-error')) {
						var err = 'Value must equal ' + specific;
						self.addErrorMsg($(this),err,self.errors.specific);
				     }				
			     }
			})
			
			self.pages[page_name].formEls.range.each(function(){
				self.clearPlaceholder($(this));		
		    	var data = $(this).val().length;
				var begin = parseInt($(this).data('begin'));
				var cap = parseInt($(this).data('cap'));
		  		if (!(data >= begin && data <= cap)) {
					if (!$(this).next().hasClass('form-error')) {
						var err = 'Must be between ' + begin + ' and ' + cap + ' characters long';
						self.addErrorMsg($(this),err,self.errors.range);
			     	}
				}
			})
			
			self.pages[page_name].formEls.cap.each(function(){
				self.clearPlaceholder($(this));			
		  		
				var data = $(this).val().length;
				var cap = parseInt($(this).data('cap'));
				
				if (data > cap) {

					if (!$(this).next().hasClass('form-error')) {
						var err = 'Too long. Must be ' + cap + ' characters or less';
						self.addErrorMsg($(this),err,self.errors.cap);
				     }				
			     }
			})

			self.pages[page_name].formEls.begin.each(function(){
				self.clearPlaceholder($(this));			
		  	
				var data = $(this).val().length;
				var begin = parseInt($(this).data('begin'));
				if (data < begin) {

					if (!$(this).next().hasClass('form-error')) {
						var err = 'Too short. Must be at least ' + begin + ' characters long';
						self.addErrorMsg($(this),err,self.errors.begin);
				     }				
			     }
			})

			return !self.errors.status;
		},

		/*	showErrors -

			a method self can be called to show all error messages as 
			one block (as opposed to individual error messages)
		..............................................................*/		
		showErrors: function() {
			$('.error-notice').html('Oops! There were errors on the page.').slideDown(300);
			// $('.error-notice').html(thi.instance.errors).slideDown(300);			
		},

		/*	bind total events -

			for validation instances where fields need to be totaled
		..............................................................*/		
		bindTotalEvents: function() {
			var self = this;
			
			this.$el.find('.total').each(function() {

				var container = $(this),
					calc = 0,
					total = $(this).find('.total_calc'),
					el = container.find('input[type="text"]').not(total);

				el.blur(function(){
					
					calc = 0;

					el.each(function(){
						if ($(this).val() == '' || !self.patterns.integers.test($(this).val())) {
							$(this).val();
						}
						
						if (isNaN($(this).val()) || $(this).val() == '' || $(this).val() == null) {
							var value = 0;
						}
						else {
							var value = parseInt($(this).val());
						}
						calc = calc + value;
					})

					self.instance.total.val(calc);						
				})

			})	
		},
		
		/*	bind error fx -

			errors are cleared up individual input focus 
		..............................................................*/		
		bindErrorFX: function() {
			this.allInput.focus(function() {
				if ($(this).hasClass('error')) {
					$(this).removeClass('error').next('.form-error').remove();
					$('.error-notice').slideUp(300);

					var detach = $(this).data('detachto');
					if (detach) {
						$('.'+detach).find('.form-error').remove();
					}
				}
			})

			if ($('.checkbox').length > 0) {
				$('.checkbox').checkbox.click(function() {
					if ($(this).hasClass('error')) {
						$(this).removeClass('error').next('.form-error').remove();
						$('.error-notice').fadeOut();
					}
				})
			}

			this.allInput.blur(function() {
			})			
		},

		/*	bind validate -

			bind the validate method on submission of the form,
			and if it passes, send away, and if not... return errors.
		..............................................................*/		
		bindValidate: function() {
			var self = this;
	
			if (self.continueAction) {
				this.continueAction.on('keydown', function(event) {
				
					if (event.which === 13) {
						
						event.preventDefault();
						self.continueAction.addClass('processing');

						if (self.continueAction.hasClass('submit')) {
							self.submitBtn.attr("disabled", "disabled");
						}

						self.continueCallback = self.continueAction.data('callback');

						runValidations(self.continueAction.data('target'));
						
					}
			
				})

				this.continueAction.on('click', function(event) {
					event.preventDefault();
					
					$(this).addClass('processing');
					self.continueCallback = $(this).data('callback');
							
					var btn_type = $(this).attr('type');
											

					if (btn_type === 'submit') {
						$(this).attr("disabled", "disabled");
					}

					runValidations($(this).data('target'));
					
				})	
			}
			
			else {
				this.$el.on('submit',function(event) {
					
					self.submitBtn.attr("disabled", "disabled").addClass('processing');

					event.preventDefault();

					runValidations('default');

				})	
			}
			
			
			function runValidations(page) {
				if (!$(this).hasClass('off')) {
					self.errors = {
						letters: [],
						num: [],
						email: [],
						password: [],
						password_confirm: [],
						integers: [],
						zip: [],
						exact: [],
						range: [],
						cap: [],
						phone: [],
						begin: [],
						required: [],
						year: [],
						checkbox: [],
						num_cap: [],				
						specific: [],				
						status : false
					};
					self.$el.find('.form-error').remove();
					self.$el.find('.error').removeClass('error');


					if (self.validate(page)) {

						if (self.continueAction) {
							self.continueAction.not('input[type="submit"]').removeClass('processing');	
						}
						
						self.pages[page].is_valid = true;

						if (self.continueCallback) {
							self.onPageValidation(self.continueCallback);
						}
						
						
						else if (self.processing) {							
							
							self.clearPlaceholder('all');
							self.formSubmit['processing'](self);

						}
						else {
							self.clearPlaceholder('all');
							self.$el.get(0).submit();
			
						}

					}
					else {
						self.addPlaceholder();
						self.showErrors();
						if (self.continueAction) {
							$(window).scrollTop(0);
							self.continueAction.removeClass('processing');							
						}

						self.submitBtn.attr("disabled", null).removeClass('processing');
						return false;
					};
				}
			}
		},
		
		/*	on processing -

			run specific processing script depending on the form being
			submitted, donated by it's class.
		..............................................................*/		
		formSubmit: {
		
			processing: function(self) {

				switch (self.processing) {
					
					case 'mailchimp': 
						
						self.$el.fadeOut(100, function() {
							$('#newsletter-signup').addClass('processing');

							var response = LIBRARY.processing[self.processing].init(self.allInput,self.url);

							response.success(function(msg) {
								if (msg.indexOf('Thanks') != -1) {
									self.formSubmit['success'](self,msg);										
								}
								
								else if (msg.indexOf('already subscribed') != -1) {
									msg = "Looks like that email address is already subscribed. Thanks!"
									self.formSubmit['error'](self, msg);
								}
								else {
									self.formSubmit['error'](self, null);
								}								
							})
					
							});						
					
					break;

					case 'stripe':
					
						LIBRARY.processing[self.processing].init(self.$el, function(error) {
							
							if (error) {
								FGC.overlays['payment'].instance.overlay.find('.msg').html(error);
								FGC.overlays['payment'].showOverlay();
			
								self.submitBtn.attr("disabled", null).removeClass('processing');

							}

							else {

								self.$el.get(0).submit();
								
							}
						});

					break;				
				}
			},
			
			success: function(self, msg) {
				
				switch (self.processing) {
					
					case 'mailchimp': 

					msg = '<div class="success-msg copy-alt">'+msg+'</div>';
					
					$('#newsletter-signup').removeClass('processing').append(msg).find('.success-msg').fadeIn(500);
					
					setTimeout(function() {self.formSubmit['restore'](self)},5000);
					
					break;
										
				}
			},
			
			error: function(self, msg) {

					
				switch (self.processing) {
					
					case 'mailchimp': 
		
						if (msg === null) {
							msg = "Oops, something went wrong! Please try again later, or contact us at 718-797-0011 so we can add you to our list.";
						}
						else {
							msg = '<div class="success-msg copy-alt">'+msg+'</div>';

							$('#newsletter-signup').removeClass('processing').append(msg).find('.success-msg').fadeIn(500);
							
							setTimeout(function() {self.formSubmit['restore'](self)},5000);	
						}
					
					break;
					
					
				}
			},	
			
			restore: function(self) {

				$('#newsletter-signup').find('.success-msg').fadeOut(100, function() {
					self.allInput.val('').focus();
					self.$el.fadeIn(1000);
					$(this).remove();					
				});
			}					
			
		},

		/*	on page validation callback (if any)
		
		..................................................................... */	
		onPageValidation: function (callback) {
			var self = this;
			
			switch (callback) {
				case 'checkout-continue':	
						FGC.modules['checkout'].createCustomer(self.$el)
						FGC.modules['checkout'].updateCartShipping(self.$el.find('input[name="shipping_option"]:checked').val(), function() {
						FGC.modules['checkout'].calculateCartTax();
						
							$('#tab-2').removeClass('disable');
							location.hash = self.continueAction.attr('href');
							$(window).scrollTop(0);

						});
					break;
					
				default:

				break;
			}
		},
		
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