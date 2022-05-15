// ==UserScript==
// @name         autoAgreeOmegle
// @namespace    https://themeow.ml
// @version      0.1
// @description  Makes omegle better.
// @author       Meow
// @match        *://*.omegle.com/*
// @match        *://*/recaptcha/api2/*
// ==/UserScript==

(function () {
  "use strict";

  window.opts = {
    autoAgree: true,
  };

  if (window.location.href.includes("recaptcha")) {
    if (!document.referrer || !document.referrer.includes("omegle.com")) return;
    let cb = document.querySelector(".recaptcha-checkbox-border");
    if (cb) cb.click();
  } else {
    if (opts.autoAgree) {
      let agreeClickInt = setInterval(function () {
        let agreeRef = ([...document.querySelectorAll("label")].filter((a) =>
          a.innerText.startsWith("By checking the box you")
        ) || [])[0];
        if (agreeRef) {
          let agreeParent = agreeRef.parentElement.parentElement;
          agreeParent.querySelectorAll('input[type="checkbox"]').forEach((c) => {
            c.click();
          });
          agreeParent.querySelector('input[type="button"]').click();
          clearInterval(agreeClickInt);
        }
      }, 10);
    }
  }
})();
