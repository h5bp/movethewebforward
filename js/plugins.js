(function(global, doc, $) {

  $.fn.hashTask = function(o) {

    var defaults = {
      hashtag: undefined,
      message: 'oh yeah!',
      linkSelector: 'a',
      avatarsSelector: 'div',
      searchPrefix: '',
      editTweetText: "(edit this tweet as you wish. ♡)"
    };

    var options = $.extend({}, defaults, o);

    Modernizr.load([
      {
        test: window.JSON,
        nope: 'js/libs/json2.min.js'
      },
      {
        test: Modernizr.localstorage,
        nope: 'js/libs/storage.js'
      }
    ]);

    function cacheSet(key, value, expires) {
      window.localStorage.setItem(key, JSON.stringify(value));
      if (expires) {
        window.localStorage.setItem(key + '__expires', expires);
      }
    }

    function cacheGet(key) {
      var value = window.localStorage.getItem(key);
      var expires = window.localStorage.getItem(key + '__expires');
      if (expires && (+new Date) > expires) {
        return undefined;
      }
      return JSON.parse(value);
    }

    function cacheDel(key) {
      window.localStorage.removeItem(key);
      window.localStorage.removeItem(key + '__expires');
    }

    function twitterSearch(query, callback) {
      if (options.searchPrefix) {
        query = options.searchPrefix + query;
      }

      var searchUrl = 'http://search.twitter.com/search.json?rpp=100&callback=?&q=';
      var results = cacheGet(query);
      if (results) {
        callback(results);
      }
      else {
        $.getJSON(searchUrl + encodeURIComponent(query), function(json) {
          cacheSet(query, json, (+new Date) + 1000 * 60 * 60)
          callback(json);
        });
      }
    }

    return this.each(function() {
      var $elem = $(this);

      // The element that will become a twitter pre-fill link.
      var linkElem = $.isFunction(options.linkSelector)
            ? options.linkSelector.call($elem)
            : $elem.find(options.linkSelector);

      // The element that will have user avatars appended to it.
      var avatarsElem = $.isFunction(options.avatarsSelector)
            ? options.avatarsSelector.call($elem)
            : $elem.find(options.avatarsSelector);

      // The hashtag used to pre-fill twitter and to search twitter for users.
      var hashtag = $.isFunction(options.hashtag)
            ? options.hashtag.call($elem)
            : $elem.data('hashtag');

      // A message to add to the hash tag.
      var message = $.isFunction(options.message)
            ? options.message.call($elem)
            : options.message;

      // A message to edit the tweet.
       var editTweetText = $.isFunction(options.editTweetText)
            ? options.editTweetText.call($elem)
            : options.editTweetText;

      // A URL that will pre-fill a twitter status message.
      var prefillUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(message + ' ' + hashtag + ' ' + editTweetText);

      linkElem.attr('href', prefillUrl).click(function() {
        cacheDel(hashtag);
      });

      if (hashtag) {
        twitterSearch(hashtag, function(json) {
          // De-dupe.
          var users = {};

          $.each(json.results, function(i) {
            if (this.from_user in users) {
              return;
            }

            var image = $('<img>', {
              src: this.profile_image_url,
              title: this.from_user
            });

            var link = $('<a/>', {
            	href: 'http://twitter.com/' + this.from_user
            });

            avatarsElem.append( link.append( image ) );

            users[this.from_user] = true;
          });

          if (json.results.length) {
            avatarsElem.find('p').show();
          }
        });
      }

    });
  };

})(window, document, jQuery);

/**
 * jQuery Scrolling Parallax v0.1
 * http://jonraasch.com/blog/scrolling-parallax-jquery-plugin
 *
 * Copyright (c) 2009 Jon Raasch (http://jonraasch.com/)
 * Licensed under the FreeBSD License (See terms below)
 *
 * @author Jon Raasch
 *
 * @projectDescription    jQuery plugin to create a parallax effect when the page is scrolled.
 *
 * @version 0.1.0
 *
 * @requires jquery.js (v 1.3.2 minimum)
 *
 *
 * TERMS OF USE - jQuery Scrolling Parallax
 * Open source under the FreeBSD License.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY JON RAASCH ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JON RAASCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the authors and should not be interpreted as representing official policies, either expressed or implied, of Jon Raasch, who is the man.
 *
 *
 * FOR USAGE INSTRUCTIONS SEE THE DOCUMENATION AT: http://dev.jonraasch.com/scrolling-parallax/documentation
 *
 *
 */


( function( $ ) {

    $.scrollingParallax = function ( box, options )
    {
        var options = options || {};

        // vertical options

        options.enableVertical = typeof( options.enableVertical ) != 'undefined' ? options.enableVertical : true;

        if ( options.enableVertical ) {
            options.staticSpeed = options.staticSpeed || false;
            options.staticScrollLimit = typeof(options.staticScrollLimit) != 'undefined' ? options.staticScrollLimit : true;

            options.loopIt = options.loopIt || false;

            options.reverseDirection = options.reverseDirection || false;
        }

        // horizontal options

        options.enableHorizontal = options.enableHorizontal || false;

        if ( options.enableHorizontal ) {
            options.staticSpeedX = options.staticSpeedX || false;
            options.staticScrollLimitX = typeof(options.staticScrollLimitX) != 'undefined' ? options.staticScrollLimitX : true;

            options.loopItX = options.loopItX || false;

            options.reverseDirectionX = options.reverseDirectionX || false;
        }

        // IE6 options

        options.disableIE6 = options.disableIE6 || false; // disables in IE6 altogether
        options.disableIE6Anim = typeof(options.disableIE6Anim) != 'undefined' ? options.disableIE6Anim : true; // disables IE6 animation, however background will still append

        // layout options

        options.bgWidth = options.bgWidth || (options.enableHorizontal ? '150%' : '100%' );
        options.bgHeight = options.bgHeight || '150%';

        options.bgRepeat = options.bgRepeat || false;

        options.appendInFront = options.appendInFront || false;

        options.parallaxHeight = options.parallaxHeight || false;
        options.parallaxWidth = options.parallaxWidth || false;


        var isIE6 = $.browser.msie && $.browser.version < 7 ? true : false;

        if ( options.disableIE6 && isIE6 ) return false;

        var $document = $(document);
        var $window   = $(window);
        var $box;

        var backgroundMode = false;

        if ( options.enableVertical ) {
            var boxHeight;
            var windowHeight;
            var docHeight;
            var parallaxRoom;
            var maxIE6Move = 0;
            var loopCount = 0;
            var startingPos = 0;
            var tooSmallMode = false;
            var oldMoveIt = null;
        }

        if ( options.enableHorizontal ) {
            var boxWidth;
            var windowWidth;
            var docWidth;
            var parallaxRoomX;
            var maxIE6MoveX = 0;
            var loopCountX = 0;
            var startingPosX = 0;
            var tooSmallModeX = false;
            var oldMoveItX = null;
        }

        init( box );



        // init( obj/string box )   :  sets up the parallax and associated events

        function init( box ) {
            // if string append image as background, otherwise define as jQuery object
            if ( typeof( box ) == 'string' ) $box = appendBackground( box );
            else {
                $box = $( box );

                $box.css('position', isIE6 ? 'absolute' : 'fixed');

                if ( options.enableVertical ) startingPos = parseInt( $box.css('top') );

                if ( options.enableHorizontal ) startingPosX = parseInt( $box.css('left') );
            }

            if ( options.disableIE6Anim && isIE6 ) return false;

            defineSizes();

            // if in background mode, and reverseDirection, then attch the background to the opposite end to maximize scrolling room
            if ( backgroundMode ) {
                if ( options.reverseDirection && options.enableVertical ) {
                    startingPos += -1 * parallaxRoom;
                    $box.css('top', startingPos);
                }

                if ( options.reverseDirectionX && options.enableHorizontal ) {
                    startingPosX += -1 * parallaxRoomX;
                    $box.css('left', startingPosX);
                }
            }

            // attach scroll and resize events

            $window.scroll( function() {
                ani();
            });

            $window.resize( function() {
                defineSizes();
            });
        }




        // appendBackground( string theSrc )  :   appends an image to the page as a stretched background

        function appendBackground( theSrc ) {
            var bgCss = {
                display:   'block',
                top:       0,
                left:      0,
                width:     options.bgWidth,
                height:    options.bgHeight,
                zIndex:    0
            };

            bgCss.position = isIE6 ? 'absolute' : 'fixed';

            if ( options.bgRepeat ) {
                var $obj = options.appendInFront ? $('<div></div>').appendTo( $('body') ) : $('<div></div>').prependTo( $('body') );
                bgCss.backgroundRepeat = 'repeat';
                bgCss.backgroundImage  = 'url("' + theSrc + '")';
            }
            else {
                var $obj = options.appendInFront ? $('<img />').appendTo( $('body') ) : $('<img />').prependTo( $('body') );
                $obj.attr('src', theSrc);
            }


            $obj.css( bgCss );

            backgroundMode = true;

            return $obj;
        }




        // defineSizes()  :  sets up various constants used by the app - must be set on page load and on screen resize

        function defineSizes() {

            // define vertical vars

            if ( options.enableVertical ) {
                boxHeight = $box.height();
                windowHeight = $window.height();
                docHeight = $document.height();

                parallaxRoom = ( options.parallaxHeight || boxHeight ) - windowHeight;

                // if parallax object is smaller than window size
                if ( parallaxRoom < 0 ) {
                    if ( options.staticSpeed ) parallaxRoom = windowHeight -  boxHeight;
                    else parallaxRoom = options.reverseDirection ? windowHeight - startingPos - boxHeight : startingPos;

                    tooSmallMode = true;
                }

                if ( isIE6 && !maxIE6Move ) maxIE6Move =  -1 * ( docHeight - boxHeight );

                if ( options.loopIt ) loopCount = parseInt( $document.scrollTop() / ( tooSmallMode ? windowHeight : boxHeight ) );
            }

            // define horizontal vars

            if ( options.enableHorizontal ) {
                boxWidth = $box.width();
                windowWidth = $window.width();
                docWidth = $document.width();

                parallaxRoomX = ( options.parallaxWidth || boxWidth ) - windowWidth;

                // if parallax object is smaller than window size
                if ( parallaxRoomX < 0 ) {
                    parallaxRoomX = options.staticSpeedX ? windowWidth - boxWidth : options.reverseDirectionX ? windowWidth - startingPosX - boxWidth : startingPosX;

                    tooSmallModeX = true;
                }

                if ( isIE6 && !maxIE6MoveX ) maxIE6MoveX =  -1 * ( docWidth - boxWidth );

                if ( options.loopItX ) loopCountX = parseInt( $document.scrollLeft() / ( tooSmallModeX ? windowWidth : boxWidth ) );
            }

            // make any changes
            ani();
        }



        // ani()  :  performs the animation of the object

        function ani() {

            // dont let multiple animations queue up
            $box.queue( [ ] );

            var theCss = {};


            // vertical
            if ( options.enableVertical ) {

                var moveIt = calculateMove(true);

                theCss.top = moveIt;
            }


            // horizontal
            if ( options.enableHorizontal ) {

                var moveItX = calculateMove(false);

                theCss.left = moveItX;
            }

            // if large move animate in FF, safari and opera for smoother transition
            if ( !$.browser.msie && ( Math.abs( oldMoveIt - moveIt ) > 100 || Math.abs( oldMoveItX - moveItX ) > 100 ) ) $box.animate(theCss, 30);
            else $box.css(theCss);

            oldMoveIt = moveIt;
            oldMoveItX = moveItX;

        }



        // calculateMove( boolean vertical ) : determines amount to move whether vertically or horizontally

        function calculateMove( vertical ) {
            // establish variables, this is basically a switch between vertical and horizontal modes
            if ( vertical ) {
                var offset =  $document.scrollTop();
                var docSize = docHeight;
                var windowSize = windowHeight;
                var boxSize = boxHeight;

                var parallaxRoom2 = parallaxRoom;

                var loopCount2 = loopCount;
                var startingPos2 = startingPos;
                var parallaxRoom2 = parallaxRoom;
                var tooSmallMode2 = tooSmallMode;
                var maxIE6Move2 = maxIE6Move;

                var opts = {
                    reverseDirection : options.reverseDirection,
                    staticSpeed : options.staticSpeed,
                    loopIt : options.loopIt,
                    staticScrollLimit : options.staticScrollLimit
                }
            }
            else {
                var offset = $document.scrollLeft();
                var docSize = docWidth;
                var windowSize = windowWidth;
                var boxSize = boxWidth;

                var loopCount2 = loopCountX;
                var startingPos2 = startingPosX;
                var parallaxRoom2 = parallaxRoomX;
                var tooSmallMode2 = tooSmallModeX;
                var maxIE6Move2 = maxIE6MoveX;

                var opts = {
                    reverseDirection : options.reverseDirectionX,
                    staticSpeed : options.staticSpeedX,
                    loopIt : options.loopItX,
                    staticScrollLimit : options.staticScrollLimitX
                }
            }

            /*** get move amount - static speed ***/

            if ( opts.staticSpeed ) {
                var move = offset * opts.staticSpeed;

                // account for number of loops
                move -= parallaxRoom2 * ( loopCount2 );
            }

            /*** get move amount - auto speed ***/

            else {
                // determine percentage of page that has been scrolled down
                var offsetPercent = offset / ( docSize - windowSize );

                /*
                var moveIt = ( $.browser.msie && $.browser.version < 7 )
                    ? -1 * ( offsetParent * parallaxRoom + offsetTop )
                    : -1 * offsetPercent * parallaxRoom;
                */

                var move = offsetPercent * parallaxRoom2;
            }

            // reverse direction
            if ( !opts.reverseDirection ) move *= -1;

            // incorporate starting position
            move += startingPos2;

            // if static speed set, make sure move is within bounds
            if ( opts.staticSpeed ) move = checkMove( move, vertical, opts, parallaxRoom2, tooSmallMode2 );


            // if in tooSmallMode and looping, add difference of window height and box height, since the box needs to be conceptualized as that much taller ( otherwise it would loop in place rather than over the screen )
            if ( tooSmallMode2 && opts.staticSpeed && opts.loopIt ) move += windowSize - boxSize;

            if ( isIE6 ) {
                // IE6 fix for fixed positioning
                move += offset;
                move = Math.max( parseInt(move), parseInt(maxIE6Move2) );
            }

            return move;
        }



        // checkMove( int moveIt )  :  checks to ensure that move amount does not exceed established bounds

        function checkMove( move, vertical, opts, parallaxRoom, tooSmallMode ) {

            // if overflow limited
            if ( !opts.loopIt ) {
                if ( opts.staticScrollLimit ){
                    if ( tooSmallMode ) {
                        if ( move < 0 ) move = 0;
                        if ( move > parallaxRoom ) move = parallaxRoom;
                    }
                    else {
                        if ( move > 0 ) move = 0;
                        if ( -1 * move > parallaxRoom ) move = -1 * parallaxRoom;
                    }
                }
            }

            // if overflow loops
            else {
                while ( move < parallaxRoom ) {
                    move += parallaxRoom;

                    var loopCountChange = opts.reverseDirection ? -1 : 1;

                    if ( vertical ) loopCount += loopCountChange;
                    else loopCountX += loopCountChange;
                }

                while ( move > ( opts.reverseDirection ? -1 : 0 ) ) {
                    move -= parallaxRoom;

                    var loopCountChange = opts.reverseDirection ? -1 : 1;

                    if ( vertical ) loopCount -= loopCountChange;
                    else loopCountX -= loopCountChange;
                }
            }

            return move;
        }
    };

    $.fn.scrollingParallax = function ( options )
    {

        this.each( function()
            {
                new $.scrollingParallax( this, options );
            }
        );

        return this;
    };
})( jQuery );
