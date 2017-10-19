/* .........................................................................................................

  View Static

  @ Run bind plugins/modules for Static View
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated August 2012

......................................................................................................... */

;(function(window,document,$,SPN) {

  SPN.views['static'] = {

    /* Bind plugins page ready
    ........................................................................ */
    onPageReady: function() {
      var self = this;

      if ($('.cover').length > 0) {
        self.cover();
      }

      $('[data-scroll]').on('click',function(event){
        var el = $('#' + $(this).data('scroll'));
        event.preventDefault();
        var offset = el.offset().top - 115;
         $('html, body').animate({
          scrollTop: offset
        }, 700, function(){

          el.addClass('is-active');
          setTimeout(function(){
            el.removeClass('is-active');
          }, 3000);
        });
      });

      $('[data-ratio]').ratio({ratio: 1});
    },

    /* Run modules/plugins on page load
    ........................................................................ */
    onPageLoad: function() {
      var self = this;
      $('.mapIt').exists(function() { $('.mapIt').mapIt(); });
      if ($('#delivery-check').length) {
        self.checkDelivery();
      }
    },

    checkDelivery: function() {
      var self = this,
          postal_code = $('#delivery-check').find("input"),
          location_price = $('.location-price'),
          location = $('.location'),
          price = $('.price'),
           defaultt = {
            lat: 40.723675,
            long: -73.986912
          },
          boroughs = {
            price: 25,
            title: 'Brooklyn/Queens',
            lat: 40.716910,
            long: -73.890781
          },
          manhattan = {
            price: 25,
            title: 'Manhattan',
            lat: 40.753331,
            long: -73.984337
          },
          local = {
            price: 25,
            title: 'Manhattan',
            lat: 40.732650,
            long: -73.998242
          };

      $('[data-outside-close]').on('click',function(event){
        event.preventDefault();
        $('.no-delivery').addClass('is-hidden').removeClass('is-active');
        postal_code.val('').focus();
      });

      $('[data-close]').on('click',function(event){
        event.preventDefault();
        SPN.prop.map.instance.panTo({lat: defaultt.lat, lng: defaultt.long});
        SPN.prop.map.instance.setZoom(13);
        location_price.addClass('is-hidden').removeClass('is-active');
        postal_code.removeClass('is-hidden').addClass('is-active').val('').focus();
      });

      $('#delivery-check').on('submit', function(event){
        event.preventDefault();

        if (typeof(SPN.postal_codes) !== 'undefined') {
          if ($.inArray(parseInt(postal_code.val()), SPN.postal_codes.local) !== -1) {
            self.changeMap(local, 15);
            // SPN.prop.map.instance.panTo({lat: local.lat, lng: local.long});
            // SPN.prop.map.instance.setZoom(15);
            // location.html(local.title);
            // price.html('$' + local.price);
          } else if ($.inArray(parseInt(postal_code.val()), SPN.postal_codes.manhattan) !== -1) {
            self.changeMap(manhattan, 14);
            // SPN.prop.map.instance.panTo({lat: manhattan.lat, lng: manhattan.long});
            // SPN.prop.map.instance.setZoom(14);
            // location.html(manhattan.title);
            // price.html('$' + manhattan.price);
          } else if ($.inArray(parseInt(postal_code.val()), SPN.postal_codes.boroughs) !== -1) {
            self.changeMap(boroughs, 14);
            // SPN.prop.map.instance.panTo({lat: boroughs.lat, lng: boroughs.long})
            // SPN.prop.map.instance.setZoom(14);
            // location.html(boroughs.title);
            // price.html('$' + boroughs.price);
          } else {
            $('.no-delivery').addClass('is-active').removeClass('is-hidden');
          }

        }
      });
    },

    changeMap: function(locale, zoom) {
      var postal_code = $('#delivery-check').find("input"),
          location_price = $('.location-price'),
          location = $('.location'),
          price = $('.price');

      SPN.prop.map.instance.panTo({lat: locale.lat, lng: locale.long})
      SPN.prop.map.instance.setZoom(zoom);
      location.html(locale.title);
      price.html('$' + locale.price);
      location_price.addClass('is-active').removeClass('is-hidden');
      postal_code.removeClass('is-active').addClass('is-hidden');
    },

    cover: function() {
      var cover = $(this);

      $(window).resize(function() {
        $('.cover').height($(window).height() - $('header').height());
      });

      $(window).trigger('resize');
    }
  };

})(window,document,jQuery,SPN);
