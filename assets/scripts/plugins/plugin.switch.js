;var SPN = SPN || {};
    SPN.Plugin = SPN.Plugin || {};

/*.....................................
  Switch
......................................*/
SPN.Plugin['switch'] = SPN.Super.extend({

  /* options
  ..................................*/
  options: {
    toggle: false,
    trigger_active_class: 'is-open'
  },
  elements: {},

  setup: function() {
    var self = this;

    self.bindEvents();
  },

  ready: function() {
    var self = this;

    self.elements.el.trigger('switch:ready');
  },

  /* bind events
  ..................................*/
  bindEvents: function() {
    var self = this;

    self.elements.el.find('[data-switch-trigger]').on('click',function(event){
      var target = $(this).data('switch-trigger');

      self.elements.el.find('[data-switch-trigger]').removeClass(self.options.trigger_active_class);
      $(this).addClass(self.options.trigger_active_class);

      if (self.options.toggle) {
        // self.elements.el.find('[data-switch-target]').removeClass('is-active');
      }
      if ($(this).data('switch-checkbox')) {
        self.handleCheckbox($(this), target);
      }
      else {
        event.preventDefault();
        self.trigger(target);
      }
      self.elements.el.trigger('switch:triggered', [{ target: target }]);
    });

    self.ready();
  },

  trigger: function(target) {
    var self = this;

    if (target.indexOf(',') >= 0) {
      target = target.split(',');
      target.each(function(index, value){
        target[value] = $.trim(index);
      });

      target.each(function(index) {
        self.elements.el.find('[data-switch-target="' + index + '"]').each(function(){
          if ($(this).hasClass('is-active')) {
            $(this).removeClass('is-active');
          }
          else {
            $(this).addClass('is-active');
          }
        });
      });
    } else {
      self.elements.el.find('[data-switch-target="' + target + '"]').each(function(){
        if ($(this).hasClass('is-active')) {
          $(this).removeClass('is-active');
        }
        else {
          $(this).addClass('is-active');
        }
      });
    }
  },

  handleCheckbox: function(el, target) {
    var self = this,
        checkbox = el.parent().find('input[type="checkbox"]');

    setTimeout(function() {
      if (checkbox.is(':checked')) {
        self.elements.el.trigger('switch:checked', [{ target: target }]);
      } else {
        self.elements.el.trigger('switch:unchecked', [{ target: target }]);
      }

      if (target.indexOf(',')) {
        target = target.split(',');
        target.each(function(index, value){
          target[value] = $.trim(index);
        });
      }

      target.each(function(index) {
        self.elements.el.find('[data-switch-target="' + index + '"]').removeClass('is-active').each(function(){
          if (checkbox.is(':checked')) {
            if (typeof($(this).data('switch-checked')) !== 'undefined') {
              $(this).addClass('is-active');
            }
          }
          else {
            if (typeof($(this).attr('data-switch-checked')) === 'undefined') {
              $(this).addClass('is-active');
            }
          }
        });
      });
    }, 10);
  }
});

$(function(){
  SPN.Utils.initPlugin('switch');
});