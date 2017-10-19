/* .........................................................................................................

  View UI ''

  @   Run bind plugins/modules for '' View
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated August 2012

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['gallery'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {
      var self = this,
          images = $('.gallery').find('img');

      if ($('.cover').length > 0) {
        self.cover();
      }


      var feat = $('.gallery-featured').find('img');
      feat.hide();
      var src = feat.prop('src');
      $('.gallery-featured').css({
        'background-image': 'url('+ src + ')'
      });

      self.galleryZoom();
      self.galleryMasonry();
      self.galleryScroll();
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {

      // $('#gallery-cascade').find('.title-3').each(function() {

      //   var padding = (($(this).parent().outerHeight() - $(this).height())/2) +10;

      //   $(this).css({'paddingTop': padding+'px'});

      // })

    },

    cover: function() {
      var cover = $(this);

      $(window).resize(function() {
        $('.cover').height($(window).height() - $('header').height());
        $('.gallery-fixed').height($(window).height() - $('header').height());
        $('.gallery-list').find('li').css({
          'height': $('.gallery-list').height() / 3 + 'px'
        });
      });

      $(window).trigger('resize');
    },

    galleryScroll: function() {
      var prev_scroll = 0;

     $(window).on('scroll', function() {
        var current_scroll = $(this).scrollTop();

        // down
        if (current_scroll > prev_scroll) {
          $('[data-scroll-event]').each(function() {
            if ($(this).offset().top - $('header').height() <= current_scroll && $(this).attr('data-status') !== 'activated') {
              $('[data-scroll-event]').removeClass('is-active');
              $(this).attr('data-status','activated').addClass('is-active');
              $('.gallery-fixed').find('img').attr('src', $(this).next('li').find('img').attr('src'));
            }
          });
        // up
        } else {
          $('[data-scroll-event]').each(function(index, value) {
            if ($(this).offset().top - $('header').height() > current_scroll && $(this).attr('data-status') === 'activated') {
              if (index !== 0) {
                $('[data-scroll-event]').removeClass('is-active');
                $(this).attr('data-status','').removeClass('is-active');
                $(this).prev('li').attr('data-status','activated').addClass('is-active');
                $('.gallery-fixed').find('img').attr('src', $(this).find('img').attr('src'));
              }
            }
          });
        }

        prev_scroll = current_scroll;
      });
    },

    galleryMasonry: function() {
      var self = this,
          items = $('.gallery-list').find('li'),
          count = items.length,
          per_row = Math.ceil(count / 3),
          rows = [],
          min = 20;

      for (var y=0; y < 3; y++) {
        var total_per_row = 0;
        rows[y] = [];

        for (var i=0; i < per_row; i++){
          var percent,
              max;
          if (i === 0) {
            max = (per_row - 1) * min;
            rows[y][i] = self.getRandomInt(min, max);
          }
          else if ((i+1) === per_row) {
            rows[y][i] = 100 - total_per_row;
          } else {
            max = 100 - (total_per_row + ((per_row - (i+1)) * min));
            rows[y][i] = self.getRandomInt(min, max);
          }
          total_per_row = total_per_row + rows[y][i];
        }
      }

      if (count % 3 !== 0) {
        var selected_row = self.getRandomInt(0, 2);
        if ( (per_row - (count/3)) > .5 ) {
          rows[selected_row][1] = rows[selected_row][1] + rows[selected_row][2];
          rows[selected_row].splice(2, 1);
          rows[selected_row][2] = rows[selected_row][3] + rows[selected_row][4];
          rows[selected_row].splice(4, 1);
        } else {
          rows[selected_row][1] = rows[selected_row][1] + rows[selected_row][2];
          rows[selected_row].splice(2, 1);
        }
      }

      self.setupImages(rows);
    },

    setupImages: function(rows) {
      var new_rows = [];
      $.each(rows, function(index, value){
        $.each(value, function(index, value) {
          new_rows.push(value);
        });
      });

      $('.gallery-list').find('li').each(function(index, value) {
        var src = $(this).find('img').prop('src');
        $(this).css({
          'height': $('.gallery-list').height() / 3 + 'px',
          'background-image': 'url('+ src + ')',
          'width': new_rows[index] + '%',
        }).find('img').hide();
      });
    },

    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    galleryZoom: function() {
      $("#gallery-zoom").on("modal:before",function(event, data){
        var imgel = data.trigger.find('img'),
            clas;

        if (imgel.height() > imgel.width()) {
          clas = 'is-vert';
        } else {
          clas = 'is-horz';
        }

        var img = '<img class="' + clas + '" src="' + imgel.prop('src') + '">';
        $(this).find('.content').html(img);
      });
    }
  }
})(window,document,jQuery,SPN);