// import moment from 'https://momentjs.com/downloads/moment.js'

const requestHeaders = {
    headers: {
        'Ocp-Apim-Subscription-Key': atob(Bing_API_Key),
    },
};

// To get news-only search results, you'd send a GET request to the following endpoint:
// https://api.bing.microsoft.com/v7.0/news/search?q= {WHATEVER U QUERY}


function fetchNews(address_query){

    // If the user provided something like a strict street address, re-adjust string to query "city, state, country"
    let target_url;
    let address_to_s_array = address_query.split(" ");
    if (address_to_s_array.length > 3){
        let adjusted_query = address_to_s_array.slice(Math.max(address_to_s_array.length - 3, 1)).join(' ')
        target_url = 'https://api.bing.microsoft.com/v7.0/news/search?q=' + adjusted_query + "&originalImg=true";
    } else {
        target_url = 'https://api.bing.microsoft.com/v7.0/news/search?q=' + address_query + "&originalImg=true";
    }
    fetch(target_url, requestHeaders)
        .then((response) => response.json())
        .then((newsJSON) => {
            console.log(newsJSON)
            renderNewsArticles(newsJSON, address_query);
        })

}

// Apologies for the hard to read function... a lot of html elements are created here...

// This function will take in the JSON response from Bing News API and create HTML elements.
// The JSON response object contains an array of Articles in the '.value' key of the response.
// This method will iterate through each article located within the '.value' mapping and create
// a little "News Card Infographic" for each article.
function renderNewsArticles(articles_json, address_query){
    let num_of_articles = 0;
    let article_container = document.getElementById("articles-container");
    // Will clear previous news cards... maybe set up conditional
    // to not do this if cards are from the same address.
    article_container.innerHTML = '';
    articles_json.value.map((article, i) => {

        // This is a weird conditoinal I have to do for now... some articles do not have images... so currently
        // this method will only render all the available news cards with images available.
        if (article.hasOwnProperty('image') && article.provider[0].hasOwnProperty('image')){
            num_of_articles++;
            let source_provider_name = article.provider[0].name;
            let source_provider_img_url = article.provider[0].image.thumbnail.contentUrl;
            let article_title = article.name;
            let article_url = article.url;
            let article_img = article.image.contentUrl;
            let date_published = article.datePublished;
            let description = article.description;
    
            // Below the Dynamic HTML creation was inspired from Stack-Overflow implementation used to speed up execution.
            // https://stackoverflow.com/questions/5536596/dynamically-creating-html-elements-using-javascript
            let line_break = document.createElement("br");
            let Article_Card_Direct_Children_Elements = document.createDocumentFragment();

            // Creation of a new div which will display news for current Article.
            let Article_Card_Div = document.createElement("div");
            Article_Card_Div.setAttribute("id", i);
            Article_Card_Div.setAttribute("class", "NewsCard");
            
                // <Header> of the card
                let header_tree = document.createDocumentFragment();
                let card_header = document.createElement("header");
                card_header.setAttribute("class", "card-header");
    
                    // <img> png image of News Source
                    let source_provider_logo = document.createElement("img");
                    source_provider_logo.setAttribute("src", source_provider_img_url);
                    source_provider_logo.setAttribute("class", "source-provider-img");
    
                    // <h4> text representation of news source (CNN, FOX, etc...)
                    let article_provider = document.createElement("h4");
                    article_provider.setAttribute("class", "card-source-header")
                    article_provider.appendChild(document.createTextNode(source_provider_name));
    
                    // <a> Link to the Article
                    let link = document.createElement("a");
                    link.setAttribute("href", article_url);
                    link.setAttribute("target", "_blank");
                    link.setAttribute("rel", "noopener noreferrer");
                    link.appendChild(document.createTextNode("source (website)"));
                    
                header_tree.append(source_provider_logo, article_provider, link);
                card_header.appendChild(header_tree);
                //  </Header> End of Header

            // Adding <Header> to 'Article_Card_Div' 
            Article_Card_Direct_Children_Elements.appendChild(card_header);
    
                // <img> Article Image
                let article_image = document.createElement("img");
                article_image.setAttribute("src", article_img);
                article_image.setAttribute("class", "article-img");

                Article_Card_Direct_Children_Elements.appendChild(article_image);


            // Adding <img> (Article Image) to 'Article_Card_Div' 
            Article_Card_Direct_Children_Elements.appendChild(line_break);

                // <div> Container to display publish caption below Article img
                let img_caption_div = document.createElement("div");
                img_caption_div.setAttribute("class", "img-caption");
                    // <p> text representation of when Article was Published
                    let published_time = document.createElement("p");
                    let zulu_time_str = date_published;
                    // debugger
                    const dateTimeAgo = moment(zulu_time_str).fromNow();
                    published_time.setAttribute("class", "published-data");
                    published_time.appendChild(document.createTextNode("Published " + dateTimeAgo));
                
                img_caption_div.appendChild(published_time);
    
            //Adding <div> with publish information to 'Article_Card_Div' 
            Article_Card_Direct_Children_Elements.appendChild(img_caption_div);
                
                let card_body_children_tree = document.createDocumentFragment();
                // <div> Container for Article Title and Description
                let card_body_div = document.createElement("div");
                card_body_div.setAttribute("class", "card-body");
                    // <h2> Title
                    let article_title_tag = document.createElement("h2");
                    article_title_tag.setAttribute("class", "article-title");
                    article_title_tag.appendChild(document.createTextNode(article_title));
                    // <p> Short Description
                    let article_desc_tag = document.createElement("p");
                    article_desc_tag.setAttribute("class", "article-desc");
                    article_desc_tag.appendChild(document.createTextNode(description));
    
                card_body_children_tree.append(article_title_tag, article_desc_tag, line_break);
                card_body_div.appendChild(card_body_children_tree);
    
            // Adding <div> with Article Description and Title to 'Article_Card_Div'
            Article_Card_Direct_Children_Elements.appendChild(card_body_div);

            // End of HTML News Card for now.

            // We're at the very end so adding the Tree of Children elements to 'Article_Card_Div'
            Article_Card_Div.appendChild(Article_Card_Direct_Children_Elements);

            // Looking at the HTML template and adding this dynamically created news card to <div id="articles-container">
            document.getElementById("articles-container").appendChild(Article_Card_Div);

            //Repeat Process until we reach end of Articles Array.
        }
    })

    if (num_of_articles == 0){
        alert(
            "Bing News API, couldn't find News pertaining to\n\n\"" +
            address_query + '"\n\n' +
            "It might be better to search solely by the state and/or country for this location."
        )
    } else {
        const firstNewsCard = document.getElementsByClassName("NewsCard")[0];
        // For Chrome and FireFox
        if((navigator.userAgent.indexOf("Chrome") != -1 ) || (navigator.userAgent.indexOf("Firefox") != -1 )){
            const y = firstNewsCard.getBoundingClientRect().top + window.scrollY;
            window.scroll({
                top: y,
                behavior: 'smooth'
            })
        } else {
            // For IE, Edge and Safari
            firstNewsCard.scrollIntoView();
        }
    }
}
export {fetchNews}
