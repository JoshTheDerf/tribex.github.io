createFeed = function() {
	var buildEventsList = function(events) {
		for (var i = 0; i < events.data.length; i++) {
			var eventDiv = build_list_item();
			var textArea = $('<div class="textarea"/>');
			for (property in events.data[i]) {
				var val = events.data[i][property];
				if(typeof val !== 'undefined') {
					if (property == "icon") {
						eventDiv.append('<div class="icon">'+val+'</div>');
					} else if (property == "text") {
						textArea.append("<span class='text'>"+val+"</span>");
					} else if (property == "timeago") {
						textArea.append(val);
					} else if (property == "details") {
						for (var j = 0; j < val.length; j++) {
							textArea.append('<p class="details">'+val[j]+'</p>');
						}
					}
				}
			}
			eventDiv.append(textArea);

			$("#ghEvents").append(eventDiv);
		}
	}
	var gh = new GithubActivityFeed("Tribex");

	gh.events.done(function(events) {
		$("#ghEventsLoader").remove();
		buildEventsList(events);
	});

	gh.events.fail(function(events) {
		console.log(events.data.message);
	});

	function build_list_item() {
		return $("<div class='event'></div>");
	}
}
