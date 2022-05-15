// ==UserScript==
// @name         Amazon - Highlight resellers
// @namespace    graphen
// @version      1.3.1
// @description  See instantly if the product really comes from Amazon or from a reseller
// @license      MIT
// @author       Graphen
// @include      /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|ae|fr|de|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @grant        none
// @noframes
// @icon         https://www.amazon.com/favicon.ico
// ==/UserScript==

/* jshint esversion: 6 */
(function (doc) {
    'use strict';

    const detectionValidList = [
        //British English
              "Dispatched from and sold by Amazon.",
              "Dispatched from and sold by Amazon EU Sarl.",
        //Canadian English
              "Ships from and sold by Amazon.ca.",
        //American English
              "Ships from and sold by Amazon.com Services LLC.",
        //Australian English
              "Ships from and sold by Amazon US.",
        //United Arab Emirates English
              "Ships from and sold by Amazon.ae.",
        //German
              "Verkauf und Versand durch Amazon.",
              "Verkauf und Versand durch Amazon EU Sarl.",
              "Verkauf und Versand durch amazon.de.",
        //Spanish
              "Vendido y enviado por Amazon.",
              "Vendido y enviado por Amazon EU Sarl.",
        //French
              "Expédié et vendu par Amazon.",
              "Expédié et vendu par Amazon EU Sarl.",
        //Italian
              "Venduto e spedito da Amazon.",
              "Venduto e spedito da Amazon EU Sarl.",
        //Dutch
              "Verzonden en verkocht door Amazon.",
              "Verzonden en verkocht door Amazon EU Sarl.",
        //Mexican / Spanish
              "Vendido y enviado por Amazon México.",
        //Brazilian / Portuguese
              "Enviado e vendido por Amazon.com.br.",
        //Japanese
              "この商品は、Amazon.co.jp が販売、発送します。"
    ];

    function highlight() {
        var merchInfo = doc.getElementById("merchant-info");
        var tabularBuybox = doc.getElementById("tabular-buybox");
        if (merchInfo) {
            // console.log("Merchant Info: " + merchInfo.innerText.trim());
            if (detectionValidList.includes(merchInfo.innerText.trim())) {
                merchInfo.style.color = "green";
            }
            else {
                merchInfo.style.color = "fuchsia";
                // Style reseller name and link
                let body = doc.querySelector('body');
                let fontColor = window.getComputedStyle(body).getPropertyValue('color');
                doc.querySelector("#merchant-info > a:first-of-type").style.cssText = "color: " + fontColor + " !important;";
            }
        }
        // Addition for new .co.uk tabular buybox
        else if (tabularBuybox) {
            // console.log("Tabular Buybox: " + tabularBuybox.innerText.trim());
            if (tabularBuybox.innerText.trim() === "Dispatches from\nAmazon\nSold by\nAmazon") {
                tabularBuybox.style.cssText = "color: green !important;";
            }
            else {
                let spans = tabularBuybox.querySelectorAll("span");
                for (let i = 0; i < spans.length; i++) {
                    spans[i].style.cssText = "color: fuchsia !important;";
                }
            }
        }
    }

    highlight();

    // Execute again when item variation is selected
    var buyboxParent = doc.getElementById('desktop_buybox');
    if (buyboxParent) {
        var MO = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(nodeElement) {
                    if (nodeElement.id === "buybox") {
                        highlight();
                    }
                });
            });
        });
        MO.observe(buyboxParent, { childList: true, subtree: true });
    }

})(document);
