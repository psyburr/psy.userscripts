// ==UserScript==
// @name        GitLab Sort Content
// @version     0.1.1-beta
// @description A userscript that makes some lists & markdown tables sortable
// @license     MIT
// @author      Rob Garrison
// @namespace   https://gitlab.com/Mottie
// @include     https://gitlab.com/*
// @run-at      document-idle
// @grant       GM.addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.min.js
// @icon        https://gitlab.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png
// @updateURL   https://gitlab.com/Mottie/GitLab-userscripts/raw/master/gitlab-sort-content.user.js
// @downloadURL https://gitlab.com/Mottie/GitLab-userscripts/raw/master/gitlab-sort-content.user.js
// ==/UserScript==
(()=>{"use strict";
/* example pages:
	tables/repo files - https://github.com/Mottie/GitLab-userscripts
	*/const sorts=["asc","desc"],icons={white:{unsorted:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6bTAgMUgxbDcgN3oiIGZpbGw9IiNkZGQiIG9wYWNpdHk9Ii4yIi8+PC9zdmc+",asc:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTE1IDlIMWw3IDd6IiBmaWxsPSIjZGRkIiBvcGFjaXR5PSIuMiIvPjwvc3ZnPg==",desc:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjZGRkIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0xNSA5SDFsNyA3eiIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=="},black:{unsorted:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6bTAgMUgxbDcgN3oiIGZpbGw9IiMyMjIiIG9wYWNpdHk9Ii4yIi8+PC9zdmc+",asc:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjMjIyIi8+PHBhdGggZD0iTTE1IDlIMWw3IDd6IiBmaWxsPSIjMjIyIiBvcGFjaXR5PSIuMiIvPjwvc3ZnPg==",desc:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjMjIyIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0xNSA5SDFsNyA3eiIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="}};function initSortTable(el){!function(){
// remove text selection - http://stackoverflow.com/a/3171348/145346
const sel=window.getSelection?window.getSelection():document.selection;sel&&(sel.removeAllRanges?sel.removeAllRanges():sel.empty&&sel.empty())}();const dir=el.classList.contains(sorts[0])?sorts[1]:sorts[0],table=el.closest("table"),firstRow=$("tbody tr:first-child",table),link=$("a",firstRow),options={order:dir,natural:!0,selector:`td:nth-child(${el.cellIndex+1})`};"Last update"===el.textContent.trim()&&(
// sort repo age column using ISO 8601 datetime format
options.selector+=" time",options.attr="datetime"),
// Don't sort directory up row
link&&".."===link.textContent&&firstRow.classList.add("no-sort"),tinysort($$("tbody tr:not(.no-sort)",table),options),$$("th",table).forEach(elm=>{elm.classList.remove(...sorts)}),el.classList.add(dir)}function $(str,el){return(el||document).querySelector(str)}function $$(str,el){return Array.from((el||document).querySelectorAll(str))}!function(){const styles=function(){let brightest=0,
// color will be "rgb(#, #, #)" or "rgba(#, #, #, #)"
color=window.getComputedStyle(document.body).backgroundColor;const rgb=(color||"").replace(/\s/g,"").match(/^rgba?\((\d+),(\d+),(\d+)/i);return!!rgb&&(color=rgb.slice(1),// remove "rgb.." part from match
color.forEach(c=>{
// http://stackoverflow.com/a/15794784/145346
brightest=Math.max(brightest,parseInt(c,10))}),brightest<128);
// fallback to bright background
}()?icons.white:icons.black;GM.addStyle(`\n\t\t\t/* unsorted icon */\n\t\t\t[data-rich-type="markup"] thead th, .tree-table th, .wiki th {\n\t\t\t\tcursor:pointer;\n\t\t\t\tpadding-right:22px !important;\n\t\t\t\tbackground-image:url(${styles.unsorted}) !important;\n\t\t\t\tbackground-repeat:no-repeat !important;\n\t\t\t\tbackground-position:calc(100% - 5px) center !important;\n\t\t\t\ttext-align:left;\n\t\t\t}\n\t\t\t/* asc/dec icons */\n\t\t\ttable thead th.asc {\n\t\t\t\tbackground-image:url(${styles.asc}) !important;\n\t\t\t\tbackground-repeat:no-repeat !important;\n\t\t\t}\n\t\t\ttable thead th.desc {\n\t\t\t\tbackground-image:url(${styles.desc}) !important;\n\t\t\t\tbackground-repeat:no-repeat !important;\n\t\t\t}\n\t\t`),document.body.addEventListener("click",event=>{const target=event.target;if(target&&1===target.nodeType&&"TH"===target.nodeName&&target.closest(".blob-viewer, .tree-table, .wiki"))return initSortTable(target)})}()})();