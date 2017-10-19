/* .........................................................................................................

	Plugin.Truncate
	
	@ 	Description
	@	author Scott Robertson
	@	Updated August 2012
		
......................................................................................................... */


;(function ( $, window, document, undefined ) {
    
    var pluginName = 'truncate';

	/* contructor function
	................................................*/
    function Plugin( element ) {

		/* plugin base variables
		.............................................*/
		this.el = element;
		this.$el = $(element);
		this._name = pluginName;		

		/* plugin instance options/variables
		.............................................*/		
		this.instance = {
			'string': this.$el.text(),
			'maxLength': this.$el.data('length')
		} 
		this.instance.strLength = this.instance.string.length;
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {
		
		/*	initiate -
		
			i
		..............................................................*/
		init: function() {
			if (this.instance.strLength > this.instance.maxLength) {
				this.prepareString();
				this.storeReferences();
				this.bindEvents();	
			}
			else {
				this.$el.removeClass('truncate');
			}
		},

		/*	prepare string -
		
			determine where to truncate the string and store the
			truncated text and the string that will remain. if the
			text is truncated in the middle of the word, adjust to 
			truncate and the last white space. combine the updated
			string with the delimeter and more/less links and then
			insert back into the 'truncate' element.
		..............................................................*/		
		prepareString: function() {
			var self = this,
				trimmedString = this.instance.string.substr(0, this.instance.maxLength);
				last_space = trimmedString.lastIndexOf(" "),
				truncatedString = this.instance.string.substr(last_space),
				truncateReadyText = '';
				
			// trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
			
			// truncateReadyText = trimmedString + '<span class="truncate-delimiter"> &hellip;</span><a href="#" class="truncate-more">more</a><span class="truncate-text"> '+truncatedString+' <a href="#" class="truncate-less">less</a></span>';
			truncateReadyText = trimmedString + '<span class="truncate-delimiter">&hellip;</span><span class="truncate-text"> '+truncatedString+' <a href="#" class="truncate-less">less</a></span>';

			self.$el.html(truncateReadyText).show();
		},

		/*	store references -
		
			store references within the plugin instance object for 
			selections and bindings.
		..............................................................*/		
		storeReferences: function() {
			var self = this;

			self.instance = {
				'more': self.$el.find('.truncate-more'),
				'less': self.$el.find('.truncate-less'),
				'text': self.$el.find('.truncate-text'),
				'delimiter': self.$el.find('.truncate-delimiter')
			}
		},

		/*	bind events -
		
			bind events on click of the 'more' and 'less' links for 
			'showing' and 'hiding' the truncated text.
		..............................................................*/		
		bindEvents: function() {
			var self = this;
			
			self.instance.more.on('click',function(event) {
				event.preventDefault();
				$(this).fadeOut(0);
				self.instance.delimiter.fadeOut(0);
				self.instance.text.fadeIn(0);
			});	

			self.instance.less.on('click',function() {
				event.preventDefault();
				self.instance.delimiter.fadeIn(0);
				self.instance.more.fadeIn(0);
				self.instance.text.fadeOut(0);								
			});
		}
		
	}
	
	/*	return a new object for each instance
	.............................................*/
    $.fn[pluginName] = function () {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this ).init());
            }
        });
    }

})( jQuery, window, document );