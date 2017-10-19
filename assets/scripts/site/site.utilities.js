/* .........................................................................................................

	Utilities

	@ 	Site specific utility methods
	@	by the Arishill Co. (arishill.com)
	@	author Scott Robertson
	@	Updated August 2012

......................................................................................................... */

;(function (window,document,$,SPN) {


	SPN.utils = {

		/*	get window object -

			returns object the properties of the current window,
			including height, width, ratio, and the dominate property.
		..............................................................*/
		getWinObj: function(offset) {
			var win = {
				width: $(window).width(),
				height: $(window).height() - offset
			};

			win.ratio = (win.width / win.height);
			win.dominant = win.height > win.width ? 'height' : 'width';

			return win;
		},

		/*	cents to dollars for display purposes -

			items are stored in cents in the DB.
		..............................................................*/
		currency: function(cents, decimal) {
			cents = parseInt(cents);

			if (decimal) {
				return '$' + (Math.round(cents)/100).toFixed(2);
			}
			else {
				return '$' + Math.round(cents/100);
			}
		},

		/*	check if images are loaded

			check if images are loaded via set interval
		..............................................................*/
    imagesLoaded: function(images,callback) {

    	var interval = 0,
    			status,
    			loaded,
    			check = setInterval(function(){
    				_check(images);
    			},100);


    	 function _check() {

			    interval++;

		  		if (interval > 70) {
	      		clearInterval(check);

			  			_return({
		      			errors: true,
		      			msg: 'There were issues loading'
		      		});
	    		}

	    		else {
		    		images.each(function(index,image){
		    			if ($(image).height() > 1) {
		      			loaded = true;
		    			}
		    			else {
		    				loaded = false;
		    				return;
		    			}
			  		});

			  		if (loaded) {
			  			clearInterval(check);

			  			_return({
		      			errors: false,
		      			msg: 'Success'
		      		});
		  			}

	    		}

    	 }

    	 function _return(msg) {
    	 	callback(msg);
    	 }
		},

		/* cover screen with container / image
		..............................................................*/
	 	cover: function(img,parent,toWindow) {

	    if (!toWindow) {

	      parent.width = parent.el.width();
	      parent.height = parent.el.height();
	      parent.ratio = parent.width / parent.height;

	      if (parent.ratio >= 1) {
	        img.el.width(parent.width);
	          img.el.css({
	          height: 'auto',
	          left: '0',
	          top: '50%',
	          marginLeft: '0',
	          marginTop: -(img.el.height()/2)+'px'
	        });

	      }
	      else if (parent.ratio < 1) {

	        img.el.height(parent.height);
	        img.el.css({
	          width: 'auto',
	          left: '50%',
	          top: '0',
	          marginLeft: -(img.el.width()/2)+'px',
	          marginTop: '0'
	        });

	      }
	    }

	    else {
	      win = SPN.utils.getWinObj($('header').height());

	      var horz = {
	        width: win.width,
	        height: img.ratio * win.width
	      };

	      var vert = {
	        width: win.height * img.ratio,
	        height: win.height
	      };

	      parent.el.css({
	        width: win.width,
	        height: win.height
	      });

	      if (vert.width < win.width || vert.height < win.height) {
	        img.el.css({
	          width: horz.width,
	          height: 'auto',
	          left: '0',
	          top: '50%',
	          marginLeft: '0',
	          marginTop: -(img.el.height()/2)+'px'
	        });
	      }
	      else {
	        img.el.css({
	          height: vert.height,
	          width: 'auto',
	          left: '50%',
	          top: '0',
	          marginLeft: -(img.el.width()/2)+'px',
	          marginTop: '0'
	        });
	      }
	    }

  	},

		imgLoaded: function(container) {
		  var count = 0,
		      loop;

		  loop = function() {
		    count++;
		    if ($(container).find('img').eq(0).height() > 0 || count >= 50) {
		      $(container).addClass('is-active');
		    } else {
		      setTimeout(function() {
		        loop(container);
		      }, 100);
		    }
		  };

		  loop();
		},

		fadeInOnLoad: function(element, wait_for_images) {
		  if (wait_for_images) {
		    SPN.utils.imgLoaded(element);
		  } else {
		    $(element).addClass('is-active');
		  }
		}
	};

})(window,document,jQuery,SPN);
