/* .........................................................................................................

	Ignite

	@ 	Ignites all appropriate javascript bindings, modules, utilities and other hogwarsh
	@	by the Arishill Co. (arishill.com)
	@	author Scott Robertson
	@	Updated December 2012

......................................................................................................... */


;(function(window,document,$,SPN) {

	$(document).ready(function() {

		/* Fade Page in (via CSS transitions if supported)
		.......................................................... */
		$('html').addClass('active').removeClass('loading');

		/* Run all & template specific methods/bindings on ready
		.......................................................... */
		if (!$('body').hasClass('error')) {
			SPN.views['all'].onPageReady();
		}


		if ($("body").attr('class')) {

			SPN.ui = $("body").attr('class');


			if (SPN.ui && (SPN.ui.indexOf(" ") !== -1)) {
				SPN.ui = SPN.ui.split(" ");
			}

			if ($.isArray(SPN.ui)) {
				$.each(SPN.ui, function(index, value) {
					if (value.match(/delivery|contact|faq|terms|privacy/)) {
						value = 'static';
					}
					if (value.match(/home/)) {
						value = 'home';
					}
					if (SPN.views[value]) {
						SPN.views[value].onPageReady();
					}
				});
			}

			else if (SPN.views[SPN.ui]) {
				SPN.views[SPN.ui].onPageReady();
			}

			/* Reference to the Current Template
			......................................................... */
			SPN['current'] = SPN.template;

		}

	});

	$(window).load(function() {

		if ($('.wf-active').length <= 0) {
			$('html').addClass('wf-active');
		}

		/* Run all & template specific methods/bindings on load
		......................................................... */
		if (!$('body').hasClass('error')) {
			SPN.views['all'].onPageLoad();
		}

		if ($("body").attr('class')) {

			if ($.isArray(SPN.ui)) {

					$.each(SPN.ui, function(index, value) {
						if (value.match(/delivery|contact|faq|terms|privacy/)) {
							value = 'static';
						}
						if (value.match(/home/)) {
							value = 'home';
						}
						if (SPN.views[value]) {
							SPN.views[value].onPageLoad();
						}
					});
				}

				else if (SPN.views[SPN.ui]) {
					SPN.views[SPN.ui].onPageLoad();
				}
		}

	})

})(window,document,jQuery,SPN);
