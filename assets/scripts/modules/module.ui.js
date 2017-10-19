/* .........................................................

		Module UI

	@ Events/bindings for Global UI elements
	@	the Arishill Co. (arishill.com)
	@	author Scott Robertson
	@	Updated April 2013

......................................................... */

;(function(window,document,$,SPN) {

	SPN.modules['ui'] = {

		/* .....................................
			initiate notices
		..................................... */
		init: function() {

			this.displayNoticeBar();
			this.displayNoticeOverlay();

		},

		/* .....................................
			display notice overlay
		..................................... */
		displayNoticeOverlay: function() {
			var notice = $('.noticeOverlay');

			if (notice.length > 0) {
				var blanket = '<div class="overlay-blanket" />';
				$('body').append(blanket);

				$('.overlay-blanket').fadeIn(400);
				notice.fadeIn(500);
			}

			if (notice.hasClass('animate')) {
				var closeOverlay = setTimeout(function() {
					notice.fadeOut(300);
					$('.overlay-blanket').fadeOut(400,
						function() { $('.overlay-blanket').remove(); });
				}, 5000);
			}

			this.setNoticeCloseEvents();
		},

		/* .....................................
			display close event
		..................................... */
		setNoticeCloseEvents: function() {
			var that = this;
					overlay = $('.noticeOverlay'),
					close = $('.noticeOverlay').find('.overlay-close');

			overlay.on('click', function(event) {
					event.stopPropagation();
			});

			$('html').click(function() {
				closeOverlay();
			});

			if (close.length) {
				close.on('click', function(event){
					event.preventDefault();
					event.stopPropagation();
					closeOverlay();
				})
			}

			function closeOverlay() {
				if (overlay.is(':visible')) {
					overlay.fadeOut(0, function() {
						overlay.removeClass('on');
					});
				}

				if ($('body').find('.overlay-blanket').length > 0) {
					$('.overlay-blanket').fadeOut(300,function(){
						$(this).remove();
					})
				}
			}
		},

		/* .....................................
			display notice bar
		..................................... */
		displayNoticeBar: function(msg, type) {
			var notice = $('.noticeBar'),
					body = $('html,header,.fixed-target');

			if (msg) {
				notice.find('.noticeBar-title').html(msg);
			}
			if (type) {
				notice.find('.noticeBar-title').removeClass('default error success').addClass(type);
			}

			if (notice.length > 0) {
				notice.css({'opacity': '0', 'display': 'block', 'top': '-50px'})
				notice.animate({top: '0px', opacity: '1'},300);
				body.animate({top: '+=50px'},300);

			}

			if (notice.hasClass('animate')) {
				var closeOverlay = setTimeout(function() {
					notice.animate({'opacity': '0', 'display': 'block', 'top': '-50px'},300);
					body.animate({top: '-=50px'},300);
				}, 5000);
			}
		},

		/* .....................................
			create notice bar
		..................................... */
		createNoticeBar: function(msg, type) {

		  var noticeBar = '<div class="noticeBar animate"><span class="'+type+' noticeBar-title"></span></div>';

		  $(noticeBar).appendTo('body').find('.noticeBar-title').html(msg);
		  this.displayNoticeBar();

		  SPN.modules.ui.noticeBar = $('.noticeBar').length;
		}

	}

})(window,document,jQuery,SPN);