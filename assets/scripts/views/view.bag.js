/* .........................................................................................................

  View Product

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['bag'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {
      this.stopFixedSummary();
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {
    },

    stopFixedSummary: function() {
      var fixed = $('.fixed-stop').offset(),
          orig_offset = $('.cart-summary').offset(),
          orig = $('.cart-summary').css('top'),
          height = $('.cart-summary').outerHeight(),
          lastScrollTop = 0,
          DOWN = false,
          UP = false;

      $(window).on('scroll',function(){
        var offset = $('.cart-summary').offset(),
            currentScrollTop = $(this).scrollTop(),
            pad = 30;

        if (currentScrollTop > lastScrollTop) {
          if (fixed.top+pad <= offset.top) {
            $('.cart-summary').css({
              position: 'absolute',
              top: fixed.top - pad
            });
          }
        }

        else if (currentScrollTop < lastScrollTop) {
          if (fixed.top-pad > currentScrollTop + parseInt(orig)) {
           $('.cart-summary').css({
              position: 'fixed',
              top: orig
            });
          }
        }
        lastScrollTop = currentScrollTop;
      });

    }

  };

})(window,document,jQuery,SPN);
