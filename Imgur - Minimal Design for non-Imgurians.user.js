// ==UserScript==
// @name Imgur - Minimal Design for non-Imgurians
// @description Removes all the unnecessary stuff, for people that's not interested about Imgur culture.
// @author krisu (https://github.com/krisu5)
// @namespace github.com/krisu5/userstyles
// @homepageURL https://github.com/krisu5/userstyles/tree/master/Imgur%20-%20Minimal%20and%20Anti-Social%20for%20non-Imgurians
// @supportURL https://github.com/krisu5/userstyles/issues
// @version 1.2.5
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @include http://imgur.com/*
// @include https://imgur.com/*
// @include http://*.imgur.com/*
// @include https://*.imgur.com/*
// @include https://zip.imgur.com/*
// ==/UserScript==

(function() {
let css = "";
if (location.href === "https://imgur.com/" || location.href.startsWith("https://imgur.com/upload")) {
  css += `
  /* -----------------------------------------------
     _____               _                          
    |  ___|             | |                         
    | |_ _ __ ___  _ __ | |_ _ __   __ _  __ _  ___ 
    |  _| '__/ _ \\| '_ \\| __| '_ \\ / _\` |/ _\` |/ _ \\
    | | | | | (_) | | | | |_| |_) | (_| | (_| |  __/
    \\_| |_|  \\___/|_| |_|\\__| .__/ \\__,_|\\__, |\\___|
                            | |           __/ |     
                            |_|          |___/
    ------------------------------------------------ */

  .InteractiveBackground, .Message.welcome, .TrendingTags, .CoverChangeGallery,
  .NewCover.isFixed, .PopUpClose, .Button.upload img, [class*="Emerald"]:not(.EmeraldButton), .SnowFlakesBg,
  [class^="UploadSpinner"]
  { display: none !important; }

  body, html { overflow-y: hidden !important; }

  .Button.upload {
      position: fixed !important;
      margin: 0 !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 60vw !important;
      height: 23vw !important;
      border-radius: 25px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
  }

  .Button.upload:hover:before { border-radius: 25px !important; }

  .Button.upload:after { font-size: clamp(2rem, 5vw, 7rem) !important; }

  .NewCover { background: transparent !important; }
  `;
}
if ((location.hostname === "imgur.com" || location.hostname.endsWith(".imgur.com"))) {
  css += `
  /* --------------------------------
     _____       _ _                 
    |  __ \\     | | |                
    | |  \\/ __ _| | | ___ _ __ _   _ 
    | | __ / _\` | | |/ _ \\ '__| | | |
    | |_\\ \\ (_| | | |  __/ |  | |_| |
     \\____/\\__,_|_|_|\\___|_|   \\__, |
                                __/ |
                               |___/
     & Everything else
    --------------------------------- */

  /* ================================
     ======= NEW DESIGN (2020) ======
     ================================ */

  .CommentsList, .Footer, .Gallery-Sidebar, .NavbarNotifications, .Searchbar, .Navigation-Container,
  [class*="share-btn"]:not(.share-btn-other):not(.share-btn-download), .CoverPostMeta.Display,
  .Gallery-EngagementBarContainer, .ButtonBackToTop, .Gallery-Content--tags, .TagManager.PostOptions-section,
  .TagSuggestion-container, .toast2, [class*="bottomad"], [class*="BottomAd"], .Footer-whitelist,
  .BottomRecirc, .btn-wall--no, .BannerTop3, .UploadSpinner-contentWrapper, .Page404-contentWrapper, iframe
  { display: none !important; }

  body:not([class=""]) {
      background-color: #27292d;
      overflow: auto;
  }

  .Button.upload { font-size: 0; }

  .Button.upload:after {
      content: "Upload";
      font-size: 15px;
  }

  .Button.upload img {
      margin-right: 9px;
      margin-top: -7px;
  }

  .NewCover.GalleryCover.isFixed, .NewCover.isFixed .GoUp {
      visibility: hidden !important;
      transition: inherit !important;
      box-shadow: none !important;
  }

  .Navbar-signin {
      background: #5c940d;
      padding: 9px 20px;
      border-radius: 3px;
      box-shadow: 0 6px 10px 0 rgba(27,28,30,.31);
      text-shadow: none !important;
  }

  .Navbar-signup {
      padding-left: 20px;
      padding-right: 20px;
      min-width: inherit !important;
  }

  .EmeraldButton {
      font-size: 0 !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
  }

  .EmeraldButton:after {
      content: "Support Imgur!";
      font-size: 15px !important;
  }

  .ProfileNavbar-loggedIn .EmeraldButton { margin-right: 25px !important; }

  .btn-wall--yes {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      padding: 20px 0 22px !important;
      font-size: 28px !important;
      margin: 0 auto !important;
  }

  .Page404Cover-logo {
      position: absolute !important;
      top: 25vh !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
  }
      
  /* ------------------------------
     Download button always visible
     ------------------------------ */
     
  .Gallery-Options .Dropdown-title,
  .Gallery-OptionsMenu button[type="button"]:first-child
  { display: none !important; }

  .Gallery-OptionsMenu .Dropdown-menu {
      display: inherit !important;
      visibility: hidden !important;
  }

  .Gallery-OptionsMenu .Dropdown-list {
      margin: -51px 0 0 -158px !important;
      padding: 17px 0 !important;
  }

  .Gallery-OptionsMenu button:not([class=""]) {
      width: auto !important;
      border-radius: 5px !important;
      color: #b4b9c2 !important;
      visibility: visible !important;
  }

  .Gallery-OptionsMenu button:hover {
      background: #1bb76e !important;
      color: #fff !important;
  }

  .Gallery-OptionsMenu button:hover .icon [fill] { fill: #fff !important; }

  /* -------------------------
     Image / video size tweaks
     ------------------------- */

  /* ------- NOT MODAL ------- */

  .Gallery-ContentWrapper .Gallery-Content--media video:not(.fullscreen) { max-height: 70vh !important; }

  /* -------- IN MODAL ------- */

  .ImageViewer > .Dialog-wrapper > div[style^="height:"] {
      width: auto !important;
      height: auto !important;
  }

  .ImageViewerContent img {
      max-height: 99.5vh !important;
      max-width: 99vw !important;
      min-height: inherit !important;
      border: 5px solid #fff !important;
      border-radius: 6px !important;
  }

  .ImageViewer {
      border: 0 !important;
      border-radius: 0 !important;
  }

  /* ------------------------- */

  .Gallery-ContentWrapper .Gallery-Content--media { background-color: rgba(0,0,0,0.4) !important; }

  .Gallery-Content--descr {
      background: rgba(0,0,0,.3) !important;
      padding: 20px !important;
      border-radius: 10px !important;
  }

  .loadMore {
      padding: 0 0 3px 0 !important;
      margin-bottom: 25px !important;
  }

  .loadMore svg { margin-top: 3px !important; }

  .UploadPost .ImageDescription { padding: 0 24px 24px !important; }


  /* ================================
     ========== OLD DESIGN ==========
     ================================ */

  .Open-Save-To-Folder-Button, #cta-container, #comments-container, .left #recommendations,
  .next-prev, #side-gallery, .search-container, #notification-container, .post-action *,
  .side-footer-links, .divider, [class^="post-options-tag"]
  { display: none !important; }

  #topbar .account { left: -175px !important; }

  .post-pad {
      transform: translateX(22.5%) !important;
      margin-bottom: 20px !important;
  }

  .upload-global-post .post-pad { transform: inherit !important; }

  ul.post-options-extra { margin-top: 20px !important; }

  .post-action {
      padding: 0 !important;
      min-height: 15px !important;
  }
  `;
}
if (location.href.startsWith("https://zip.imgur.com/")) {
  css += `
  body { background: #fff !important; }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
