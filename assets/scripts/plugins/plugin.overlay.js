var SPN = SPN || {};
    SPN.Plugin = SPN.Plugin || {};

/*.....................................
  Custom Forms Plugin
......................................*/
SPN.Plugin['overlay'] = SPN.Super.extend({

  name: 'overlay',

  options: {
    close_on_click: true,
    color: 'rgba(0, 0, 0, .4)',
    is_open: false,
    transition: '-webkit-transition: opacity .3s ease-out; -moz-transition: opacity .3s ease-out; -o-transition: opacity .3s ease-out; transition: opacity .3s ease-out;'
  },

  /* bind events
  ...................................*/
  bindEvents: function() {
    var self = this;
    this.elements.overlay.on('click', function(event) {
      event.preventDefault();
      if (self.options.close_on_click) {
        self.elements.el.trigger('overlay:closing');
        self.close();
      }
    });

    this.elements.el.trigger('overlay:ready');
    this.options.is_ready = true;
  },

  /* setup
  ...................................*/
  setup: function() {
    this.elements.overlay = this.elements.el;
    this.elements.overlay.css({
      'position': 'fixed',
      'top': 0,
      'bottom': 0,
      'right': 0,
      'z-index': 2147483646,
      'background': this.options.color,
      'opacity': 0,
      '-webkit-transition': 'opacity 400ms ease-out',
      '-moz-transition': 'opacity 400ms ease-out',
      '-o-transition': 'opacity 400ms ease-out',
      'transition': 'opacity 400ms ease-out',
      'left': '-999999px',
      'width': '1px',
      'height': '1px'
    }).appendTo('body');

    this.bindEvents();
    this.elements.el.trigger('overlay:initiated');
  },

  /* toggle
  ...................................*/
  toggle: function() {
    this.elements.el.trigger('overlay:toggle');
    if (this.options.is_open) {
      this.close();
    } else {
      this.open();
    }
  },

  /* open
  ...................................*/
  open: function() {
    var self = this;
    clearTimeout(self.options.transition_timeout);
    this.elements.overlay.css({
      'width': '100%',
      'height': '100%',
      'left': 0,
      'opacity': 1
    });
    this.options.is_open = true;
    this.elements.el.trigger('overlay:open');
  },

  /* close
  ...................................*/
  close: function() {
    var self = this;
    this.elements.overlay.css({ 'opacity': 0});
    this.options.transition_timeout = setTimeout(function() {
      self.elements.overlay.css({
        'left': '-999999px',
        'width': '1px',
        'height': '1px'
      });
    }, 500);
    this.options.is_open = false;
    this.elements.el.trigger('overlay:close');
  }
});

$(function(){
  SPN.Utils.initPlugin('overlay');
});