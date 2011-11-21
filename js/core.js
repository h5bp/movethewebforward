// Define some general-purpose stuff:
(function(win, undefined){
	
	//define some globals
	var doc				 = win.document,
		docElem			 = doc.documentElement,
		head 			 = doc.head || doc.getElementsByTagName( "head" )[0] || docElem;
			
	// Supportin’ stuff.
	md = {
		screenWidth 	 : window.screen.width,
		mobileBreakpoint : window.screen.width >= 480,
		browser : {
			ie6			 : !!~docElem.className.indexOf( "ie6" ),
			ie7			 : !!~docElem.className.indexOf( "ie7" ),
			ie8			 : !!~docElem.className.indexOf( "ie8" )	
		},
		devMode : {
			mobileAssets : !!~location.search.indexOf("mobile"),
			basicAssets	 : !!~location.search.indexOf("basic")
		},
		enhanced		 : respond.mediaQueriesSupported || md.browser.ie6 || md.browser.ie7 || md.browser.ie8
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
	
	//define md.load.style
	md.load.script = function( src ){
		if( !src ){ return; }
		var script		= doc.createElement( "script" ),
			fc			= head.firstChild;
			script.src 	= src;

			//might need to wait until DOMReady in IE...
			if( fc ){
				head.insertBefore(script, fc );
			} else {
				head.appendChild( script );
			}
	};

})(this);
