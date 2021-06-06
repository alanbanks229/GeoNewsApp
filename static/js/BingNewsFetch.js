import {Bing_API_Key} from './api_keys.js'

// will hold the current state of API fetch call that was returned.
let articles_json;

const requestHeaders = {
    headers: {
        'Ocp-Apim-Subscription-Key': Bing_API_Key,
    },
};

// To get news-only search results, you'd send a GET request to the following endpoint:
// https://api.bing.microsoft.com/v7.0/news/search?q= {WHATEVER U QUERY}


function fetchNews(formatted_address){

    let target_url = 'https://api.bing.microsoft.com/v7.0/news/search?q=' + formatted_address + "&originalImg=true";
    fetch(target_url, requestHeaders)
        .then((response) => response.json())
        .then((newsJSON) => {
            console.log(newsJSON)
            articles_json = newsJSON;
            renderNewsCard(newsJSON);
        })

}

function renderNewsCard(articles_json){
    let article_container = document.getElementById("articles-container");
    // Will clear previous news cards... maybe set up conditional
    // to not do this if cards are from the same address.
    article_container.innerHTML = '';
    articles_json.value.map((article, i) => {
        if (article.hasOwnProperty('image') && article.provider[0].hasOwnProperty('image')){
            let source_provider_name = article.provider[0].name;
            let source_provider_img_url = article.provider[0].image.thumbnail.contentUrl;
            let article_title = article.name;
            let article_url = article.url;
            let article_img = article.image.contentUrl;
            let date_published = article.datePublished;
            let description = article.description;
            // let article = article;
            // let id = i;
    
            // https://stackoverflow.com/questions/5536596/dynamically-creating-html-elements-using-javascript
            let line_break = document.createElement("br");
            let parent_div_direct_children_tree = document.createDocumentFragment();
            // Parent/Outermost Div:
            let parent_div = document.createElement("div");
            parent_div.setAttribute("id", i);
            parent_div.setAttribute("class", "NewsCard");
            
                let header_tree = document.createDocumentFragment();
                // Header tag for Card.
                let card_header = document.createElement("header");
                card_header.setAttribute("class", "card-header");
    
                    //Image source for provider of article
                    let source_provider_logo = document.createElement("img");
                    source_provider_logo.setAttribute("src", source_provider_img_url);
                    source_provider_logo.setAttribute("class", "source-provider-img");
    
                    // <h4> This holds the value of wherever the Article came from. CNN, Fox, etc..
                    let article_provider = document.createElement("h4");
                    article_provider.setAttribute("class", "card-source-header")
                    // Assigns text value of html element to be whatever the News Source is.
                    article_provider.appendChild(document.createTextNode(source_provider_name));
    
                    // Link to article
                    let link = document.createElement("a");
                    link.setAttribute("href", article_url);
                    link.setAttribute("target", "_blank");
                    link.setAttribute("rel", "noopener noreferrer");
                    link.appendChild(document.createTextNode("source (website)"));
    
                header_tree.append(source_provider_logo, article_provider, link);
                card_header.appendChild(header_tree);
    
                parent_div_direct_children_tree.appendChild(card_header);
    
                if (article_img) {
                    //Article Image if available
                    let article_image = document.createElement("img");
                    article_image.setAttribute("src", article_img);
                    article_image.setAttribute("class", "article-img");
                    parent_div_direct_children_tree.appendChild(article_image);
                }
                parent_div_direct_children_tree.appendChild(line_break);
                
                let img_caption_div = document.createElement("div");
                // not sure why i called it img_caption... look at old code.
                img_caption_div.setAttribute("class", "img-caption");
                    let published_time = document.createElement("p");
                    published_time.setAttribute("class", "published-data");
                    published_time.appendChild(document.createTextNode("Published " + date_published));
                img_caption_div.appendChild(published_time);
    
                parent_div_direct_children_tree.appendChild(img_caption_div);
                
                let card_body_children_tree = document.createDocumentFragment();
                let card_body_div = document.createElement("div");
                card_body_div.setAttribute("class", "card-body");
                    let article_title_tag = document.createElement("h2");
                    article_title_tag.setAttribute("class", "article-title");
                    article_title_tag.appendChild(document.createTextNode(article_title));
                    let article_desc_tag = document.createElement("p");
                    article_desc_tag.setAttribute("class", "article-desc");
                    article_desc_tag.appendChild(document.createTextNode(description));
    
                    card_body_children_tree.append(article_title_tag, article_desc_tag, line_break);
                card_body_div.appendChild(card_body_children_tree);
    
                parent_div_direct_children_tree.appendChild(card_body_div);
                // At the very end....
                parent_div.appendChild(parent_div_direct_children_tree);
                console.log("ayo wtf -->\n" + parent_div)
                document.getElementById("articles-container").appendChild(parent_div);
        }
    })
}

export {fetchNews}
