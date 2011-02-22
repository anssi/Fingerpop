var stripUrl = "http://www.hs.fi/fingerpori/";

function updateView(url) {
	$.get(url, function(data) {
		parseData(data);
	});
}

function parseData(data) {
	var stripImageSrc = $("#VW_content .strip img", data).attr("src");
	var stripDate = $("#VW_content div p", data).text();
	$("#header").html("Fingerpori " + stripDate);
	updateStripImage(stripImageSrc);
	updateNavigation(data);
}

function updateStripImage(stripImageSrc) {
	$("#strip img").fadeOut(150, function () {
		$(this).remove();
	});
	var stripImage = new Image();
	$(stripImage).load(function () {
		$(this).hide();
		$(this).offset($("#strip").offset());
		$("#strip").height(stripImage.height);
		$("#strip").width(stripImage.width);
		$("#strip").append(this);
		$(this).fadeIn(150);
	})
	.attr("src", stripImageSrc);
}

function updateNavigation(data) {
	var previous = $("#VW_content div.previous a", data).attr("href");
	var next = $("#VW_content div.next a", data).attr("href");
	
	if (previous) {
		$("#nav_prev").show();
		$("#nav_prev").unbind();
		$("#nav_prev").click(function () {
			updateView(previous);
		});
	} else {
		$("#nav_prev").hide();
	}
	
	if (next) {
		$("#nav_next").show();
		$("#nav_next").unbind();
		$("#nav_next").click(function () {
			updateView(next);
		});
	} else {
		$("#nav_next").hide();
	}
}

$(function() {
	$(document).bind('mousedown.disableTextSelect', function() {
		return false;
	});
	$("#strip").click(function() {
		chrome.tabs.create({url: "http://www.hs.fi/fingerpori"});
	});
	updateView(stripUrl);
});