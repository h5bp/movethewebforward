(function( $ ){

  $.getJSON('/avatars.json')
    .success(function(avatars) {
      $.each(avatars, function(hashtag) {
        var avatarsElem = $(".task[data-hashtag=" + hashtag + "] .pledges");
        for (var user in this) {
          var image = $('<img>', { src: this[user], title: user });
          var link = $('<a/>', { href: 'http://twitter.com/' + user });
          avatarsElem.append(link.append(image));
        }
      });
    });

  Modernizr.load([{
      test: window.JSON,
      nope: '/js/libs/json2.min.js',
      complete: function() {
      	$(".task")
      		.hashTask({
      			message         : "http://movethewebforward.org",
      			editTweetText   : "(edit this tweet as you wish. ♡)",
      			linkSelector    : function() { return this.find('.pledge') },
      			hashtag         : function() { return this.data('hashtag') || '#movethewebforward' },
      		});

        if (window.__twitterIntentHandler) return;
        var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
            windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
            width = 550,
            height = 420,
            winHeight = screen.height,
            winWidth = screen.width;

        function handleIntent(e) {
          e = e || window.event;
          var target = e.target || e.srcElement,
              m, left, top;

          while (target && target.nodeName.toLowerCase() !== 'a') {
            target = target.parentNode;
          }

          if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
            m = target.href.match(intentRegex);
            if (m) {
              left = Math.round((winWidth / 2) - (width / 2));
              top = 0;

              if (winHeight > height) {
                top = Math.round((winHeight / 2) - (height / 2));
              }

              window.open(target.href, 'intent', windowOptions + ',width=' + width +
                                                 ',height=' + height + ',left=' + left + ',top=' + top);
              e.returnValue = false;
              e.preventDefault && e.preventDefault();
            }
          }
        }

        if (document.addEventListener) {
          document.addEventListener('click', handleIntent, false);
        } else if (document.attachEvent) {
          document.attachEvent('onclick', handleIntent);
        }
        window.__twitterIntentHandler = true;
      }
  }]);

  (new Image()).src = '/css/img/beanie-webasaurs.gif'

		var $toc = $('#toc'),
		  $inlinelinks = $('body div.col-a'),
			$tocLinks = $toc.find('a[href^="#"]'),
			$bodyinlinelinks = $inlinelinks.find('a[href^="#"]'),
			cache = {}, cacheinline = {};
			$docEl = $( document.documentElement ),
			$body = $( document.body ),
			$window = $( window ),
			$scrollable = $body, // default scrollable thingy, which'll be body or docEl (html)
			$parallax1 = $('.gimmick i:first-child'),
			$parallax2 = $('.gimmick i:nth-child(2)'),
			$parallax3 = $('.gimmick i:last-child'),
			$bodyheight = $body.height(),
      $bodywidth = $body.width(),
      $headerwidth = $('.lead').width(),
      $nav = $('#toc'),
      $originalnavtop = $nav.position().top;
			$navheight = $nav.outerHeight(true);
			$('#nav_container').height($navheight);

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

		//build inline cache
		$bodyinlinelinks.each(function(i,v) {
			var href =  $( this ).attr( 'href' ),
				$target = $( href );
			if ( $target.length ) {
				cacheinline[ this.href ] = { link: $(v), target: $target };
			}
		});

		// handle nav links
		$toc.delegate( 'a[href^="#"]', 'click', function(e) {
			e.preventDefault(); // if you expected return false, *sigh*
			if ( cache[ this.href ] && cache[ this.href ].target ) {
				$scrollable.animate( { scrollTop: cache[ this.href ].target.position().top }, 600, 'swing' );
			}
		});

		//handle inline links
		$inlinelinks.delegate( 'a[href^="#"]', 'click', function(e) {
			e.preventDefault(); // if you expected return false, *sigh*
			if ( cacheinline[ this.href ] && cacheinline[ this.href ].target ) {
				$scrollable.animate( { scrollTop: cacheinline[ this.href ].target.offset().top - $navheight }, 600, 'swing' );
			}
		});

    // Set parallax correctly so it aligns to sidebar

    $parallax1.css("right", ($bodywidth - $headerwidth)/2);
    $parallax2.css("right", ($bodywidth - $headerwidth)/2);
    $parallax3.css("right", ($bodywidth - $headerwidth)/2);

		// auto highlight nav links depending on doc position
		var deferred = false,
			timeout = false, // so gonna clear this later, you have NO idea
			last = false, // makes sure the previous link gets un-activated
			check = function() {
				var scroll = $scrollable.scrollTop();

				$.each( cache, function( i, v ) {
					// if we're past the link's section, activate it
					if ( scroll + $navheight >  v.target.position().top  ) {
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

      if($scrollable.scrollTop() > ($originalnavtop - 20)) {
        $nav.addClass('sticky').css('top', '0');
      } else {
        $nav.removeClass('sticky');
      }

      $parallax1.css("opacity", 0.2 + ($scrollable.scrollTop() / $bodyheight * 0.6));
      $parallax2.css("opacity", 0.2 + ($scrollable.scrollTop() / $bodyheight * 0.7));
      $parallax3.css("opacity", 0.2 + ($scrollable.scrollTop() / $bodyheight * 0.4));
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

    $parallax1.scrollingParallax({staticSpeed: 0.12, reverseDirection: true});
    $parallax2.scrollingParallax({staticSpeed: 0.1, reverseDirection: true});
    $parallax3.scrollingParallax({staticSpeed: 0.1, reverseDirection: true});

})( jQuery );
