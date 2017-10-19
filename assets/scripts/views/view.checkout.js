/* .........................................................................................................

  View Checkout

  @ Run bind plugins/modules for Checkout View
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated May 2013

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['checkout'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {

      SPN.modules['checkout'].init();
      this.bindEvents();
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {
      this.verifyZip();
      if ($('body').attr("id") !== 'review') {
        this.stopFixedSummary();
      } else {
        $('#form-review').css('min-height', $('.checkout-summary').outerHeight()  + 125 + 'px');
        $('.checkout-summary').css({'position':'absolute', 'top': '30px'});
      }
    },

    bindEvents: function() {
      $(document).on('shipping:change', function() {
        $('[data-html="shipping"]').html(SPN.utils.currency(SPN.bag.shipping, true));
      });

      $('#checkout-form').on('submit', function(event) {
        var data = $(this).serialize();
        event.preventDefault();
        $.ajax({
          url: '/cart/update.js',
          method: 'POST',
          data: data,
          dataType: 'json'
        }).done(function() {
          window.location.href = '/checkout';
        });
      });
    },

    checkForReady: function() {
      if ($('[name="attributes[delivery_date]"]').val().length && $('[name="attributes[postal_code]"]').val().length) {
        $('#continue').prop('disabled', false);
      }
    },

    verifyZip: function() {
      var self = this;

      $('[name="attributes[delivery_date]"]').on('keyup blur', function() {
        self.checkForReady();
      });

      $('[name="attributes[postal_code]"]').on('keyup blur', function(){
        var postal_code = $(this).val();

        if (postal_code.length >= 5) {
          if (typeof(SPN.postal_codes) !== 'undefined') {
            if ($.inArray(parseInt(postal_code), SPN.postal_codes.local) !== -1) {
              SPN.bag.shipping = 1000;
              $(document).trigger('shipping:change');
              self.checkForReady();
            } else if ($.inArray(parseInt(postal_code), SPN.postal_codes.manhattan) !== -1) {
              SPN.bag.shipping = 2500;
              $(document).trigger('shipping:change');
              self.checkForReady();
            } else if ($.inArray(parseInt(postal_code), SPN.postal_codes.boroughs) !== -1) {
              SPN.bag.shipping = 3500;
              $(document).trigger('shipping:change');
              self.checkForReady();
            } else {
              self.alertOutOfZone();
            }
          }
        } else {
          self.resetZone();
        }
      });
    },

    alertOutOfZone: function() {
      $('.tooltip').removeClass('is-hidden').addClass('is-active');
      $('.checkout-summary').css('opacity', '.2');
      $('#continue').prop('disabled', true);
    },

    resetZone: function() {
      SPN.bag.shipping = 0;
      $(document).trigger('shipping:change');
      $('.tooltip').addClass('is-hidden').removeClass('is-active');
      $('.checkout-summary').css('opacity', '1');
    },

    stopFixedSummary: function() {
      var el = $('.checkout-summary'),
          absolute_clone = $('.checkout-absolute-clone'),
          fixed_clone = $('.checkout-fixed-clone'),
          set = false,
          clone_offset,
          prev_scroll = 0;

      absolute_clone.height(el.height());


      $(window).on('resize', function() {
         absolute_clone.css({
          bottom: ($('.fixed-stop').height() / 4) + 'px'
        });
        absolute_offset = absolute_clone.offset().top;
      });

      $(window).trigger('resize');

      $(window).on('scroll', function() {
        var current_scroll = $(this).scrollTop(),
            element_offset = el.offset().top,
            fixed_offset = fixed_clone.offset().top;

        // down
        if (current_scroll > prev_scroll) {
          if (fixed_offset >= absolute_offset) {
            el.css({
              position: 'absolute',
              top: absolute_offset - 65 + 'px'
            });
          }

        // up
        } else {
          if (fixed_offset <= absolute_offset) {
            el.css({
              position: 'fixed',
              top: '30%'
            });
          }
        }

        prev_scroll = current_scroll;
      });
    }
  };

})(window,document,jQuery,SPN);
