// ==UserScript==
// @name        Amazon Sponsored Products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.2.4
// @license     MIT
// @description Removes the terrible sponsored products from Amazon.
// @include     http*://www.amazon.cn/*
// @include     http*://www.amazon.in/*
// @include     http*://www.amazon.co.jp/*
// @include     http*://www.amazon.com.sg/*
// @include     http*://www.amazon.com.tr/*
// @include     http*://www.amazon.ae/*
// @include     http*://www.amazon.fr/*
// @include     http*://www.amazon.de/*
// @include     http*://www.amazon.it/*
// @include     http*://www.amazon.nl/*
// @include     http*://www.amazon.es/*
// @include     http*://www.amazon.co.uk/*
// @include     http*://www.amazon.ca/*
// @include     http*://www.amazon.com.mx/*
// @include     http*://www.amazon.com/*
// @include     http*://www.amazon.com.au/*
// @include     http*://www.amazon.com.br/*
// @include     http*://smile.amazon.com/*
// @run-at      document-end
// ==/UserScript==

new MutationObserver(function(mutationList, observer) {
    // Remove old style sponsored results
    document.querySelectorAll('[data-component-type="sp-sponsored-result"]').forEach(function(element) {
        var parent = element.closest('[data-asin]');
        if (parent) parent.remove();
    });

    // Remove old style carousel ads
    document.querySelectorAll('.sp_desktop_sponsored_label').forEach(function(element) {
        var parent = element.closest('.a-carousel-container');
        if (parent) parent.remove();
    });

    // Remove all additional sponsored products
    document.querySelectorAll('.AdHolder').forEach(function(element) {
        element.remove();
    });
}).observe(document.body, {childList: true, subtree: true});