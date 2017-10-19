/* .........................................................

    Module Checkout

  @ Events/bindings for Checkout
  @ the Arishill Co. (arishill.com)
  @ author Scott Robertson
  @ Updated May 2013

......................................................... */

;(function(window,document,$,SPN) {

  SPN.modules['checkout'] = {

    /* .....................................
      initiate notices
    ..................................... */
    init: function() {

      this.setDatePicker();
      this.configureTabbing();
      this.cleanTextarea();
      this.bindCheckoutEvents();

    },

    bindCheckoutEvents: function() {

      $('input[type="submit"]').on("click", function(){
        $(this).addClass("processing");
      });

      $('#form-billing').on('submit',function(event){
        event.preventDefault();

        var paymentForm = $(this);
        SPN.process.stripe.init(paymentForm, function(errors){

          if (errors) {
            return false;
          }
          else {
            paymentForm.get(0).submit();
          }

        });

      });

      $('#same-as').on('click',function(event) {
        event.preventDefault();

        var customer = DB.local.retrieve('customer');

        if (customer) {

          $('#form-billing').find('input').each(function() {

            var receive = $(this).data('receive');

            if(customer.shipping.hasOwnProperty(receive)){
              $(this).val(customer.shipping[receive]);
            }

          })
        }

      })
    },

    cleanTextarea: function() {

      var str = $('textarea[name="attributes[message]"]').val();
          str = $.trim(str);

      $('textarea[name="attributes[message]"]').val(str);
    },

    configureTabbing: function() {

        $('input').on('focus',function() {

          var i = $(this).index('input');

          if ($(this).hasClass('static')) {
            $(this).blur();

            if (!$(this).hasClass('datepicker-init')) {

              $("input:eq("+(i+1)+")").focus();
            }
          }
       })
     },

    setDatePicker: function() {

       var now = new Date(),
          tomorrow = 1;

      if (parseInt($('.datepicker-init').data('time')) >= 18) {
          tomorrow = 2;
      };

      now = new Date(now.getFullYear(), now.getMonth(), now.getDate() + tomorrow, 0, 0, 0, 0);

      $('.datepicker-init').exists(function() { $('.datepicker-init').datepicker(
          {
            onRender: function(date) {
              return date.valueOf() < now.valueOf() ? 'disabled' : '';
            }
          }
        )
      })

      if ($('.datepicker-init').val() === '') {
        $('.datepicker-init').datepicker('setValue',now);
        $('.datepicker-init').val('');
      }

    }

  }

})(window,document,jQuery,SPN);
