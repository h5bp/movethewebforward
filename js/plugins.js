(function(global, doc, $) {

  $.fn.hashTask = function(o) {

    var defaults = {
      hashtag: undefined,
      message: 'oh yeah!',
      linkSelector: 'a',
      avatarsSelector: 'div'
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

      // The hashtag used to pre-fill twitter and to search twitter
      // for users.
      var hashtag = $.isFunction(options.hashtag)
            ? options.hashtag.call($elem)
            : $elem.data('hashtag');

      // A message to add to the hash tag.
      var message = $.isFunction(options.message)
            ? options.message.call($elem)
            : options.message;

      // A URL that will pre-fill a twitter status message.
      var prefillUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(hashtag + ' ' + message);

      // Twitter search URL.
      var searchUrl = 'http://search.twitter.com/search.json?callback=?&q=';

      linkElem.attr('href', prefillUrl);

      if (hashtag) {
        $.getJSON(searchUrl + encodeURIComponent(hashtag), function(json) {
          // De-dupe.
          var users = {};

          $.each(json.results, function(i) {
            if (this.from_user in users) {
              return;
            }

            var image = $('<img>', {
              src: this.profile_image_url,
              title: this.from_user
            }),
            link = $('<a/>', {
            	href: 'http://twitter.com/' + this.from_user
            });

            avatarsElem.append( link.append( image ) );

            users[this.from_user] = true;
          });

          twttr.anywhere(function(T) {
            T('img', avatarsElem).hovercards({
              username: function(node) {
                return node.title
              }
            });
          });
        });
      }

    });
  };

})(window, document, jQuery);

