// ==UserScript==
// @name         mb. SPOT DUPLICATE RECORDINGS
// @version      2018.4.4.2099
// @changelog    https://github.com/jesus2099/konami-command/commits/master/mb_SPOT-DUPLICATE-RECORDINGS.user.js
// @description  musicbrainz.org: Spot recordings that are linked multiple times to the same work
// @supportURL   https://github.com/jesus2099/konami-command/labels/mb_SPOT-DUPLICATE-RECORDINGS
// @compatible   opera(12.18.1872)+violentmonkey      my setup
// @compatible   vivaldi(1.0.435.46)+violentmonkey    my setup (ho.)
// @compatible   vivaldi(1.13.1008.32)+violentmonkey  my setup (of.)
// @compatible   firefox(47.0)+greasemonkey           tested sometimes
// @compatible   chrome+violentmonkey                 should be same as vivaldi
// @namespace    https://github.com/jesus2099/konami-command
// @downloadURL  https://github.com/jesus2099/konami-command/raw/master/mb_SPOT-DUPLICATE-RECORDINGS.user.js
// @updateURL    https://github.com/jesus2099/konami-command/raw/master/mb_SPOT-DUPLICATE-RECORDINGS.user.js
// @author       jesus2099
// @licence      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @licence      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @since        2011-07-05; https://web.archive.org/web/20131103163405/userscripts.org/scripts/show/106145 / https://web.archive.org/web/20141011084009/userscripts-mirror.org/scripts/show/106145
// @icon         data:image/gif;base64,R0lGODlhEAAQAKEDAP+/3/9/vwAAAP///yH/C05FVFNDQVBFMi4wAwEAAAAh/glqZXN1czIwOTkAIfkEAQACAwAsAAAAABAAEAAAAkCcL5nHlgFiWE3AiMFkNnvBed42CCJgmlsnplhyonIEZ8ElQY8U66X+oZF2ogkIYcFpKI6b4uls3pyKqfGJzRYAACH5BAEIAAMALAgABQAFAAMAAAIFhI8ioAUAIfkEAQgAAwAsCAAGAAUAAgAAAgSEDHgFADs=
// @require      https://cdn.jsdelivr.net/gh/jesus2099/konami-command@4fa74ddc55ec51927562f6e9d7215e2b43b1120b/lib/SUPER.js?v=2018.3.14
// @grant        none
// @match        *://*.musicbrainz.org/recording/*
// @match        *://*.musicbrainz.org/work/*
// @exclude      *.org/recording/*/*
// @exclude      *.org/work/*/*
// @run-at       document-end
// ==/UserScript==
"use strict";for(var userjs="jesus2099userjs106145",count=1,tables=document.querySelectorAll("div#content table > tbody"),it=0;it<tables.length;it++)for(var alllinks=tables[it].getElementsByTagName("a"),parsedlinks=[],i=0;i<alllinks.length;i++){var href=alllinks[i].getAttribute("href"),parent=alllinks[i].parentNode;"SPAN"==parent.tagName&&parent.classList.contains("mp")&&(parent=parent.parentNode),href&&href.match(/\/recording|work\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)&&"H1"!=parent.tagName&&!parent.parentNode.classList.contains("tabs")&&!parent.classList.contains("pageselector")&&(parsedlinks[href]?(/* duplicate link */
parsedlinks[href].hasDupe||(parsedlinks[href].node.parentNode.insertBefore(dupetxt(parsedlinks[href].index),parsedlinks[href].node),parsedlinks[href].hasDupe=!0),alllinks[i].parentNode.insertBefore(dupetxt(parsedlinks[href].index),alllinks[i])):/* new link */
parsedlinks[href]={node:alllinks[i],index:"#"+count+++"/"+alllinks.length,hasDupe:!1})}function dupetxt(txt){return createTag("span",{a:{class:userjs+txt.replace(/[#/]/g,"-")},s:{backgroundColor:"yellow",color:"red",padding:"0 4px"},e:{mouseover:dupeHighlight,mouseout:dupeHighlight}},"duplicate "+txt)}function dupeHighlight(e){for(var dupes=getParent(this,"tbody").getElementsByClassName(this.className),d=0;d<dupes.length;d++)dupes[d].style.setProperty("background-color","mouseover"==e.type?"red":"yellow"),dupes[d].style.setProperty("color","mouseover"==e.type?"yellow":"red")}