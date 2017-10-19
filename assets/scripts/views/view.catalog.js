/* .........................................................................................................

  View Cataglog

  @ Run bind plugins/modules for Catalog View
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated August 2012
    
......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['catalog'] = {
    
    /* Bind plugins page ready
    ........................................................................ */   
    onPageReady: function() {
      _adjustRatio();
      
      $(window).on('resize',function() {
          _adjustRatio();
      });

      function _adjustRatio() {
        var width = $('.cascade li').width();
        $('.cascade li').height(width);
      }

    },
    
    /* Run modules/plugins on page load
    ........................................................................ */ 
    onPageLoad: function() {
              

    }

  }
    
})(window,document,jQuery,SPN);