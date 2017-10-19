/* .........................................................

    Module Scroll

  @ Events/bindings for Feature Scroll
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated April 2013

......................................................... */

;(function(window,document,$,SPN) {

  SPN.modules['scroll'] = {

    /* .....................................
      initiate notices
    ..................................... */
    init: function() {
      var self = this,
          images = $('.feature-scroll').find('img');

          self.pageHeight = null;
          self.slideHeight = null;
          self.bindHoverEvents();

     SPN.utils.imagesLoaded(images,function(status) {

        if (!status.errors) {

          self.fillArea();
          self.setPageHeight();

          $('.feature-scroll')
           .find('.feature-section').addClass('ready').end()
           .removeClass('loading')
           .find('.feature-section').addClass('active').removeClass('ready');

          self.triggerPoint();
        }
        else {

        }
     });
    },

    bindHoverEvents: function() {

      $('.first').find('hgroup').hover(

        function() {
          $(this).parent('.feature-head').find('.decor').addClass('off');
        },
        function() {
          $(this).parent('.feature-head').find('.decor').removeClass('off');
        }

      )

    },

    triggerPoint: function() {
      var self = this,
          last = 0;


      $(window).on('scroll',function(event) {
        $('body').addClass('scrolling');

         clearTimeout($.data(this, "scrollTimer"));

        $.data(this, "scrollTimer", setTimeout(function() {
            $('body').removeClass('scrolling');
        }, 250));


        var current = $(this).scrollTop();

        if (current > last) {
          if (current >= self.slideHeight) {
            $('.feature-section.last').css({position:'relative',top: '0'});
          }
        }
        else {
          if (current <= self.slideHeight) {
            $('.feature-section.last').css({position:'fixed',top:'65px'});
          }
        }

        last = current;
      })

      $(window).trigger('scroll');
    },

    setPageHeight: function() {
      // var self = this,
      //     win = SPN.utils.getWinObj($('header').height());

      // self.slideHeight = $('.feature-head').height() + $('.feature-board').height();
      // self.pageHeight = this.slideHeight * 2;

      // $('.feature-scroll').height(this.pageHeight);
      // $('body').height(this.pageHeight+$('header').height()+$('footer').height());

    },

    fillArea: function() {


      $('.feature-board').find('.title-3').each(function() {

        var margin = -$(this).height() / 2;
        $(this).css({'marginTop': margin+'px'});
        $(this).parent('.item-desc').addClass('ready');

      })

      $('.feature-head').each(function() {
        var img = { el: $(this).find('img') },
            parent = { el: $(this) }

        img.width = parseInt(img.el.css('width'));
        img.height = parseInt(img.el.height());
        img.ratio = (img.width / img.height);

        $(window).resize(function() { SPN.utils.cover(img,parent,true); });
        $(window).trigger('resize');
      })

    }
  }

})(window,document,jQuery,SPN);