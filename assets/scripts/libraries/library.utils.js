;SPN.Utils = {

  /* initiate plugin
  ..................................... */
  initPlugin: function(name, options, elements) {
    var instance;

    if (SPN.Plugin[name]) {

      $.fn[name] = function ( options, elements ) {

        return this.each(function () {
          if (!$(this).data('plugin_' + name)) {
            var merged_options;

            $(this).data('plugin_' + name, true);
            if ($(this).attr('data-' + name)) {
              merged_options = SPN.Utils.getOptions($(this).attr('data-' + name), options);
            } else {
              merged_options = options;
            }

            var params = {
              elements: elements,
              options: merged_options
            }

            if (typeof SPN.Plugins[name] === 'undefined') {
              SPN.Plugins[name] = {
                index: [],
                list: {}
              };
            }

            instance = new SPN.Plugin[name](this, params, name);
            SPN.Plugins[name].index.push(instance);
            if (params.options && params.options.name) {
              SPN.Plugins[name].list[params.options.name] = instance;
            }
          }
        });
      };

      if ($('[data-'+name+']').length > 0) {
        $('[data-'+name+']')[name](options);
      }
      return SPN.Plugins[name];
    } else {
      if ($('[data-'+name+']').length > 0) {
        $('[data-'+name+']')[name](options);
      }
    }
  },

  /* initiate class
  ..................................... */
  initClass: function(name, options, elements) {
    if (!$(document).data('class_' + name)) {
      $(document).data('class_' + name, true);

      if (SPN.Class[name]) {
        var params = {
          elements: elements,
          options: options
        }, instance;

        if (typeof SPN.Classes[name] !== 'object') {
          SPN.Classes[name] = [];
        }

        instance = new SPN.Class[name](null, params, name);
        SPN.Classes[name].push(instance);

        return instance;
      }
    }
  },

  getOptions: function(options, defaults) {
    var self = this,
        options,
        obj = {};

    if (self.isJson(options)) {
      obj = JSON.parse(options);
    } else {
      options = options.split(';');
      $.each(options,function(index,value) {
        var val = value.split(': ');
        val[0] = $.trim(val[0]);
        val[1] = $.trim(val[1]);
        if (val[0].length > 0 && val[1].length > 0) {
          if (val[1] === 'false') {
            val[1] = false;
          }
          if (val[1] === 'true') {
            val[1] = true;
          }
          obj[val[0]] = val[1];
        }
      });
    }
    return $.extend( {}, defaults, obj);
  },

  isFunction: function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },

  isJson: function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  centsToDollars: function(cents) {
    var dollars = Math.round(cents) / Math.pow(10, 2);
    if (dollars.toString().match(/\.[0-9]$/))
      dollars = dollars.toString().replace(/\.([0-9])$/, '.$10');

    if (dollars.toString().match(/\.00$/))
      dollars = dollars.toString().replace(/\.00$/, '');

    if (dollars.toString().match(/(\.[0-9]{2}).*/)) {
      dollars = dollars.toString().replace(/(\.[0-9]{2}).*/, '$1');
    }

    return dollars;
  }
};