'use strict'

const fs = require('fs');
const Helpers = use('Helpers');
const youtubedl = require('youtube-dl');

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
        let title = null
        const options = []
        const req = request.all()
        var link = req.params.URL

        const video = youtubedl(link, ["--format=bestaudio"], {cwd: __dirname});
       
        youtubedl.getInfo(link, options, function(err, info){
            if(err) throw err
            title = info.title
            const target = Helpers.publicPath(title + ".mp3")
    
            video.pipe(
                fs.createWriteStream(target)
            )
            video.on('end', function() {
                console.log(title, ' finished downloading !')
                response.attachment(target)
              })
        })
    }
}

module.exports = DownloadController
