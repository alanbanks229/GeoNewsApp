

function parseNewsJSON (jsonfile){    
    
    //Currently just saves the first articles title and url to variables and prints them to console for debugging purposes.
    console.log(jsonfile.value[0].name);
    var newsArticle = jsonfile.value[0].name;

    console.log(jsonfile.value[0].url);
    var articleURL = jsonfile.value[0].url;

}

export{parseNewsJSON}