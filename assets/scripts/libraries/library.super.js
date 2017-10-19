/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.

 * w/ some additions by ScottusRobus
 */

// define namespace
;SPN = SPN || {};

(function(){

  var initializing = false,
      fnTest,
      isFunction;

  initializing = false;
  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  SPN.Super = function() {};

  SPN.Super.prototype = {

    init: function(el, params, name) {
      var self = this;

      this.util = (typeof(SPN.Utils) !== 'undefined') ? SPN.Utils : null;
      this.elements = $.extend({}, this.elements, params.elements);
      this.options  = $.extend({}, this.options, params.options);

      this.elements.el = $(el) || $(document.body);

      this.elements.el.data(name + '-api', this);

      if (isFunction(this.setup)) {
        this.setup();
      }
    }
  }

  SPN.Super.extend = function(obj) {
    var _super = this.prototype,
        prototype,
        name;

    initializing = true;
    prototype = new this();
    initializing = false;

    for (name in obj) {
      prototype[name] = typeof obj[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(obj[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super,
                ret;

            this._super = _super[name];

            ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, obj[name]) :
      obj[name];
    }

    function Class() {
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
      }
    }

    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  }

})();