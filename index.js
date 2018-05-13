var gplay = require('google-play-scraper');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var categories = [
    'ANDROID_WEAR',
    'ART_AND_DESIGN',
    'AUTO_AND_VEHICLES',
    'BEAUTY',
    'BOOKS_AND_REFERENCE',
    'BUSINESS',
    'COMICS',
    'COMMUNICATION',
    'DATING',
    'EDUCATION',
    'ENTERTAINMENT',
    'EVENTS',
    'FINANCE',
    'FOOD_AND_DRINK',
    'HEALTH_AND_FITNESS',
    'HOUSE_AND_HOME',
    'LIBRARIES_AND_DEMO',
    'LIFESTYLE',
    'MAPS_AND_NAVIGATION',
    'MEDICAL',
    'MUSIC_AND_AUDIO',
    'NEWS_AND_MAGAZINES',
    'PARENTING',
    'PERSONALIZATION',
    'PHOTOGRAPHY',
    'PRODUCTIVITY',
    'SHOPPING',
    'SOCIAL',
    'SPORTS',
    'TOOLS',
    'TRAVEL_AND_LOCAL',
    'VIDEO_PLAYERS',
    'WEATHER',
    'GAME',
    'GAME_ACTION',
    'GAME_ADVENTURE',
    'GAME_ARCADE',
    'GAME_BOARD',
    'GAME_CARD',
    'GAME_CASINO',
    'GAME_CASUAL',
    'GAME_EDUCATIONAL',
    'GAME_MUSIC',
    'GAME_PUZZLE',
    'GAME_RACING',
    'GAME_ROLE_PLAYING',
    'GAME_SIMULATION',
    'GAME_SPORTS',
    'GAME_STRATEGY',
    'GAME_TRIVIA',
    'GAME_WORD',
    'FAMILY',
    'FAMILY_ACTION',
    'FAMILY_BRAINGAMES',
    'FAMILY_CREATE',
    'FAMILY_EDUCATION',
    'FAMILY_MUSICVIDEO',
    'FAMILY_PRETEND'
];

const THROTTLE = 10;
const DB_NAME = "google-play"

function scrapeApps(category, start){
    gplay.list({
        num: 100,
        start: start,
        category: category,
        throttle: THROTTLE
    }).then(function (result) {
        result.forEach(function (result) {
            gplay.permissions({appId: result.appId, throttle: THROTTLE}).then(function (value) {
                var object = {details: result, permission: value};
                saveToDatabase(object, category);
            });
        })
    });
}

function saveToDatabase(object, category){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection(category).insertOne(object, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

categories.forEach(function (object) {
    for (var i = 0; i <= 500; i += 100){
        scrapeApps(object, i);
    }
});