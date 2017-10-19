/* .........................................................

    Module UI

  @ Events/bindings for Global UI elements
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated April 2013

......................................................... */

;(function(window,document,$,SPN) {

  SPN.modules['bag'] = {

    /* .....................................
      initiate notices
    ..................................... */
    init: function() {
      this.bindHoverEvents();
      this.bindEvents();
    },

    updateBagObj: function(count) {
      $('#bag-count').data('count', count).find('.count').text(count);
    },

    bindHoverEvents: function() {
      $('.cart-bar a').wrapInner('<span class="count" />').append('<span class="on"></span>');
        $('.cart-bar a').hover(
          function() {
            var count = $(this).data('count');
            $(this).find('.count').hide()
              .end()
              .find('.on').html('Bag &bull; '+count).fadeIn(500);
          },
          function() {
            $(this).find('.on').hide()
              .end()
              .find('.count').fadeIn(300);
          }
        );
    },

    bindEvents: function() {
      var self = this;

      $(document).on('submit', '#add-to-bag', function(event){
        event.preventDefault();

        var $form = $(this);
        $form.find('input[type="submit"]').addClass('processing');
        self.addItem($form, {
          id: $('[name="item_id"]').val(),
          quantity: $('[name="item_quantity"]').val()
        });
      });

      $(document).on('submit', '.cart-item-remove', function(event){
        event.preventDefault();

        var $form = $(this);
        $form.find('input[type="submit"]').addClass('processing');
        self.changeItem($form, {
          id: $form.find('[name="item_id"]').val(),
          quantity: 0
        });
      });

      $(document).on('submit', '.cart-item-add', function(event){
        event.preventDefault();

        var $form = $(this);
        $form.find('input[type="submit"]').addClass('processing');
        self.changeItem($form, {
          id: $form.find('[name="item_id"]').val(),
          quantity: parseInt($form.find('[name="item_quantity"]').val(), 10) + 1
        });
      });
    },

    onAddError: function(data, form) {
      form.find('input[type="submit"]').removeClass('processing');
    },

    onAddSuccess: function(data, form) {
      var self = this,
          markup = '<ul class="cart-added title-4"><li>'+data.title+' Added to Bag</li><li>&bull;</li><li><a href="/cart">Checkout<a/></li></ul>';

      setTimeout(function(){
        form.find('input[type="submit"]').prop('disabled','disabled').val('Item Added');
        form.find('input[type="submit"]').removeClass('processing');
        if (SPN.modules.ui.noticeBar) {
          SPN.modules.ui.displayNoticeBar(markup,'success');
        }
        else {
          SPN.modules.ui.createNoticeBar(markup,'success');
        }
        self.updateBagObj($('#bag-count').data('count') + 1);
      },500);

      setTimeout(function(){
        form.find('input[type="submit"]').prop('disabled','').val('Add to Bag');
      },6000);
    },

    addItem: function(el, data) {
      var self = this;

      $.ajax({
        url: '/cart/add.js',
        data: data,
        method: 'POST',
        dataType: 'json',
      }).done(function(data) {
        self.onAddSuccess(data, el);
      }).fail(function(data) {
        self.onAddError(data, el);
      }).always(function() {
      });
    },

    empty: function(el) {
      var self = this;

      $.ajax({
        url: '/cart/clear.js',
        method: 'POST',
        dataType: 'json'
      }).done(function() {
        $('[data-state="catalog.cart"]').addClass('is-hidden');
      }).fail(function() {
      }).always(function() {
        self.updateCartMarkup(el);
      });
    },

    changeItem: function(el, data) {
      var self = this;

      $.ajax({
        url: '/cart/change.js',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(cart) {
        $.ajax({
          url: '/cart',
          method: 'GET'
        }).done(function(data) {
          var html = $(data).find('.cart').html();
          $('.cart').html(html);
          $('.autocenter').exists(function() { $('.autocenter').autoCenter(); })
          self.updateBagObj(cart.item_count);
        });
      }).fail(function() {
      }).always(function() {
      });
    },

    udpateItem: function(el, data) {
      var self = this;

      $.ajax({
        url: '/cart/update.js',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(cart) {
        $.ajax({
          url: '/cart',
          method: 'GET'
        }).done(function(data) {
          var html = $(data).find('.cart').html();
          $('.cart').html(html);
          $('.autocenter').exists(function() { $('.autocenter').autoCenter(); })
          self.updateBagObj(cart.item_count);
        });
      }).fail(function() {
      }).always(function() {
      });
    }
  };

})(window,document,jQuery,SPN);
