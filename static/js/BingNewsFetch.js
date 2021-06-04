
//Look at X-Search-Location query parameter... instead of hardcoding the string 'Potomac, MD' Bing's news search API can give me local news given coordinates.

// This file is just used for a reference to make the fetch calls I will use in the app

const api = 'a743e8ea9e8749089234756f0681648a';
const requestHeaders = {
    headers: {
        'Ocp-Apim-Subscription-Key': api,

        // Below is an optional header X-Search-Location... we may not need this...

        // potomac MD coordinates   re=radius
        // 'X-Search-Location': {lat: 39.0182, long: 77.2086, re:100}
    },
};

// To get news-only search results, you'd send a GET request to the following endpoint:
// https://api.bing.microsoft.com/v7.0/news/search?q= {WHATEVER U QUERY}


function fetchNews(formatted_address){

    let target_url = 'https://api.bing.microsoft.com/v7.0/news/search?q=' + formatted_address;
    fetch(target_url, requestHeaders)
        .then((response) => response.json())
        .then((newsJSON) => console.log(newsJSON))

}

var wut = "wut";

export {fetchNews}
