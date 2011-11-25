
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

  $.fn.taskThinger = function(o) {

    var defaults = {
      hashtag: undefined,
      message: 'oh yeah!'
    };

    var options = $.extend({}, defaults, o);

    this.each(function() {
      var $elem = $(this),
          hashtag = options.hashtag || $elem.data('hashtag'),
          message = options.message || ''

      if (!hashtag)
        return

      var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(hashtag + ' ' + message),
          link = $('<a>').attr('href', url)

      $elem.append(link)



    });

  };

})(window, document, jQuery);

