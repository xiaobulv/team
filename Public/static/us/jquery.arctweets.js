/*
The MIT License

Copyright (c) 2009 Arc90

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($) {
	$.fn.tweet = function(o){
		var s = {
			username: ["arc90"],	// [string]	Can be a string, or an array, just do ["username1","username2","etc"]
			count: 10,				// [integer] how many tweets to display?
			loading_text: null,		// [string]	optional loading text, displayed while tweets load.
			proxy_url: '/tweetscache.php?tweetUri='
		};

		$.fn.extend({
			linkUrl: function() {
				var returning = [];
				var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
				this.each(function() {
					returning.push(this.replace(regexp,"<a href=\"$1\">$1</a>"));
				});
				return $(returning);
			},
			linkUser: function() {
				var returning = [];
				var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
				this.each(function() {
					returning.push(this.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>"));
				});
				return $(returning);
			},
			linkHash: function() {
				var returning = [];
				var regexp = / [\#]+([A-Za-z0-9-_]+)/gi;
				this.each(function() {
					returning.push(this.replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all&from='+s.username.join("%2BOR%2B")+'">#$1</a>'));
				});
				return $(returning);
			}
		});

		function relative_time(time_value) {
			if(time_value.match(/20[\d]+$/)) {
				time_value = time_value.replace(/^(\w+) (\w+) (\d+) ([0-9:]+) ([0-9\+]+) (\d+)$/,'$1 $2 $3 $6 $4 $5');
			}
			var parsed_date = Date.parse(time_value);
			var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
			var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
			if(delta < 60) { return 'less than a minute ago'; }
			else if(delta < 120) { return 'about a minute ago'; }
			else if(delta < (45*60)) { return (parseInt(delta / 60, 10)).toString() + ' minutes ago'; }
			else if(delta < (90*60)) { return 'about an hour ago'; }
			else if(delta < (24*60*60)) { return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago'; }
			else if(delta < (48*60*60)) { return '1 day ago'; }
			else { return (parseInt(delta / 86400, 10)).toString() + ' days ago'; }
		}

		if (o) { $.extend(s, o); }
		return this.each(function(){
			var list = $(this);
			var loading = $('<li class="loading"><p>'+s.loading_text+'</p></li>');
			if (typeof(s.username) === "string") {
			    s.username = [s.username];
			}
			var url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + s.username + '&count=' + s.count;
			if(typeof(s.proxy_url) !== "undefined") {
				url = s.proxy_url + encodeURIComponent(url);
			}

			if (s.loading_text) { $(this).append(loading); }
			$.ajax({
				type: "GET",
				url: url,
				dataType: "jsonp",
				cache: false,
				error: function(xhr,status,error) {
					list.html('<li class="error"><p>Sorry, but we&#39;re unable to retrieve tweets from Arc90 at this time.</p></li>');
				},
				success: function(data,status) {
					if (s.loading_text) { loading.remove(); }
					var items       = 0,
					    itemsLength = data.length;

					for (items; items < itemsLength; items++) {
						var item = data[items];
						var date = '<a href="http://twitter.com/'+item.user.screen_name+'/statuses/'+item.id+'" title="View tweet on twitter">'+relative_time(item.created_at)+'</a>';
						var text = '<span class="tweet_text">' +$([item.text]).linkUrl().linkUser().linkHash()[0]+ '</span>';
						list.append('<li><p>' + text + '</p><p class="from">' + date + '</p></li>');
					}

					// Hook in cycle plugin for fancy display:
					list.cycle({
						fx: 'scrollLeft',
						timeout: 8000,
						speed: 750,
						pause: 1
					});
				}
			});
		});
	}; // End $.fn.tweet
})(jQuery);