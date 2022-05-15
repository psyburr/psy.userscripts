// ==UserScript==
// @name            Country of origin for Amazon products
// @name:de         Herkunftsland für Amazon Produkte
// @name:fr         Pays d'origine des produits Amazon
// @name:it         Paese di origine per i prodotti Amazon
// @name:es         País de origen de los productos de Amazon
// @name:nl         Land van herkomst voor Amazon-producten
// @name:sv         Ursprungsland för Amazon-produkter
// @name:ja         Amazon製品の原産国
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description     userscript to fetch and display the country of origin for amazon products. initially developed to make boycotting the CCP more easy.
// @description:de  Userscript zum Abrufen und Anzeigen des Herkunftslandes von Amazon-Produkten. ursprünglich entwickelt, um den Boykott der KPC zu erleichtern.
// @description:fr  userscript pour récupérer et afficher le pays d'origine des produits amazon. initialement développé pour faciliter le boycott du PCC.
// @description:it  userscript per recuperare e visualizzare il paese di origine dei prodotti Amazon. inizialmente sviluppato per rendere più facile il boicottaggio del PCC.
// @description:es  usercript para buscar y mostrar el país de origen de los productos de Amazon. inicialmente desarrollado para facilitar el boicot al PCCh.
// @description:nl  userscript om het land van herkomst voor Amazon-producten op te halen en weer te geven. oorspronkelijk ontwikkeld om het boycotten van de CCP gemakkelijker te maken.
// @description:sv  användarskript för att hämta och visa ursprungslandet för Amazon-produkter. ursprungligen utvecklad för att göra det lättare att bojkotta KKP.
// @description:ja  アマゾン製品の原産国を取得して表示するためのユーザースクリプト。 当初はCCPのボイコットをより簡単にするために開発されました。
// @author       Sidem, calne_ca
// @license      GPL-3.0-only
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.com.au/*
// @contributionURL https://cointr.ee/sidem
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
/* jshint esversion: 6 */


GM_registerMenuCommand('Tip Developer', () => {
    GM_openInTab('https://cointr.ee/sidem', {
      active: true,
      insert: true,
      setParent: true
    });
  });

(function () {
    'use strict';

    let countryCodes = {
        "AF": "Afghanistan", "AL": "Albania", "DZ": "Algeria", "AS": "American Samoa", "AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarctica", "AG": "Antigua and Barbuda", "AR": "Argentina", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan", "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin", "BM": "Bermuda", "BT": "Bhutan", "BO": "Bolivia", "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BV": "Bouvet Island", "BR": "Brazil", "IO": "British Indian Ocean Territory", "BN": "Brunei Darussalam", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "CV": "Cape Verde", "KY": "Cayman Islands", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile", "CN": "China", "CX": "Christmas Island", "CC": "Cocos (Keeling) Islands", "CO": "Colombia", "KM": "Comoros", "CG": "Congo", "CD": "Congo, the Democratic Republic of the", "CK": "Cook Islands", "CR": "Costa Rica", "CI": "Cote D'Ivoire", "HR": "Croatia", "CU": "Cuba", "CY": "Cyprus", "CZ": "Czech Republic", "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador", "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia", "ET": "Ethiopia", "FK": "Falkland Islands (Malvinas)", "FO": "Faroe Islands", "FJ": "Fiji", "FI": "Finland", "FR": "France", "GF": "French Guiana", "PF": "French Polynesia", "TF": "French Southern Territories", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany", "GH": "Ghana", "GI": "Gibraltar", "GR": "Greece", "GL": "Greenland", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", "GT": "Guatemala", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti", "HM": "Heard Island and McDonald Islands", "VA": "Holy See (Vatican City State)", "HN": "Honduras", "HK": "Hong Kong", "HU": "Hungary", "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran, Islamic Republic of", "IQ": "Iraq", "IE": "Ireland", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan", "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "North Korea", "KR": "South Korea", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Lao People's Democratic Republic", "LV": "Latvia", "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MO": "Macao", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia", "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands", "MQ": "Martinique", "MR": "Mauritania", "MU": "Mauritius", "YT": "Mayotte", "MX": "Mexico", "FM": "Micronesia, Federated States of", "MD": "Moldova, Republic of", "MC": "Monaco", "MN": "Mongolia", "MS": "Montserrat", "MA": "Morocco", "MZ": "Mozambique", "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NC": "New Caledonia", "NZ": "New Zealand", "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "NU": "Niue", "NF": "Norfolk Island", "MK": "North Macedonia, Republic of", "MP": "Northern Mariana Islands", "NO": "Norway", "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestinian Territory, Occupied", "PA": "Panama", "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PT": "Portugal", "PR": "Puerto Rico", "QA": "Qatar", "RE": "Reunion", "RO": "Romania", "RU": "Russia", "RW": "Rwanda", "SH": "Saint Helena", "KN": "Saint Kitts and Nevis", "LC": "Saint Lucia", "PM": "Saint Pierre and Miquelon", "VC": "Saint Vincent and the Grenadines", "WS": "Samoa", "SM": "San Marino", "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal", "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia", "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa", "GS": "South Georgia and the South Sandwich Islands", "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname", "SJ": "Svalbard and Jan Mayen", "SZ": "Eswatini", "SE": "Sweden", "CH": "Switzerland", "SY": "Syrian Arab Republic", "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania, United Republic of", "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan", "TC": "Turks and Caicos Islands", "TV": "Tuvalu", "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "UK", "US": "USA", "UM": "United States Minor Outlying Islands", "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Vietnam", "VG": "Virgin Islands, British", "VI": "Virgin Islands, U.S.", "WF": "Wallis and Futuna", "EH": "Western Sahara", "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe", "AX": "Åland Islands", "BQ": "Bonaire, Sint Eustatius and Saba", "CW": "Curaçao", "GG": "Guernsey", "IM": "Isle of Man", "JE": "Jersey", "ME": "Montenegro", "BL": "Saint Barthélemy", "MF": "Saint Martin (French part)", "RS": "Serbia", "SX": "Sint Maarten (Dutch part)", "SS": "South Sudan", "XK": "Kosovo"
    };

    var applyLogoSprite = function () {
        let amazonLogo = document.getElementById("amazonOriginalProduct");
        if (amazonLogo != null) {
            amazonLogo.style.objectFit = "none";
            amazonLogo.style.objectPosition = "-2px -71px";
            amazonLogo.style.width = "55px";
            amazonLogo.style.height = "28px";
        }
    }

    var codeToFlag = function (isoCode, countryName, sellerName) {
        if (sellerName.includes("Amazon")) {
            return "<img class='countryOfOriginFlag' id='amazonOriginalProduct' src='https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIIcon-beacon_light_1x-2767b239bb9543c0a4af44c843ab017f27080532._V2_.png' alt='" + sellerName + "' title='" + sellerName + "'>";
        } else if (isoCode != "") {
            return "<img class='countryOfOriginFlag' src='https://flagcdn.com/w40/" + isoCode.toLowerCase() + ".png' alt='" + countryName + ", " + sellerName + "' title='" + countryName + ", " + sellerName + "'>";
        } else {
            return "";
        }

    };
    var stringToHTML = function (str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc;
    };

    function runCountryFetch() {
        document.getElementById("productTitle").innerHTML = "<img src='https://images-eu.ssl-images-amazon.com/images/G/03/javascripts/lib/popover/images/snake._CB485935607_.gif' width='25' height='25'> " + document.getElementById("productTitle").innerText;

        let thirdPartySeller = document.getElementById('sellerProfileTriggerId');
        if (thirdPartySeller == null) {
            let siteLinks = document.getElementsByClassName("a-link-normal");
            for (let link of siteLinks) {
                if (link.href.endsWith("ref=dp_merchant_link")) {
                    thirdPartySeller = link;
                }
            }
        }

        if (thirdPartySeller != null) {
            let sellerPage = thirdPartySeller.href;

            fetch(sellerPage)
                .then(function (response) {
                    switch (response.status) {
                        case 200:
                            return response.text();
                        case 404:
                            throw response;
                    }
                })
                .then(function (template) {
                    let sellerPageDOM = stringToHTML(template);
                    let sellerName = sellerPageDOM.getElementById("sellerName-rd");
                          let newSellerPage = true;
                          if(sellerName != null) {
                            sellerName = sellerName.innerText;
                          } else {
                            sellerName = sellerPageDOM.getElementById("sellerName").innerText;
                            newSellerPage = false;
                          }
                    let sellerInfo = [];
                    let items = [];
                    if(newSellerPage) {
                      sellerInfo = sellerPageDOM.getElementById('page-section-detail-seller-info');
                      items = sellerInfo.getElementsByClassName("indent-left");
                    } else {
                      items = sellerPageDOM.getElementsByClassName("a-list-item");
                    }
                    
                    
                    let originCountry = "";
                    let originCountryCode = "";
                    let isChina = false;
                    for (let i of items) {
                        if (countryCodes.hasOwnProperty(i.innerText)) {
                            originCountryCode = i.innerText;
                            originCountry = countryCodes[i.innerText];
                            if (originCountryCode == "CN") isChina = true;
                        }
                    }
                    if (isChina) originCountry = "☠ " + originCountry + " ☠";
                    document.getElementById("productTitle").innerHTML = codeToFlag(originCountryCode, originCountry, sellerName) + " " + document.getElementById("productTitle").innerText;
                })
                .catch(function (response) {
                    console.log(response);
                })
                .finally(function (response) {
                    applyLogoSprite();
                });
        } else {
            document.getElementById("productTitle").innerHTML = codeToFlag("", "", "Amazon") + " " + document.getElementById("productTitle").innerText;
            applyLogoSprite();
        }
    }
    let priceBox = document.getElementById('apex_desktop');
    if(priceBox == null) priceBox = document.getElementById('corePriceDisplay_desktop_feature_div');
    if(priceBox == null) priceBox = document.getElementById('corePrice_desktop');
    if(priceBox == null) priceBox = document.getElementsByClassName('a-price')[0];
    if(priceBox == null) priceBox = document.getElementsByClassName('priceSizeOverride')[0]; 
    const observer = new MutationObserver(function (mutation) {
      if(!mutation[0].target.id.includes('deal_expiry_timer')) {
        runCountryFetch();
      }
    });
    observer.observe(priceBox, { subtree: true, childList: true });
    runCountryFetch();

})();