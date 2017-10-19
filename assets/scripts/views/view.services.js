/* .........................................................................................................

  View Services

  @   Run bind plugins/modules for '' View
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated August 2012

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['services'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {
      $('[data-scroll]').on('click',function(event){
        event.preventDefault();
        var offset = $('#' + $(this).data('scroll')).offset().top - 115;
         $('html, body').animate({
          scrollTop: offset
        }, 700);
      });
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {
      if (location.hash) {
        var offset = $(location.hash).offset().top - 115;
        $('html, body').animate({scrollTop: offset}, 0);
      }
      $(window).on('resize',function(){
        var win_height = $(window).height() - $('header').outerHeight();
        $('.service').each(function(){

          var el_height = $(this).outerHeight(),
              new_height = (el_height > win_height) ? el_height : win_height;

          $(this).find('.visual').height(new_height);
        });
      });
      $(window).trigger('resize');
    }

  }

})(window,document,jQuery,SPN);