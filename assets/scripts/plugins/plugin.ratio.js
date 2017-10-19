/* .........................................................................................................

  Plugin.Swap

  @   swap / toggle from one view to another
  @ author Scott Robertson
  @ Updated August 2012

......................................................................................................... */


;(function ( $, window, document, undefined ) {

    var pluginName = 'ratio';

  /* contructor function
  ................................................*/
    function Plugin( element, options ) {

      /* plugin base variables
      .............................................*/
      this.el = element;
      this.$el = $(element);
      this._name = pluginName;

      /* plugin instance options/variables
      .............................................*/
      this.options = {
        ratio: options.ratio || null
      }
    }

  /* plugin methods
  ................................................*/
    Plugin.prototype = {

    /*  initiate -

      description
    ..............................................................*/
    init: function () {
      if (this.options.ratio === null) {
        this.width = parseInt(this.$el.css('width'));
        this.height = parseInt(this.$el.css('height'));
        this.options.ratio = this.width / this.height;
      }
      this.bindEvents();
    },

    /*  method -

      description
    ..............................................................*/
    bindEvents: function() {
      var self = this;

      $(window).on('resize', function(event) {
        var new_height = self.$el.width() / self.options.ratio;
        self.$el.height(new_height);
      });
      $(window).trigger('resize');
    }

  }

  /*  return a new object for each instance
  .............................................*/
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ).init());
            }
        });
    }

})( jQuery, window, document );
