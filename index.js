const PORT = process.env.PORT||8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const newspapers = [
  {
    name: "NY Times",
    address:
      "https://www.nytimes.com/search?dropmab=true&query=Cryptocurrency%2C%20bitcoin%2C%20blockchain&sort=new",
    base: "https://www.nytimes.com",
  },
  {
    name: "India Today",
    address: "https://www.indiatoday.in/topic/blockchain",
    base: "",
  },
  {
    name: "Indian Express",
    address: "https://indianexpress.com/?s=blockchain",
    base: "",
  },
  {
    name: "Business Standard",
    address: "https://www.business-standard.com/search?q=blockchain",
    base: "",
  },
  {
    name: "The Hindu",
    address: "https://www.thehindu.com/sci-tech/technology/internet/",
    base: "",
  },
  {
    name: "NDTV",
    address: "https://www.ndtv.com/topic/web3",
    base: "",
  },
  {
    name: "Coin Desk",
    address: "https://www.coindesk.com/tech/",
    base: "https://www.coindesk.com",
  },
  {
    name: "Times of India",
    address: "https://timesofindia.indiatimes.com/business/cryptocurrency",
    base: "",
  },
  {
    name: "BBC",
    address: "https://www.bbc.co.uk/search?q=blockchain",
    base: "",
  },
  {
    name: "The Wall Street Journal",
    address: "https://www.wsj.com/search?query=blockchain",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const data = response.data;
      const $ = cheerio.load(data);

      $(
        'a:contains("Bitcoin"),a:contains("Web3"),a:contains("web 3"),a:contains("web 3.0"),a:contains("Web 3"),a:contains("Web 3.0"),a:contains("Crypto"),a:contains("NFT"),a:contains("blockchain"),a:contains("Blockchain")',
        data
      ).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        const img = $(this).parent().parent().parent().find("img").attr("src");
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
          img,
        });
      });
    })
    .catch((err) => console.error(err));
});

const app = express();

app.get("/", (req, res) => {
  res.json(`Welcome to my api use /news to get all news`);
});
app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaper_id", (req, res) => {
  const newspaperId = req.params.newspaper_id;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const data = response.data;
      const $ = cheerio.load(data);
      const specificArticle = [];

      $(
        'a:contains("Bitcoin"),a:contains("Web3"),a:contains("web 3"),a:contains("web 3.0"),a:contains("Web 3"),a:contains("Web 3.0"),a:contains("Crypto"),a:contains("NFT"),a:contains("blockchain"),a:contains("Blockchain")',
        data
      ).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        const img = $(this).parent().parent().parent().find("img").attr("src");
        specificArticle.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
          img,
        });
      });
      res.json(specificArticle);
    })
    .catch((err) => console.error(err));
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
