// ==UserScript==
// @name GitHub Red Issues
// @namespace github.com/openstyles/stylus
// @version 1.0.20
// @description Turns the issue color of closed issues from purple back to red - back reddish color icon for closed github issues.
// @author Katsute, kidonng, krystian3w, iam-py-test, obfuscatedgenerated
// @license CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// @grant GM_addStyle
// @run-at document-start
// @include http://github.com/*
// @include https://github.com/*
// @include http://*.github.com/*
// @include https://*.github.com/*
// ==/UserScript==

(function() {
let css = `
/* https://raw.githubusercontent.com/Katsute/GitHub-Red-Issues/main/src/style.css */
/* Copyright (C) 2022 Katsute <https://github.com/Katsute> */

:root {
    --rissue-pull-merged     : var(--color-done-emphasis, #8957e5);
    --rissue-pull-merged-fg  : var(--color-done-fg, #a371f7);
    --rissue-issue-closed    : var(--color-danger-emphasis, #da3633);
    --rissue-issue-closed-fg : var(--color-danger-fg, #f85149);
    --rissue-white-fg        : var(--color-fg-on-emphasis, #F0F6Fc);
}

/* issue icon */
:not(.State.State--merged):not(.TimelineItem-badge) > svg.octicon-issue-closed,
/* projects beta icon */
div[data-hovercard-subject-tag^="issue:"] path[d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"],
div[data-hovercard-subject-tag^="issue:"] path[d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"]
{
    color: var(--rissue-issue-closed-fg) !important;
}

/* issue badge */
#show_issue .gh-header-meta .State.State--merged,
#show_issue .gh-header-sticky .State.State--merged,
/* issue timeline icon */
#show_issue .TimelineItem > .TimelineItem-badge.color-bg-done-emphasis,
/* timeline mention closed issue label */
.TimelineItem > .TimelineItem-body div[id^="ref-issue-"] ~ div > span.State.State--merged,
/* pull timeline closed label */
.pull-discussion-timeline .TimelineItem > .TimelineItem-body div span.State.State--merged
{
    background-color: var(--rissue-issue-closed) !important;
}

/* pull timeline closed mention label override */
.pull-discussion-timeline .TimelineItem > .TimelineItem-body div[id^="ref-pullrequest-"] ~ div span.State.State--merged {
    background-color: var(--rissue-pull-merged) !important;
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
