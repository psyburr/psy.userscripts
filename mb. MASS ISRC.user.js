// ==UserScript==
// @name         mb. MASS ISRC
// @version      2022.2.8
// @description  kepstin’s magicisrc. Paste a bunch of ISRC instead of one by one
// @compatible   vivaldi(2.9.1705.41)+violentmonkey  my setup (office)
// @compatible   vivaldi(1.0.435.46)+violentmonkey   my setup (home, xp)
// @compatible   firefox(64.0)+greasemonkey          tested sometimes
// @compatible   chrome+violentmonkey                should be same as vivaldi
// @namespace    https://github.com/jesus2099/konami-command
// @author       jesus2099
// @licence      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @licence      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @since        2012-10-26; https://web.archive.org/web/20131104205639/userscripts.org/scripts/show/151040 / https://web.archive.org/web/20141011084005/userscripts-mirror.org/scripts/show/151040
// @icon         data:image/gif;base64,R0lGODlhEAAQAKEDAP+/3/9/vwAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/glqZXN1czIwOTkAIfkEAQACAwAsAAAAABAAEAAAAkCcL5nHlgFiWE3AiMFkNnvBed42CCJgmlsnplhyonIEZ8ElQY8U66X+oZF2ogkIYcFpKI6b4uls3pyKqfGJzRYAACH5BAEIAAMALAgABQAFAAMAAAIFhI8ioAUAIfkEAQgAAwAsCAAGAAUAAgAAAgSEDHgFADs=
// @grant        none
// @match        *://magicisrc.kepstin.ca/*
// @include      /^https?:\/\/(\w+\.)?musicbrainz\.org\/release\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
// @run-at       document-end
// ==/UserScript==
"use strict";
if (location.host === "magicisrc.kepstin.ca") {
	document.addEventListener("input", function(event) {
		if (event && event.target && event.target.classList.contains("form-control") && event.target.getAttribute("id").match(/^isrc\d+-\d+$/)) {
			var isrcList = event.target.value.toUpperCase().match(/[A-Z]{2}-?[A-Z0-9]{3}-?[0-9]{2}-?[0-9]{5}/g);
			if (isrcList && (!arrHasDupes(isrcList) || confirm("Achtung, there are duplicates!"))) {
				var isrcInputs = event.currentTarget.querySelectorAll("table > tbody > tr > td input.form-control[id^='isrc']");
				var lastUpdatedInput;
				for (var isrc = 0, input = 0, startingInputIndex = null; input < isrcInputs.length; input += 1) {
					isrcInputs[input].style.removeProperty("background-color");
					if (isrc < isrcList.length) {
						if (isrcInputs[input] === event.target) {
							startingInputIndex = input;
						}
						if (startingInputIndex !== null) {
							isrcInputs[input].value = isrcList[isrc];
							sendEvent(isrcInputs[input], "change");
							if (isrcInputs[input].getAttribute("oldValue") !== isrcInputs[input].value) {
								isrcInputs[input].style.setProperty("background-color", "#ff6");
								isrcInputs[input].setAttribute("oldValue", isrcInputs[input].value);
								lastUpdatedInput = isrcInputs[input];
							}
							isrc += 1;
						}
					}
				}
				if (lastUpdatedInput) {
					lastUpdatedInput.focus();
				}
			}
		}
	});
} else if (location.host.match(/musicbrainz\.org$/)) {
	var lastEditing = document.querySelector("div#sidebar > h2.editing + ul.links > li.separator");
	if (lastEditing) {
		var magicISRCLink = document.createElement("a");
		magicISRCLink.appendChild(document.createTextNode("MagicISRC"));
		magicISRCLink.style.setProperty("background", "#ff6");
		magicISRCLink.setAttribute("target", "_blank");
		magicISRCLink.setAttribute("href", "//magicisrc.kepstin.ca/?mbid=" + location.pathname.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/));
		lastEditing.parentNode.insertBefore(document.createElement("li"), lastEditing).appendChild(magicISRCLink);
	}
}
/* http://www.groggyjava.tv/freebies/duplicates.html */
function arrHasDupes(arr) {
	var i, j, n;
	n = arr.length;
	for (i = 0; i < n; i++) {
		for (j = i + 1; j < n; j++) {
			if (arr[i] == arr[j]) return true;
		}
	}
	return false;
}
function sendEvent(node, eventName) {
	let event = document.createEvent("HTMLEvents");
	event.initEvent(eventName, true, true);
	node.dispatchEvent(event);
}
