var stripUrl = "http://www.hs.fi/fingerpori/";

function updateView(url) {
	$.get(url, function(data) {
		parseData(data)
	});
}

function parseData(data) {
	var stripUrl = $("#VW_content .strip img", data).attr("src");
	var stripDate = $("#VW_content div p", data).text();
	$("#header").html("Fingerpori " + stripDate + getNav(data));
	$("#strip").attr("src", stripUrl);
}

function getNav(data) {
	var nav = "";
	var previous = $("#VW_content div.previous a", data).attr("href");
	var next = $("#VW_content div.next a", data).attr("href");
	
	if (previous) {
		nav = "<img onclick=\"updateView('" + previous + "')\" src=\"img/left.png\" />";
	}
	if (next) {
		nav += "<img onclick=\"updateView('" + next + "')\" src=\"img/right.png\" />";
	}
	return nav;
}

$(function() {
	$("#strip").click(function() {
		chrome.tabs.create({url: "http://www.hs.fi/fingerpori"});
	});
	updateView(stripUrl);
});