/* .........................................................................................................

	View UI All

	@ 	Run bind plugins/modules for All Views
	@	The Geshire Company (geshire.com)
	@	author Scott Robertson
	@	Updated April 2013

......................................................................................................... */

;(function(window,document,$,SPN) {

	SPN.views['all'] = {

		/* Run modules/plugins page ready
		........................................................................ */
		onPageReady: function() {

			SPN.modules['ui'].init();
			SPN.modules['bag'].init();
			// this.bindNewsletterEvents();

			$('.link-pad').exists(function() { $('.link-pad').linkPad(); })
      $('.popup').exists(function() { $('.popup').on('click', function() {}).popupWindow({ centerBrowser: 1});});
			$('.tabs').exists(function() { $('.tabs').tabs(); })
			$('.ui-form').exists(function() { $('.ui-form').customForms(); })
			$('.truncate').exists(function() { $('.truncate').truncate(); })
			$('.overlay-init').exists(function() { $('.overlay-init').overlay(); })

  		if ($(document).height() <= $(window).height()) {
  			$('.newsletter').css('display','block');
    	}

			if ($('.oddify').length > 0 ) {
				$('.oddify').find('li:odd').addClass('odd');
			}

			$('.nav-menu-trigger').on('click', function(event) {
				event.preventDefault();
				var header = $('header');
				if (header.hasClass('is-active')) {
					return header.removeClass('is-active');
				}
				header.addClass('is-active');
			});
		},

		/* Run modules/plugins on page load
		........................................................................ */
		onPageLoad: function() {
			$('.scroll').exists(function() { SPN.modules['scroll'].init(); })
			$('.autocenter').exists(function() { $('.autocenter').autoCenter(); })
			$('[data-switch-trigger="newsletter"]').on('click', function(event){
				if ($('footer').find("form").is(":visible")) {
					$('footer').find('input[name="email"]').focus();
				}
			});
			$('footer').find('input[name="email"]').on('blur', function(){
				if (!$('form').hasClass('processing')) {
					$('[data-switch-trigger="newsletter"]').trigger('click');
				}
			});
		},

		bindNewsletterEvents: function() {
			var self = this;

			$('#newsletter-form').on('submit', function(event) {
				event.preventDefault();

				var form = $(this);
				var email = form.find('[name=EMAIL]').val();

				form.addClass('processing');

				if (self.validateEmail(email)) {
					console.log('email valid');
					form.find('[name=email]').blur();
					self.registerEmail(form);
				} else {
					self.handleError('Please enter a valid email address');
				}
			});
		},

		validateEmail: function(email) {
			var valid = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
			return valid.test(email);
		},

		registerEmail: function(form) {
			var self = this;

			$.ajax({
					type: form.attr('method'),
					url: form.attr('action'),
					data: form.serialize(),
					cache: false,
					dataType: 'jsonp',
					contentType: 'application/json; charset=utf-8'
				}).then(function(data) {
					if (data.result !== 'success') {
						self.handleError(data.msg);
					}
					else {
						form.find('[name=email]').val('');
						// thanks
					}
					form.removeClass('processing');
				}, function() {
					self.handleError('Could not connect to the registration server. Please try again later.');
					form.removeClass('processing');
				});
		},

		handleError: function(error) {
			if (error.length > 50) {
				if (error.indexOf('already subscribed') >= 0) {
					error = 'You\'ve already subscribed! <a target="_blank" class="text--underline" href="' + $('<p>' + error + '</p>').find('a').prop('href') + '">Update Profile</a></span>';
				}
				else {
					error = 'An error occurred. Please try again in 5 minutes.';
				}
			}

			$('.newsletter').find('.message').html(error).addClass('is-active');
		}
	};

})(window,document,jQuery,SPN);
