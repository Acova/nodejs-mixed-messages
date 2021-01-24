const readline = require('readline');
const fetch = require('node-fetch');

const getUserInput = (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('¿Podrías facilitar tu nombre?: ', (name) => {
        console.log(`Tu nombre es ${name}`);

        rl.close();
    })   
}

const getRandomQuote = async () => {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    return data;
}

const getCurrentHour = () => {
    const date = new Date();
    return date.getHours();
}

const getAuthorWikipediaSites = async (author) => {
    const authorResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${author}&format=json`);
    const authorData = await authorResponse.json();
    const results = authorData.query.search;
    let sites = [];
    
    for(let i = 0; i < results.length; i++) {
        let url = await (getWikipediaSiteUrl(results[i].pageid));
        sites.push(url);
    }    
    return sites;
}

const getWikipediaSiteUrl = async (siteId) => {
    try {
        const siteResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&pageids=${siteId}&format=json`);
        const siteData = await siteResponse.json();
        return siteData.query.pages[`${siteId}`].canonicalurl
    } catch (e) {
        console.log(e);
        return "";
    }
}

getAuthorWikipediaSites('Malcom X')
    .then((sites) => {
        console.log(sites);
    })