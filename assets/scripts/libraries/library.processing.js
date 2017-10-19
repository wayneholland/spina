/* .........................................................................................................
	library
......................................................................................................... */

SPN.process = {

	'response' : null,

	'mailchimp': {

		init: function(email, url, response) {

			var subscription = JSON.parse(JSON.stringify({ 'email': email.val() }));

			return $.ajax({
						url: url,
						type: 'POST',
						data: subscription,
					});
		}

	},

	'campaignMonitor': {

		init: function(email, url) {

		}

	},

	'stripe': {

		init: function(stripeForm, callback) {

			var msg,
					customer = DB.local.retrieve('customer');

			Stripe.createToken({
	      number: $('#card-number').val(),
	      cvc: $('#card-cvc').val(),
	      exp_month: $('#card-expiry-month').val(),
	      exp_year: $('#card-expiry-year').val(),
	      name: $('input[name="billing[first_name]"]').val() + ' ' + $('input[name="billing[last_name]"]').val(),
		    address_line1: $('input[name="billing[address_one]"]').val(),
		    address_line2: $('input[name="billing[address_two]"]').val(),
		    address_city: $('input[name="billing[city]"]').val(),
		    address_state: $('input[name="billing[province]"]').val(),
		    address_zip: $('input[name="billing[postal_code]"]').val(),
		    address_country: $('input[name="billing[country]"]').val()
	    }, stripeResponseHandler);

			function stripeResponseHandler(status, response) {

				if (response.error) {

					switch (response.error.code) {

						case 'incorrect_number' :
							msg = "Your card number is not correct for this type of card. Please double check and reenter.";
						break;
						case 'invalid_number' :
							msg = "Your card number is not valid. Please double check and reenter.";
						break;
						case 'invalid_expiry_month' :
							msg = 'The expiration month you have entered is invalid. Please try again or use a different card.';
						break;
						case 'invalid_expiry_year' :
							msg = 'The expiration year you have entered is invalid. Please try again or use a different card.';
						break;
						case 'invalid_cvc' :
							msg = 'Your security code (CVC) is not valid. Please double double check and reenter.';
						break;
						case 'expired_card' :
							msg = 'Your card has expired. Please check the expiration date.';
						break;
						case 'incorrect_cvc' :
							msg = 'The CVC (security code) you have entered is incorrect. Please try entering it again. If you continue to have trouble, please contact us to make your order by phone.';
						break;
						case 'card_declined' :
							msg = "We're sorry, but unfortunately your card was declined. This could happen for various reasons. Please try using a different card or contact your bank to ensure your card is in good standing.";
						break;
						case 'processing_error' :
							msg = "We're sorry, but unfortunately an error occurred while processing your card. You were not charged. Please try using a different card or contact us to make your order by phone.";
						break;

	        }

          SPN.modules['ui'].createNoticeBar(msg,'error');

          callback(true);
        } else {
          var token = response.id;
          stripeForm.append($('<input type="hidden" name="stripe_token" />').val(token));
          callback(false);
        }

			}

		}
	}
};