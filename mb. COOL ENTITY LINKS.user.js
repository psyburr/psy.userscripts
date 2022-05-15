// ==UserScript==
// @name         mb. COOL ENTITY LINKS
// @version      2022.4.13
// @description  musicbrainz.org: In some pages like edits, blog, forums, chatlogs, tickets, annotations, etc. it will prefix entity links with an icon, shorten and embelish all sorts of MB links (cdtoc, entities, tickets, bugs, edits, etc.).
// @namespace    https://github.com/jesus2099/konami-command
// @supportURL   https://github.com/jesus2099/konami-command/labels/mb_COOL-ENTITY-LINKS
// @author       jesus2099
// @licence      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @licence      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @since        2012-04-24; https://web.archive.org/web/20131104205641/userscripts.org/scripts/show/131731 / https://web.archive.org/web/20141011084006/userscripts-mirror.org/scripts/show/131731
// @icon         data:image/gif;base64,R0lGODlhEAAQAKEDAP+/3/9/vwAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/glqZXN1czIwOTkAIfkEAQACAwAsAAAAABAAEAAAAkCcL5nHlgFiWE3AiMFkNnvBed42CCJgmlsnplhyonIEZ8ElQY8U66X+oZF2ogkIYcFpKI6b4uls3pyKqfGJzRYAACH5BAEIAAMALAgABQAFAAMAAAIFhI8ioAUAIfkEAQgAAwAsCAAGAAUAAgAAAgSEDHgFADs=
// @require      https://cdn.jsdelivr.net/gh/jesus2099/konami-command@4fa74ddc55ec51927562f6e9d7215e2b43b1120b/lib/SUPER.js?v=2018.3.14
// @grant        none
// @match        *://*.musicbrainz.org/*
// @exclude      /^https?:\/\/(\w+\.)?musicbrainz\.org\/account\//
// @exclude      /^https?:\/\/(\w+\.)?musicbrainz\.org\/admin\//
// @run-at       document-end
// ==/UserScript==
"use strict";
/* -------- CONFIGURATION START (don't edit above) -------- */
var contractMBIDs = true; // more compact MBIDs but brwoser can still inline search/find full MBID (this is magic from mb_INLINE-STUFF)
var editLink = true; // add direct link to edit page
var editsLink = true; // add direct link to edit history and open edit pages
/* -------- CONFIGURATION  END  (don't edit below) -------- */
var userjs = "jesus2099userjs131731";
var GUIDi = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}";
var entities = {
	acoustid: {fullpath: "//acoustid.org/track/"},
	artist: {path: "/artist/", icon: "artist.png"},
	bug: {fullpath: "//bugs.musicbrainz.org/ticket/", id: "[0-9]+", label: "#%id%"},
	cdtoc: {path: "/cdtoc/", icon: "release.png", id: "[A-Za-z0-9_\\.]+-"},
	"classic.edit": {path: "/show/edit/?editid=", id: "[0-9]+", label: "edit\u00a0#%id%"},
	"classic.user": {path: "/show/user/?username=", id: ".+"},
	edit: {path: "/edit/", id: "[0-9]+", label: "#%id%"},
	label: {path: "/label/", icon: "label.png"},
	place: {path: "/place/", icon: "place.svg"},
	recording: {path: "/recording/", icon: "recording.png"},
	release: {path: "/release/", icon: "release.png"},
	"release-group": {path: "/release-group/", icon: "release_group.svg"},
	ticket: {fullpath: "//tickets.metabrainz.org/browse/", id: "[A-Za-z]+-[0-9]+"},
	"ticket-old": {fullpath: "//tickets.musicbrainz.org/browse/", id: "[A-Za-z]+-[0-9]+", replace: [/#action_(\d+)/, "#comment-$1"]},
	track: {path: "/track/", icon: "recording.png", noTools: true},
	user: {path: "/user/", id: ".+", openEdits: "/edits/open", noEdit: true},
	work: {path: "/work/", icon: "work.svg"},
};
var j2css = document.createElement("style");
j2css.setAttribute("type", "text/css");
document.head.appendChild(j2css);
j2css = j2css.sheet;
j2css.insertRule("a." + userjs + " {text-shadow: 1px 1px 2px silver; white-space: nowrap;}", 0);
j2css.insertRule("a." + userjs + "tool {font-variant: small-caps; vertical-align: super; font-size: xx-small}", 0);
for (var ent in entities) if (Object.prototype.hasOwnProperty.call(entities, ent)) {
	var u = (entities[ent].fullpath ? entities[ent].fullpath : "musicbrainz.org" + entities[ent].path.replace("?", "\\?"));
	var c = userjs + ent;
	if (entities[ent].icon) {
		j2css.insertRule("a." + c + " { background-image: url(//musicbrainz.org/static/images/entity/" + entities[ent].icon + "); background-repeat: no-repeat; background-size: contain; padding-left: 16px; }", 0);
	}
	if (contractMBIDs && ent != "user") {
		j2css.insertRule("a." + c + " > code { display: inline-block; overflow-x: hidden; vertical-align: bottom; }", 0);
		j2css.insertRule("a." + c + ":hover > code { display: inline; }", 0);
	}
	var as, cssas;
	if (entities[ent].fullpath) {
		cssas = "a[href^='" + u + "'], a[href^='http:" + u + "'], a[href^='https:" + u + "']";
	} else if (self.location.href.match(/^https?:\/\/(test\.|beta\.|classic\.)?musicbrainz\.org/)) {
		cssas = "table.details a[href*='//" + u + "'], ";
		cssas += "table.details a[href*='//test." + u + "'], ";
		cssas += "table.details a[href*='//beta." + u + "'], ";
		cssas += "table.details a[href*='//classic." + u + "'][href$='.html'], ";
		cssas += "div.annotation a[href*='//" + u + "'], ";
		cssas += "div.annotation a[href*='//test." + u + "'], ";
		cssas += "div.annotation a[href*='//beta." + u + "'], ";
		cssas += "div.annotation a[href*='//classic." + u + "'][href$='.html'], ";
		cssas += "div[class^='edit-'] a[href*='//" + u + "'], ";
		cssas += "div[class^='edit-'] a[href*='//test." + u + "'], ";
		cssas += "div[class^='edit-'] a[href*='//beta." + u + "'], ";
		cssas += "div[class^='edit-'] a[href*='//classic." + u + "'][href$='.html']";
		if (self.location.pathname.match(new RegExp("/(artist|label)/" + GUIDi + "/relationships|/place/" + GUIDi + "/performances"), "i")) {
			cssas += ", table.tbl tr > td:first-child + td a[href*='//" + u + "'], ";
			cssas += "table.tbl tr > td:first-child + td a[href*='//test." + u + "'], ";
			cssas += "table.tbl tr > td:first-child + td a[href*='//beta." + u + "']";
		}
	} else {
		cssas = "a[href*='//" + u + "'], ";
		cssas += "a[href*='//test." + u + "'], ";
		cssas += "a[href*='//beta." + u + "'], ";
		cssas += "a[href*='//classic." + u + "'][href$='.html']";
	}
	as = document.querySelectorAll(cssas);
	for (var a = 0; a < as.length; a++) {
		var href, id;
		if (
			(href = as[a].getAttribute("href"))
			&& (id = href.match(new RegExp(u + "(" + (entities[ent].id ? entities[ent].id : GUIDi) + ")(?:\\.html)?(/[a-z_-]+)?(.+)?$", "i")))
			&& !as[a].querySelector("img:not(.rendericon)")
		) {
			var newA = as[a].cloneNode(true);
			if (entities[ent].replace) {
				newA.setAttribute("href", newA.getAttribute("href").replace(entities[ent].replace[0], entities[ent].replace[1]));
			}
			newA.classList.add(c);
			if (as[a].textContent == href || /* forums */ as[a].textContent == href.substr(0, 39) + " … " + href.substr(-10) || /* edit-notes */ as[a].textContent == href.substr(0, 48) + "…") {
				newA.classList.add(userjs);
				var text = unescape(id[1]);
				if (entities[ent].label) text = entities[ent].label.replace(/%id%/, text);
				if (text) {
					newA.replaceChild(entities[ent].id ? document.createTextNode(text) : createTag("code", {}, text), newA.firstChild);
				}
				if (id[2] || id[3]) {
					newA.appendChild(document.createElement("small")).appendChild(document.createTextNode((id[2] ? id[2] : "") + (id[3] ? (id[2] == "/disc" ? id[3].match(/\/\d+/) : "") + "…" : ""))).parentNode.style.setProperty("opacity", ".5");
				}
				var altserv = href.match(/^[^/]*\/\/(?:(test|beta|classic)\.musicbrainz\.org)/);
				if (altserv) {
					newA.appendChild(document.createTextNode(" (" + altserv[1] + ")"));
				}
				var code = newA.querySelector("code");
				if (contractMBIDs && code) {
					var width = parseInt(self.getComputedStyle(code).getPropertyValue("width").match(/^\d+/) + "", 10);
					code.style.setProperty("width", width / code.textContent.length * 8 + "px");
				}
				newA.insertBefore(createTag("b", {}, ent + "\u00A0"), newA.firstChild);
				if (entities[ent].noTools !== true) {
					if (u.match(/musicbrainz\.org/) && (ent == "user" && href.match(/user\/[^/]+$/) || !entities[ent].id && href.match(new RegExp(GUIDi + "$"))) && (editsLink || editLink)) {
						var fragment = document.createDocumentFragment();
						fragment.appendChild(newA);
						addAfter(document.createTextNode(">"), newA);
						if (editLink && entities[ent].noEdit !== true) { addAfter(createTag("a", {a: {href: href + "/edit", title: "edit this entity"}}, "E"), newA); }
						if (editsLink) { addAfter(createTag("a", {a: {href: href + "/edits", title: "see entity edit history"}}, "H"), newA); }
						if (editsLink) { addAfter(createTag("a", {a: {href: href + (entities[ent].openEdits ? entities[ent].openEdits : "/open_edits"), title: "see entity open edits"}}, "O"), newA); }
						addAfter(document.createTextNode(" <"), newA);
						newA = fragment;
					}
				}
			}
			as[a].parentNode.replaceChild(newA, as[a]);
		}
	}
}
