(function(win, undefined){
	
	var doc 		 = win.document,
		docElem 	 = doc.documentElement,
		head		 = doc.head || doc.getElementsByTagName( "head" )[0] || docElem,
		Modernizr	 = win.Modernizr;
			
	// Supportin’ stuff.
	md = {
		mobileBreakpoint : window.screen.width >= 480,
		devMode : {
			mobileAssets : !!~location.search.indexOf("mobile"),
			basicAssets	 : !!~location.search.indexOf("basic")
		},
		enhanced		 : Modernizr.mq || /shitty/.test(document.documentElement.className)
	};

	// If we’re emulating non-MQ browsers for development purposes:
	if( md.devMode.basicAssets ) {
		head.removeChild( doc.getElementById( "enhanced-css" ) );
		head.removeChild( doc.getElementById( "reset-css" ) );
		return;
	}

	// Non-MQ browser, or in “mobile” preview mode? Exit here:
	if( !md.enhanced || md.devMode.mobileAssets ) { 
		return;
	}

	// If we’ve made it this far, we’re enhanced. Add a class to style against.
	docElem.className += " enhanced";

	// Add a class for “homescreen mode”:
	if ( win.navigator.standalone ) {
		docElem.className += " standalone";	
	}

	// Callback for body-dependent scripts:
	md.bodyready = (function(){

		var callbackStack 	= [],
			checkRun		= function( callback ){

				if( callback ){
					callbackStack.push( callback );
				}

				if( doc.body ){
					while( callbackStack[0] && typeof( callbackStack[0] ) === "function" ){
						callbackStack.shift().call( win );
					}
				}
				else{
					setTimeout(checkRun, 15); 
				}
			};
			return checkRun;
	})();

	// Loading functions available on md.load:
	md.load = {};

	// Define md.load.style:
	md.load.style = function( href, media ){

		if( !href ){ return; }

		var lk			= doc.createElement( "link" ),
			links		= head.getElementsByTagName("link"),
			lastlink	= links[links.length-1];
			lk.type 	= "text/css";
			lk.href 	= href;
			lk.rel		= "stylesheet";
			if( media ){
				lk.media = media;
			}

			//if respond.js is present, be sure to update its media queries cache once this stylesheet loads
			//IE should have no problems with the load event on links, unlike other browsers
			if( "respond" in window ){
				lk.onload = respond.update;
			}

			//might need to wait until DOMReady in IE...
			if( lastlink.nextSibling ){
				head.insertBefore(lk, lastlink.nextSibling );
			} else {
				head.appendChild( lk );
			}
	};

	// Non-MQ browser, or in one of the two development modes? Exit here:
	if( !md.enhanced || md.devMode.mobileAssets || md.devMode.basicAssets ) { 
		return;
	}
	Modernizr.load([
    {
      test: md.enhanced,
      yep: [
        'js/libs/storage.js',
        'js/libs/jquery.min.js',
        'js/plugins.js',
        'js/init.js'
      ]
    },
    { 
        test: md.mobileBreakpoint,
        yep: 'js/libs/fittext.js'
    }
    ]);
		
	// Wait for body to be ready for the rest, so we can check the body class and load accordingly:
	md.bodyready(function(){

		// Load custom fonts above:
		if( md.mobileBreakpoint && !md.devMode.mobileAssets ){	
			md.load.style( 'css/fonts.css' );		
			// Remove no-fontface class, for fallback font styling:
			docElem.className = docElem.className.replace(/\bno-fontface\b/,'');
		}

	});
	
	// WebReflection Solution for ensuring domready fires when dynamically appending jQuery in older browsers
	(function(h,a,c,k){if(h[a]==null&&h[c]){h[a]="loading";h[c](k,c=function(){h[a]="complete";h.removeEventListener(k,c,!1)},!1)}})(document,"readyState","addEventListener","DOMContentLoaded");

})(this);
