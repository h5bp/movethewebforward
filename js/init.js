(function( $ ){
	var tweet = "This is the tweet.";

	$(".task")
		.append('<a href="http://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet) + '" class="pledge">Yes, I want to do this.</a><p>Here are some developers who want to do this too:</p><div class="pledges"></div>')
		.hashTask({
			message         : tweet,
			linkSelector    : function() { return this.find('.pledge') },
			avatarsSelector : function() { return this.find('.pledges') },
			hashtag         : function() { return this.data('hashtag') || '#igotmybeanie' },
			searchPrefix    : '(ivegotmybluebeanieonnowwhat.com OR movethewebforward.com) AND '
		});

})( jQuery );
