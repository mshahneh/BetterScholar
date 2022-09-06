const SerpApi = require('google-search-results-nodejs');
const express = require("express");
var cors = require('cors')
const mongo = require('mongodb');
var schedule = require('node-schedule');
const app = express();
const mongoose = require("mongoose");
const search = new SerpApi.GoogleSearch("c96a1f075b4185fb4ff9388cb81ef3e07e0e7dfa83cb1790a7b8356de1fff209");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { url, uri } = require('./config/mongodb.js');
const dbname = "citeTracker";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.use(express.json());
app.use(cors())


const params = {
  engine: "google_scholar_author",
  hl: "en",
  author_id: undefined,
  start: "0",
  num: "100",
  sort: "pubdate"
};

////create mongodb database
// MongoClient.connect(uri, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

//// create people collection
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(dbname);
//   dbo.createCollection("people", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

// // create articles collection
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db(dbname);
//   dbo.createCollection("articles", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });


//calculate contribution score for each author
function getContributions(articles) {
  let sum = 0
  for (let i = 0; i < articles.length; i++) {
    let authors = articles[i].authors;
    authors = authors.split(",");
    sum += 1 / authors.length;
  }
  return sum;
}

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db(dbname);
  dbo.collection("people").find({}).toArray(function (err, result) {
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      author_id = result[i].id;
      // console.log("author id", author_id);
    }
    db.close();
  });
});


function getPeople() {
  return new Promise(function (myResolve, myReject) {
    MongoClient.connect(url, function (err, db) {
      if (err) myReject(err);;
      // console.log("and here");
      var dbo = db.db(dbname);
      dbo.collection("people").find({}).toArray(function (err, result) {
        if (err) myReject(err);;
        db.close();
        // console.log(result)
        myResolve(result);
      });
    });
  });
}

function updateDataset(data, res) {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbname);
    let articleObject;

    //update articles collection
    dbo.collection("articles").find({ "id": data.search_parameters.author_id }).toArray(function (err, result) {
      if (err) throw err;
      articleObject = result[0];

      //if the author has no cites, create a new cite object
      if (result.length == 0) {
        articleObject = {
          "id": data.search_parameters.author_id,
          "articles": data.articles
        }
      }
      //if the author has cites, update the cite object
      else {

        //update articles
        for (let i = 0; i < data.articles.length; i++) {
          let article = data.articles[i];
          let articleFound = false;
          for (let j = 0; j < articleObject.articles.length; j++) {
            let oldArticle = articleObject.articles[j];
            if (oldArticle.citation_id == article.citation_id) {
              articleFound = true;
              articleObject.articles[j].cited_by = article.cited_by;
              break;
            }
          }
          if (!articleFound) {
            articleObject.articles.push(article);
          }
        }
      }
      dbo.collection("articles").replaceOne({ "id": data.search_parameters.author_id }, articleObject, { upsert: true })
      // console.log("fiexed articles object");
    });


    //update people
    dbo.collection("people").find({ "id": data.search_parameters.author_id }).toArray(function (err, result) {
      let peopleObj = result[0];

      if (result.length == 0) {
        detailedObj = [];
        cites = data.cited_by.table[0].citations.all;
        detailedObj.push({
          "date": Date.now(),
          "cites": data.cited_by.table[0].citations.all,
          "total_papers": articleObject.articles.length,
          "h_index": data.cited_by.table[1].h_index.all,
          "contributions": getContributions(articleObject.articles),
        });
        cites -= data.cited_by.graph[data.cited_by.graph.length - 1].citations;

        for (let i = data.cited_by.graph.length - 2; i >= 0; i--) {
          detailedObj.unshift({
            "date": (new Date(data.cited_by.graph[i].year, 11, 31)).getTime(),
            "cites": cites
          })
          cites -= data.cited_by.graph[i].citations
        }

        peopleObj = {
          "name": data.author.name,
          "id": data.search_parameters.author_id,
          "picture": data.author.thumbnail,
          "detailed": detailedObj
        };
      }
      else {
        //update detailed
        // console.log("in else!")
        peopleObj["detailed"].push({
          "date": Date.now(),
          "cites": data.cited_by.table[0].citations.all,
          "total_papers": articleObject.articles.length,
          "h_index": data.cited_by.table[1].h_index.all,
          "contributions": getContributions(articleObject.articles),
        });
        // console.log("updated peopleOBj", peopleObj)
      }
      dbo.collection("people").replaceOne({ "id": data.search_parameters.author_id }, peopleObj, { upsert: true })
      // console.log("fiexed people object");
    });

    if (res !== undefined) {
      getPeople().then(value => res.send(value));
    }
  });

}


app.get('/api/adduser/:username', function (req, res) {
  let tempParams = params;
  tempParams.author_id = req.params.username;


  const callback = function (data) {
    updateDataset(data, res);
  };
  search.json(tempParams, callback);
})



app.get('/api/users', function (req, res) {
  // console.log("here");
  getPeople().then(value => res.send(value))
})

app.get('/api/publications/:username', function (req, res) {
  // console.log("in get publications");
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbname);
    let articleObject;

    //update articles collection
    dbo.collection("articles").find({ "id": req.params.username }).toArray(function (err, result) {
      if (err) console.log(err);
      // console.log(result)
      db.close();
      res.send(result);
    })

  });
})


var rule = new schedule.RecurrenceRule();
rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
rule.date = [6, 21];
rule.hour = 1;
rule.minute = 0;
rule.second = 0;

var j = schedule.scheduleJob(rule, function () {
  // console.log("in schedule")
  getPeople().then(authors => {
    for (let i = 0; i < authors.length; i++) {
      // console.log(authors[i].id + " " + authors[i].name)
      let tempParams = params;
      tempParams.author_id = authors[i].id;


      const callback = function (data) {
        updateDataset(data, undefined);
      };
      search.json(tempParams, callback);
    }
  })
});

var port = 3007
app.listen(port, () => console.log(`Listening on ws://localhost:${port}`));
