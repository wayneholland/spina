/* .........................................................................................................

  View Product

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['product'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {

      this.bindEvents();
      this.selectDropDowns();

      this.scrollGallery();
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {
      this.stopFixedProduct();
    },

    scrollGallery: function() {
      $('[data-scroll]').on('click',function(event){
        event.preventDefault();
        var offset = $('#' + $(this).data('scroll')).offset().top - 65;
         $('html, body').animate({
          scrollTop: offset
        }, 700);
      });
    },

    selectDropDowns: function() {

      if ($('.select-trigger').length > 0) {
        $('#add-to-bag').find('input[type="submit"]').prop('disabled','disabled').val('Select Size Above');

        $('.select-trigger').on('click',function(event) {
          event.stopPropagation();
          $(this).parent('.select').find('.select-drop').addClass('active');
        });

        $('.select-drop').on('click','a',function(){
          var value = $(this).data('value'),
              target = $(this).data('target'),
              selected = $(this).html();

          $(this).closest('.select').find('.select-trigger').html(selected);

          $('#'+target).val(value);
          $('#add-to-bag').find('input[type="submit"]').prop('disabled','').val('Add to Bag');
        });

        $('html,body').on('click',function(event) {
          if ($('.select-drop').is(':visible')) {
            $('.select-drop').removeClass('active');
          }
        });
      }
    },

    bindEvents: function() {
      var txt = {
        'nav-help': 'Need Help?',
        'nav-social': 'Share'
      };

      $(".nav-init").on('click','a',function(event){
        event.preventDefault();
        var target = $(this).data('target');

        if ($(this).text() === 'Close') {
          $(this).html(txt[target]);
          $('#'+target).removeClass('active');
        }
        else {
          $(this).html('Close');
          if (target === 'nav-social') {
            $('[data-target="nav-help"]').html(txt['nav-help']);
          }
          else {
           $('[data-target="nav-social"]').html(txt['nav-social']);
          }
          $('.product-nav').find('.active').removeClass('active');
          $('#'+target).addClass('active');
        }
      });
    },

    stopFixedProduct: function() {
      var el = $('.product-details'),
          absolute_clone = $('.product-absolute-clone'),
          fixed_clone = $('.product-fixed-clone'),
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