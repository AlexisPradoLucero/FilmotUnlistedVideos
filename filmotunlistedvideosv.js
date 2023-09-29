// ==UserScript==
// @name         Filmot Unlisted Videos
// @namespace    Violentmonkey Scripts
// @match        https://www.youtube.com/@*
// @description  View hidden videos from YouTube channels using filmot.
// @version      1.0
// @author       AlexisPrado
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to make a GET request
    function getRequest(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        xhr.send();
    }
 
    // Main function
    function main() {
        // Get the current browser's URL
        var currentURL = window.location.href;
 
        // Check if the URL has the correct format
        var match = currentURL.match(/^https:\/\/www.youtube.com\/@(.+)/);
        if (!match) {
            console.log('This script only works on pages with URLs in the format https://www.youtube.com/@');
            return;
        }
 
        // Get the HTML content of the current page
        getRequest(currentURL, function(html_prueba) {
            // Use regular expressions to search for content inside <link rel="canonical">
            var canonical_match = html_prueba.match(/<link\s+rel="canonical"\s+href="(.*?)">/);
 
            // Get the content inside <link rel="canonical">
            var canonical_content = canonical_match ? canonical_match[1] : null;
 
            // If content is found, remove "https://www.youtube.com/channel/" and then print it
            if (canonical_content) {
                canonical_content = canonical_content.replace("https://www.youtube.com/channel/", "");
                console.log('Channel ID: ' + canonical_content);
 
                // Build the URL for filmot.com with the obtained channel text
                var url_filmot = 'https://filmot.com/unlistedSearch?channelID=' + canonical_content + '&sortField=uploaddate&sortOrder=desc&';
 
                // Make a GET request to get the content of the new URL (filmot.com)
                getRequest(url_filmot, function(html_filmot) {
                    // Check if the response contains "No results found"
                    if (html_filmot.includes("No results found")) {
                        console.log("No results found");
                    } else {
                        // Open a new window with filmot.com page
                        window.open(url_filmot);
                    }
                });
            } else {
                console.log('No <link rel="canonical"> found on the page.');
            }
        });
    }
 
    // Execute the main function
    main();
})();