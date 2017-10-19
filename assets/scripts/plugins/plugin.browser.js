/* .........................................................................................................

	jQuery Browser Plugin - http://jquery.thewikies.com/browser/
	
	with additions by Scott Robertson
	@ 	Adds document classes and browser object variables (type and orientation) for mobile, tablet, laptop, and widescreen devices
	@	by ScottusRobus.com
	@	Updated June 2012
	@	Learn more with other wizards at Wigolia.com
		
......................................................................................................... */


;(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.browser.className,$.layout.name,$.layout.className].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);

/* .........................................................................................................
	set defaults
......................................................................................................... */

$.browser.touch = false;
$.browser.mobile = ($(window).width() <= 480) ? true : false;
$.browser.tablet = false;
$.browser.laptop = false;
$.browser.widescreen = false;

/* .........................................................................................................
	use modernizer (class 'touch' added) to see if it's a touch device, test width for Tablet
......................................................................................................... */

if ($('html').hasClass('touch')) { 
	$.browser.touch = true;
	$.browser.tablet = ($(window).width() >= 768 && $(window).width() <= 1024) ? true : false;	
}
else {
	$.browser.laptop = ($(window).width() >= 768 && $(window).width() <= 1500 && $(window).height() <= 600) ? true : false;	
	$.browser.widescreen = ($(window).width() >= 1280) ? true : false;	
}

/* .........................................................................................................
	if mobile or tablet, add class to html element
......................................................................................................... */
	
if ($.browser.mobile) { $('html').addClass('mobile') };
if ($.browser.tablet) { $('html').addClass('tablet') };
if ($.browser.laptop) { $('html').addClass('laptop') };
if ($.browser.widescreen) { $('html').addClass('widescreen'); };

/* .........................................................................................................
	set methods for orientation change
......................................................................................................... */

$.browser.changeOrientation = function changeOrientation() {
	switch(window.orientation) {  
		case -90:
		case 90:
			$('html').addClass('landscape').removeClass('portrait');
			$.browser.orientation = 'landscape';			
		break; 
		default:
			if ($.browser.touch) {
				$.browser.orientation = 'portrait';							
				$('html').addClass('portrait').removeClass('landscape');				
			}
			else {
				$.browser.orientation = 'static';
				$('html').addClass('static');
			}
		break; 
	   }
}

/* .........................................................................................................
	reassign classes on window resize
......................................................................................................... */

$.browser.onResizeScreen = function onResizeScreen() {
	$(window).resize(function() {
		if (!$.browser.touch) {
			$.browser.laptop = ($(window).width() >= 768 && $(window).width() <= 1500 && $(window).height() <= 600) ? true : false;		
			$.browser.widescreen = ($(window).width() >= 1280) ? true : false;
		}

		/* .........................................................................................................
			if laptop or widescreen add class to html element
		......................................................................................................... */
		$.browser.laptop ? $('html').addClass('laptop') : $('html').removeClass('laptop');
		$.browser.widescreen ? $('html').addClass('widescreen') : $('html').removeClass('widescreen');	

	})
}

/* .........................................................................................................
	bind orientation change and check orientation on load
......................................................................................................... */

$.browser.prepDevices = function prepDevices() {
	
	 window.onorientationchange = function() {
		$.browser.changeOrientation();
	 };

 	// Initial execution
	$.browser.changeOrientation();
}


/* .........................................................................................................
	constructor functions
......................................................................................................... */

$.browser.prepDevices();
$.browser.onResizeScreen();