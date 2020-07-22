'use strict'

const fs = require('fs');
const path = require('path');
const https = require('https');
const ytdl = require('ytdl-core');
const id = 'https://www.youtube.com/watch?v=QRS8MkLhQmM';
const lang = 'en';

class DownloadController {
    async getMP4({ request, response }) {
        const req = request.all()
        var getURL = req.params.URL
        console.log(getURL)
        return response.json({ url: getURL });
    }
    async test({ request, response }) {
        console.log('hello')
        return 'hello'
    }



    getData(link) {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(link, function (err, info) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        });
    }

    download({ request, response }) {
        const req = request.all()
        var link = req.params.URL

        // // const target = Helpers.publicPath('video.mp4')
        // const target = 'video.mp4'
        // try {
        //     ytdl.filterFormats(info.formats, 'audioonly');

        //     var stream = ytdl(link)
        //         .pipe(
        //             fs.createWriteStream(target)
        //         );

        //     response.implicitEnd = false
        //     stream.on('finish', function () {
        //         response.attachment(target, "test" + '.mp4')
        //     });
        // } catch (error) {
        //     return "test non working"
        // }




        console.log("gelo")

        ytdl.getInfo(link)
        .catch(error => {console.log("errorrrrrrrrrrrrrrrrrrrrrrr"); return error})
        .then(info => {
            const tracks = info
                .player_response.captions
                .playerCaptionsTracklistRenderer.captionTracks;
            if (tracks && tracks.length) {
                console.log('Found captions for',
                    tracks.map(t => t.name.simpleText).join(', '));
                const track = tracks.find(t => t.languageCode === lang);
                if (track) {
                    console.log('Retrieving captions:', track.name.simpleText);
                    console.log('URL', track.baseUrl);
                    const output = `${info.videoDetails.title}.${track.languageCode}.xml`;
                    console.log('Saving to', output);
                    https.get(track.baseUrl, res => {
                        res.pipe(fs.createWriteStream(path.resolve(__dirname, output)));
                    });
console.log(path.resolve(__dirname, output))
                    response.implicitEnd = false
        //     stream.on('finish', function () {
        //         response.attachment(path.resolve(__dirname, output), "test" + '.mp4')
        //     });
                } else {
                    console.log('Could not find captions for', lang);
                }
            } else {
                console.log('No captions found for this video');
            }
        });


    }
}

module.exports = DownloadController
