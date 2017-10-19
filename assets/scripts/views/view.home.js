/* .........................................................................................................

  View Product

......................................................................................................... */

;(function(window,document,$,SPN) {

  var slideshow;

  SPN.views['home'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {
      slideshow = {
        container: $('.slideshow'),
        active: $('.slideshow').find('.active'),
        nav: $('.slideshow-nav')
      };

      this.hoverStates();
      this.slideShow();
      this.bindSlideShowNav();
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {

    },

    hoverStates: function() {
      $('.item-1-1.right.top.offset').on('mouseenter', function() {
        $('.item-1-1.top.right').addClass('is-hover');
      });

      $('.item-1-1.top.right.offset').on('mouseleave', function() {
        $('.item-1-1.top.right').removeClass('is-hover');
      });

      $('.item-1-1.left.bottom.offset').on('mouseenter', function() {
        $('.item-1-1.left.bottom').addClass('is-hover');
      });

      $('.item-1-1.left.bottom.offset').on('mouseleave', function() {
        $('.item-1-1.left.bottom').removeClass('is-hover');
      });
    },

    bindSlideShowNav: function() {
      var self = this;

      slideshow.nav.on('click', '.disc', function(event) {
        event.preventDefault();

        var id = parseInt($(this).attr('data-trigger'));
        self.nextSlide(id);
        clearInterval(slideshow.interval);
        self.setSlideInterval();
      })
    },

    slideShow: function() {
      var self = this;

      slideshow.count = slideshow.container.find('li').length;

      for (var i = 0; i < slideshow.count; i++) {
        slideshow.container.find('li').eq(i).attr('data-id',i);
        var active = (i === 0) ? ' is-active' : '';
        slideshow.nav.append('<a href="#" class="disc' + active + '" data-trigger="' + i + '"></a>');
      }

      self.setSlideInterval();
    },

    setSlideInterval: function() {
      var self = this;

      slideshow.interval = setInterval(function() {
        var id = parseInt(slideshow.active.attr('data-id'));

        if (id + 1 >= slideshow.count) {
          self.nextSlide(0);
        }
        else {
          self.nextSlide(id + 1);
        }
      }, 5000);
    },

    nextSlide: function(index) {
      var el = slideshow.container.find('li[data-id="'+index+'"]');

      slideshow.container.prepend(el);
      slideshow.nav.find('a').removeClass('is-active is-top');
      slideshow.nav.find('[data-trigger="' + index + '"]').addClass('is-active');
      slideshow.active.removeClass('active');
      el.addClass('active');
      setTimeout(function() {
        slideshow.container.find('li').removeClass('is-top');
        el.addClass('is-top');
      }, 1500);
      slideshow.active = el;
    }
  };

})(window,document,jQuery,SPN);
