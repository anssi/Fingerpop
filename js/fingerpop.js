var stripUrl = "http://www.hs.fi/fingerpori";
var animationSpeed = 100;

function updateView(url) {
	$("#strip").addClass("loading");
	$("#strip img").fadeOut(animationSpeed, function () {
		$(this).remove();
	});
	var jqxhr = $.get(url, function(data) {
		parseData(data);
	})
	.error(function () { $("#header").text("Error loading Fingerpori!"); });
}

function parseData(data) {
	var stripImageSrc = $("#VW_content .strip img", data).attr("src");
	var stripDate = $("#VW_content div p", data).text();
	$("#header").html("Fingerpori " + stripDate);
	updateStripImage(stripImageSrc);
	updateNavigation(data);
}

function updateStripImage(stripImageSrc) {
	var stripImage = new Image();
	$(stripImage).load(function () {
		$("#strip").removeClass("loading");
		$(this).hide();
		$(this).offset($("#strip").offset());
		$("#strip").animate({
			width: stripImage.width + "px",
			height: stripImage.height + "px"
		}, 100, function () {
			$("#strip").append(stripImage);
			$(stripImage).fadeIn(animationSpeed);
		});
	})
	.attr("src", stripImageSrc)
	;
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
	setTimeout("updateView(stripUrl);", 1);
});