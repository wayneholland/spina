/* .........................................................................................................

	Plugin.MapIt

	@ 	Create google map via Google Maps API
	@	author Scott Robertson
	@	Updated August 2012

......................................................................................................... */


;(function ( $, window, document, undefined ) {

    var pluginName = 'mapIt';

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
			'id': this.$el.attr('id'),
			'grayscale': this.$el.data('grayscale') || false,
			'zoom': parseInt(this.$el.data('zoom')),
			'x': parseFloat(this.$el.data('lat')),
			'y': parseFloat(this.$el.data('lng')),
			'marker': this.$el.data('marker') || false,
			'icon': this.$el.data('icon') || false,
			'map': null,
			'globalspace': this.$el.data('global') || false,
			'styledMap': null,
			'latLng': null,
			'static_img' : '/assets/images/site/static-map.jpg'
		}
    }

	/* plugin methods
	................................................*/
    Plugin.prototype = {

		/*	initiate -

			description
		..............................................................*/
		init: function () {

			this.drawMap();

			if (this.instance.globalspace) {

				this.addToGlobalSpace();

			}

		},

		/*	draw map -

			description
		..............................................................*/
		drawMap: function() {

			this.instance.latLng = new google.maps.LatLng(this.instance.x, this.instance.y);

			var	myOptions = {
					scrollwheel: false,
					streetViewControl: false,
				 	mapTypeControl: false,
				    center: this.instance.latLng,
				    zoom: this.instance.zoom,
  					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

			this.instance.map = new google.maps.Map(document.getElementById(this.instance.id), myOptions);


			if (this.instance.grayscale) {
				var style = [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ];

				var styledMapOptions = {
			      name: "grayscale"
				}

				this.instance.styledMap = new google.maps.StyledMapType(style, styledMapOptions);

				this.instance.map.mapTypes.set('grayscale', this.instance.styledMap);
				this.instance.map.setMapTypeId('grayscale');
			}

			if (this.instance.marker) {
				this.addMarker();
			}

			if (this.instance.globalspace) {
				SPN.prop.map = {
					instance: this.instance.map,
					x: this.instance.x,
					y: this.instance.y
				}
			}

			this.mapResize();

		},

		/*	add marker -

			description
		..............................................................*/
		addMarker: function() {
			if (this.instance.icon) {

				var image = new google.maps.MarkerImage(this.instance.icon,
				      new google.maps.Size(237, 70),
				      new google.maps.Point(0,0),
				      new google.maps.Point(81.5, 59)
				);

				var marker = new google.maps.Marker({
	      			position: this.instance.latLng,
	      			map: this.instance.map,
	      			icon: image
		  		});

			}

			else {
				var marker = new google.maps.Marker({
					position: this.instance.latLng,
					map: this.instance.map
				});
			}
		},

		/*	mapResize  -

			google maps will not show up properly when hidden inside
			a tab. it must be resized if already loaded.
		..............................................................*/
		mapResize: function() {
			var self = this;
			$(window).on('resize', function() {
				self.adjustMap();
			})

			$('.mapResize').on('click',function() {
				self.adjustMap();
			})

		},

		/*	adjust map  -

			method to adjust the the size and center of the map
		..............................................................*/
		adjustMap: function() {
			var self = this,
			currCenter = new google.maps.LatLng(self.instance.x, self.instance.y);

			google.maps.event.trigger(self.instance.map, 'resize');
			self.instance.map.setCenter(currCenter);
		},


		/*	use static map -

			description
		..............................................................*/
		useStaticMap: function() {
			var map = '<img src="'+this.instance.static_img+'" alt="Map" />';
			this.$el.html(map);
		},

		addToGlobalSpace: function() {
			var self = this;
			SPN.map = self;
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
