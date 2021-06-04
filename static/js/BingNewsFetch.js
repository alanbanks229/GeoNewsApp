import {Bing_API_Key} from './api_keys.js'

const requestHeaders = {
    headers: {
        'Ocp-Apim-Subscription-Key': Bing_API_Key,
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
