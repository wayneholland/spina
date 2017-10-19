var SPN = SPN || {};
    SPN.Plugin = SPN.Plugin || {};

/*.....................................
  Modal
......................................*/
SPN.Plugin['modal'] = SPN.Super.extend({

  name: 'modal',

  /* options
  ..................................*/
  options: {
    close_on_click: true,
    // height: 'auto',
    ajax: false
  },
  elements: {

  },
  setup: function() {
    this.elements.el.css('height', this.options.height);
    this.id = this.elements.el.attr('id');
    this.elements.close = this.elements.el.find('[data-modal-close]');
    this.util.initPlugin('overlay');
    if ($('[data-overlay]').length) {
      this.overlay = $('[data-overlay]').data('overlay-api');
    } else {
      this.overlay = false;
    }

    this.bindEvents();
  },

  ready: function() {
    this.elements.el.trigger('modal:ready');
  },

  /* bind events
  ..................................*/
  bindEvents: function() {
    var self = this;

    $(document).on('click', '[data-modal-trigger="' + self.id + '"]', function(event){
      event.stopPropagation();
      event.preventDefault();
      self.closeAll();
      self.open($(this));
    });

    this.elements.el.on('click', function(event){
      if (!self.options.close_on_click) {
        event.stopPropagation();
      }
    });

    document.getElementById(this.id).addEventListener('click', function(event) {
      var obj = event.target,
          parents = [];

      if (obj.nodeName !== 'A') {
        while (obj) {
          parents.unshift(obj);
          obj = obj.parentNode;
        }

        for (i = 0; i < parents.length; i++) {
          if (parents[i].nodeName === 'A') {
            obj = parents[i];
          }
        }
      }

      var trigger = $(obj).attr('data-modal-trigger');
      if (typeof(trigger) != 'undefined') {
        self.closeAll();
        $('#'+trigger).data('modal-api').open();
      }
    }, true);

    this.elements.el.on('click', '[data-modal-trigger="' + self.id + '"]', function(event){
      if (!self.options.close_on_click) {
        event.stopPropagation();
      }
      event.preventDefault();
      self.closeAll();
      self.open($(this));
    });

    this.elements.close.on('click',function(event) {
      event.stopPropagation();
      event.preventDefault();
      self.close();
    });

    $(document).on('click',function(){
      if (self.elements.el.hasClass('is-active')) {
        self.close();
      }
    });

    self.ready();
  },

  open: function(trigger) {
    this.elements.el.trigger('modal:before', [{trigger: trigger}]);
    if (this.options.ajax) {
      this.elements.el.addClass('processing');
      this.ajaxRequest();
    }
    if (this.overlay) {
      this.overlay.open();
    }
    this.elements.el.addClass('is-active');
    this.elements.el.trigger('modal:open');
  },

  close: function() {
    this.elements.el.trigger('modal:close');
    if (this.overlay) {
      this.overlay.close();
    }
    this.elements.el.removeClass('is-active');
    this.elements.el.trigger('modal:after');
  },

  closeAll: function() {
    $('[data-modal]').each(function() {
      if ($(this).hasClass('is-active')) {
        $(this).data('modal-api').close();
      }
    });
  },

  ajaxRequest: function() {
    var self = this;
     $.ajax({
        url: self.options.ajax,
        type: 'get',
        data_type: 'json'
      })
      .done(function(response) {
          if (self.util.isJson(response)) {
            var responseText = JSON.parse(response);
          } else {
            var responseText = response;
          }
          self.elements.el.find('[data-modal-content]').html(responseText.data);
          $(document).trigger('ajax:done');
        })
      .fail(function(response) {
        if (self.util.isJson(response.responseText)) {
          var responseText = JSON.parse(response.responseText);
        } else {
          var responseText = response.responseText;
        }
        $(document).trigger('ajax:fail');
        // if (response.status == '401') {

        // }
        // form_el.removeClass('processing');
        // if (container.length) {
        //   container.removeClass('processing');
        // }
        // form_el.removeClass('processing');
        // form_el.find('input[type="submit"]').prop('disabled', false);
        // self.options.onError(responseText);
      })
      .complete(function(response) {
        $(document).trigger('ajax:complete');
        self.elements.el.removeClass('processing');
      });
  }
});

$(function(){
  SPN.Utils.initPlugin('modal');
});