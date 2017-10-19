var SPN = SPN || {};
    SPN.Plugin = SPN.Plugin || {};

/*.....................................
  Modal
......................................*/
SPN.Plugin['subscribe'] = SPN.Super.extend({

  name: 'subscribe',

  /* options
  ..................................*/
  options: {
    onSuccess: function(self, response) {
      if (parseInt(response.code) === 200) {
        $('footer').find('.message').html('Thanks! Check your email to confirm your subscription.');
        $('footer').find('.message').addClass('is-active');

      setTimeout(function() {
        $('footer').find('.message').removeClass('is-active');
        $('[data-switch-trigger="newsletter"]').trigger('click');
      }, 3000);
      } else {
        $('footer').find('.message').html(response.msg).addClass('is-active');
        setTimeout(function() {
          $('footer').find('.message').removeClass('is-active');
          $('footer').find('input').focus();
        }, 2000);
      }


    },
    onError: function(self, response) {
      if (typeof(response.msg) !== 'undefined') {
        $('footer').find('.message').html(response.msg).addClass('is-active');
      } else {
        $('footer').find('.message').html('We\'re sorry. There was an error. Please try again');
      }

      setTimeout(function() {
        $('footer').find('.message').removeClass('is-active');
        $('footer').find('input').focus();
      }, 2000);
    },
    container: null
  },

  elements: {
    container: null
  },

  setup: function() {
    if (this.options.container) {
      this.elements.container = $('#' + this.options.container);
    }

    this.bindEvents();
  },

  ready: function() {
    this.elements.el.trigger('subscribe:ready');
  },

  /* bind events
  ..................................*/
  bindEvents: function() {
    var self = this;

    this.elements.el.on('submit',function(event) {
      event.preventDefault();
      var response_text;

      if (self.elements.container) {
        self.elements.container.addClass('processing');
      }

      self.elements.el.addClass('processing');
      self.elements.el.find('input[type="submit"]').prop('disabled', true);

      $.ajax({
        url: self.elements.el.prop('action'),
        type: 'post',
        data: self.elements.el.serialize(),
        data_type: 'json'
      })
      .done(function(response) {
        response_text = (self.util.isJson(response)) ? JSON.parse(response) : response;
        self.options.onSuccess(self, response_text);
      })
      .fail(function(response) {
        response_text = (self.util.isJson(response.responseText)) ? JSON.parse(response.responseText) : response;
        self.options.onError(self, response_text);
      })
      .complete(function(response) {
        if (self.elements.container) {
          self.elements.container.removeClass('processing');
        }

        self.elements.el.removeClass('processing');
        self.elements.el.find('input[type="submit"]').prop('disabled', false);
      });
    });

    self.ready();
  },
});


$(function(){
  SPN.Utils.initPlugin('subscribe');
});