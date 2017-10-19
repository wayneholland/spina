/* .........................................................................................................

	View Template Static

	@ 	Run bind plugins/modules for Static Page Views
	@	The Geshire Company (geshire.com)
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */

;(function(window,document,$,SPN) {

	SPN.views['error'] = {
			
		/* Bind plugins page ready
		........................................................................ */		
		onPageReady: function() {
		
	
		},
		
		/* Run modules/plugins on page load
		........................................................................ */		
		onPageLoad: function() {
	
			$('.autocenter').exists(function() { $('.autocenter').autoCenter(); })

		}
				
	}
		
})(window,document,jQuery,SPN);





