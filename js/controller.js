(function(win, undefined){
	
	var doc 		 = win.document,
		docElem 	 = doc.documentElement,
		head		 = doc.head || doc.getElementsByTagName( "head" )[0] || docElem,
		Modernizr	 = win.Modernizr,
		md			 = win.md;

	// Non-MQ browser, or in one of the two development modes? Exit here:
	if( !md.enhanced || md.devMode.mobileAssets || md.devMode.basicAssets ) { 
		return;
	}

	// Define scripts and styles for conditional loading:
	md.assets = {
		js: {
			fitText  : "js/libs/fittext.js"
		},
		css: {
			fonts 	 : "css/fonts.css"
		}
	};

		
	var jsToLoad = [
		/* md.assets.js.init */
	],
	cssToLoad = [];
		
	// Wait for body to be ready for the rest, so we can check the body class and load accordingly:
	md.bodyready(function(){

		// Load custom fonts above:
		if( md.mobileBreakpoint && !md.devMode.mobileAssets ){
			
			jsToLoad.push( md.assets.js.fitText );
			
			cssToLoad.push( md.assets.css.fonts );
			// Remove no-fontface class, for fallback font styling:
			docElem.className = docElem.className.replace(/\bno-fontface\b/,'');
		}

		// Load enhanced assets:
		md.load.script( jsToLoad.join(",") );

		if( cssToLoad.length ){
			md.load.style( cssToLoad.join(",") );
		}
		
		// Advanced support 
		md.support = {
			touch		 : Modernizr.touch,
			websockets	 : Modernizr.websockets
		};
		
		// If it's a device that supports touch...
		if( md.support.touch ) {
			jsToLoad.push(md.assets.js.touch);
		}

	});
	
	// WebReflection Solution for ensuring domready fires when dynamically appending jQuery in older browsers
	(function(h,a,c,k){if(h[a]==null&&h[c]){h[a]="loading";h[c](k,c=function(){h[a]="complete";h.removeEventListener(k,c,!1)},!1)}})(document,"readyState","addEventListener","DOMContentLoaded");

})(this);