(function( $ ){

  Modernizr.load([{
      test: window.JSON,
      nope: 'js/libs/json2.min.js'
    }, {
      test: Modernizr.localstorage,
      nope: 'js/libs/storage.js',
      callback: function() {
      	$(".task")
      		.hashTask({
      			message         : "http://movethewebforward.org",
      			editTweetText   : "(edit this tweet as you wish. ♡)",
      			linkSelector    : function() { return this.find('.pledge') },
      			avatarsSelector : function() { return this.find('.pledges') },
      			hashtag         : function() { return this.data('hashtag') || '#movethewebforward' },
      			searchPrefix    : '(ivegotmybluebeanieonnowwhat.com OR movethewebforward.com OR movethewebforward.org) AND '
      		});
      }
  }]);

		var $toc = $('body div.col-a, body nav'),
			$tocLinks = $toc.find('a[href^="#"]'),
			cache = {};
			$docEl = $( document.documentElement ),
			$body = $( document.body ),
			$window = $( window ),
			$scrollable = $body, // default scrollable thingy, which'll be body or docEl (html)
			$parallax1 = $('.gimmick i:first-child'),
			$parallax2 = $('.gimmick i + i'),
			$bodyheight = $body.height(),
      $bodywidth = $body.width(), 
      $headerwidth = $('.lead').width(),
      $nav = $('#toc');
      
		// find out what the hell to scroll ( html or body )
		// its like we can already tell - spooky
		if ( $docEl.scrollTop() ) {
			$scrollable = $docEl;
		} else {
			var bodyST = $body.scrollTop();
			// if scrolling the body doesn't do anything
			if ( $body.scrollTop( bodyST + 1 ).scrollTop() == bodyST) {
				$scrollable = $docEl;
			} else {
				// we actually scrolled, so, er, undo it
				$body.scrollTop( bodyST - 1 );
			}
		}

		// build cache
		$tocLinks.each(function(i,v) {
			var href =  $( this ).attr( 'href' ),
				$target = $( href );
			if ( $target.length ) {
				cache[ this.href ] = { link: $(v), target: $target };
			}
		});

		// handle nav links
		$toc.delegate( 'a[href^="#"]', 'click', function(e) {
			e.preventDefault(); // if you expected return false, *sigh*
			if ( cache[ this.href ] && cache[ this.href ].target ) {
				$scrollable.animate( { scrollTop: cache[ this.href ].target.position().top }, 600, 'swing' );
			}
		});

    // Set parallax correctly so it aligns to sidebar

    $parallax1.css("right", ($bodywidth - $headerwidth)/2);
    $parallax2.css("right", ($bodywidth - $headerwidth)/2);    
    
		// auto highlight nav links depending on doc position
		var deferred = false,
			timeout = false, // so gonna clear this later, you have NO idea
			last = false, // makes sure the previous link gets un-activated
			check = function() {
				var scroll = $scrollable.scrollTop(),
					height = $body.height(),
					tolerance = $window.height() * ( scroll / height );

				$.each( cache, function( i, v ) {
					// if we're past the link's section, activate it
					if ( scroll + tolerance >  v.target.position().top  ) {
						last && last.removeClass('active');
						last = v.link.addClass('active');
					} else {
						v.link.removeClass('active');
						return false; // get outta this $.each
					}
				});

				// all done
				clearTimeout( timeout );
				deferred = false;
			};

		// work on scroll, but debounced
		var $document = $(document).scroll( function() {
      if($scrollable.scrollTop() > 520) {
        var toc_pos = $toc.position();
        $toc.css('top', toc_pos.top).addClass('sticky').css('top', '0');
      } else {
        $nav.removeClass('sticky');
      }

      $parallax1.css("opacity", 0.2 + ($scrollable.scrollTop() / $bodyheight * 0.6));
      $parallax2.css("opacity", 0.2 + ($scrollable.scrollTop() / $bodyheight * 0.7));

			// timeout hasn't been created yet
			if ( !deferred ) {
				timeout = setTimeout( check , 250 ); // defer this stuff
				deferred = true;
			}

			$oldscrolltop = $scrollable.scrollTop();

		});

		// fix any possible failed scroll events and fix the nav automatically
		(function() {
			$document.scroll();
			setTimeout( arguments.callee, 1500 );
		})();

    $parallax1.scrollingParallax({reverseDirection: true});
    $parallax2.scrollingParallax({reverseDirection: true});

})( jQuery );
