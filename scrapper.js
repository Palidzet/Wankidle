const axios = require('axios');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

async function get_channel() {
    let url = new URL('https://www.googleapis.com/youtube/v3/channels');
    url.searchParams.set("key", "AIzaSyAROx6KsHoHO3pUyX9uaZlcEOkQFS4-238")
    url.searchParams.set("part", "contentDetails")
    url.searchParams.set("id", "UCYGjxo5ifuhnmvhPvCc3DJQ")
    axios.get(url.toString())
        .then((response) => {
            console.log(response.data.items[0].contentDetails.relatedPlaylists.uploads);
        })
        .catch((error) => {
            console.error(error);
        });
}

async function get_videos_list(pageToken) {
    let url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set("key", "AIzaSyAROx6KsHoHO3pUyX9uaZlcEOkQFS4-238")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("playlistId", "UUYGjxo5ifuhnmvhPvCc3DJQ")
    url.searchParams.set("maxResults", "50")
    if (pageToken !== "")
        url.searchParams.set("pageToken", pageToken)
    await axios.get(url.toString())
        .then(async (response) => {
            for (let i of response.data.items) {
                count += 1;
                console.log(count);
                let id = i.snippet.resourceId.videoId
                let url_video = new URL('https://www.googleapis.com/youtube/v3/videos');
                url_video.searchParams.set("key", "AIzaSyAROx6KsHoHO3pUyX9uaZlcEOkQFS4-238")
                url_video.searchParams.set("part", "snippet,contentDetails,statistics")
                url_video.searchParams.set("id", id)
                await axios.get(url_video.toString())
                    .then((response) => {
                        let num = count;
                        let title = response.data.items[0].snippet.title;
                        let vues = response.data.items[0].statistics.viewCount;
                        let date = response.data.items[0].snippet.publishedAt;
                        let duration = response.data.items[0].contentDetails.duration;
                        let miniature = "Not found";
                        try {
                            miniature = response.data.items[0].snippet.thumbnails.standard.url
                        } catch (e) {
                            miniature = response.data.items[0].snippet.thumbnails.high.url
                        }
                        total.push({
                            num: count,
                            id: id,
                            title: title,
                            views: vues,
                            date: date,
                            duration: duration,
                            miniature: miniature
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            if (response.data.nextPageToken === undefined)
                return;
            await get_videos_list(response.data.nextPageToken);
        })
        .catch((error) => {
            console.error(error);
        });
}

/*let total = [];
let count = 0;
(async () => {
    await get_videos_list("");
    fs.writeFile("./video_id.json", JSON.stringify(total), 'utf-8', (err) => {
        if (err)
            console.log(err);
        else
            console.log("file saved");
    })
    console.log(total);
})()*/

// Read the data from the JSON file
let rawdata = fs.readFileSync('video_id.json');
let data = JSON.parse(rawdata);

// Open a connection to the SQLite database
let db = new sqlite3.Database("./Wankidle/db.sqlite3", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(rows);
});
// Iterate over the JSON data and insert each item into the database
data.forEach(item => {
    let regex_game = /^.*\((.*)\).*$/;
    let game = regex_game.test(item.title);
    let match = regex_game.exec(item.title);
    let game_title = match ? match[1] : null;
    let regex_feat = new RegExp('^.*ft\..*$');
    let feat = regex_feat.test(item.title);


    db.run(`INSERT INTO main_database ("index", video_id, title, pub_date, views, duration, miniature, game, game_title, feat,
                                  feat_members, irl_face_none)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?)`, [item.num, item.id, item.title, item.date, item.views, item.duration, item.miniature, game, game_title, feat, null, "No cam"], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});

// Close the connection to the database
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});


