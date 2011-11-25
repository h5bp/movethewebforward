
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

(function(global, doc, $) {

  $.fn.hashTask = function(o) {

    var defaults = {
      hashtag: undefined,
      message: 'oh yeah!',
      linkSelector: 'a',
      avatarsSelector: 'div'
    }

    var options = $.extend({}, defaults, o)

    this.each(function() {
      var $elem = $(this),
          linkElem = $.isFunction(options.linkSelector)
            ? options.linkSelector.call($elem)
            : $elem.find(options.linkSelector),
          avatarsElem = $.isFunction(options.avatarsSelector)
            ? options.avatarsSelector.call($elem)
            : $elem.find(options.avatarsSelector),
          hashtag = $.isFunction(hashtag)
            ? hashtag.call($elem)
            : $elem.data('hashtag'),
          message = $.isFunction(message)
            ? message.call($elem)
            : options.message

      var prefillUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(hashtag + ' ' + message),
          searchUrl = 'http://search.twitter.com/search.json?callback=?&q='

      $elem.append(linkElem.attr('href', prefillUrl))

      if (hashtag) {
        $.getJSON(searchUrl + encodeURIComponent(hashtag), function(json) {
          $.each(json.results, function(i) {
            avatarsElem.append($('<img>').attr({src: this.profile_image_url, title: this.from_user}))
          });

          twttr.anywhere(function(T) {
            T('img', avatarsElem).hovercards({
              username: function(node) { return node.title }
            })
          })
        });
      }

    });
  };

})(window, document, jQuery);

