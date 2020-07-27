'use strict'

const fs = require('fs');
const path = require('path');
const util = require('util');
const Helpers = use('Helpers');
const http = require('http')
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
        // response.setHeader('Content-Type', 'text/event-stream');
        console.log("cc")
        response.implicitEnd = false

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
                // response.send(target)
                fs.readFile(target, (error, contents) => {
                    response.send(contents)
                  })

                // http.createServer(function(request, response) {
                //     var filePath = target;
                //     var stat = fs.statSync(filePath);
                
                //     response.writeHead(200, {
                //         'Content-Type': 'audio/mpeg',
                //         'Content-Length': stat.size
                //     });
                
                //     var readStream = fs.createReadStream(filePath);
                //     readStream.pipe(response);
                // })
                // .listen(2000);
            })
        })
    }
}

module.exports = DownloadController
