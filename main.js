const readline = require('readline');
const fetch = require('node-fetch');
const Spinner = require('cli-spinner').Spinner;

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
        //console.log(e);
        return "";
    }
}

const startSpinner = (title) => {
    let sp = new Spinner(title);
    sp.setSpinnerString(0);
    sp.start();
    return sp;
}

const showMessage = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Could you please write your name?: ", (name) => {
        rl.close();
        let sp = startSpinner(`Hi ${name}, we are finding your quote of the day...`);
    getRandomQuote()
        .then((quote) => {
            sp.stop();
            console.log(`\nYour quote of the day is: ${quote.content}`);
            console.log(`Author: ${quote.author}`);

            sp = startSpinner(`We are looking for some info about your quote of the day...`)
            const info = getAuthorWikipediaSites(quote.author)
                .then((sites) => {
                    sp.stop();
                    console.log("\nYou can learn about the author of your quote of the day in the next sites:");
                    sites.forEach((elem) => {
                        console.log(elem);
                    })
                })
        });
    }) 
}

showMessage();