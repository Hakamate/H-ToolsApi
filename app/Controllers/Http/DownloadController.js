'use strict'

const fs = require('fs');
const Helpers = use('Helpers');
const youtubedl = require('youtube-dl');
const path = require('path');
const util = require('util');
const http = require('http');
const urlYtb = 'https://www.youtube.com/watch?v=LJaCSPxDrSg'

class DownloadController {
    async download({ request, response }) {
        // response.setHeader('Content-Type', 'text/event-stream');
        console.log("cc")
        response.implicitEnd = false

        // const target = Helpers.publicPath("/music/" + "MISTER V - JAMAIS (feat. PLK)" + ".mp3")
        // response.download(target)

        let title = null
        const options = []
        var link = JSON.parse(request.raw()).URL

        const video = youtubedl(link, ["--format=bestaudio"], {cwd: __dirname});
        // const video = youtubedl(urlYtb, ["--format=bestaudio"], {cwd: __dirname});
       
        youtubedl.getInfo(urlYtb, options, function(err, info){
            if(err) throw err
            title = info.title
            const target = Helpers.publicPath("/music/" + title + ".mp3")
    
            video.pipe(
                fs.createWriteStream(target)
            )

            video.on('end', function() {
                console.log(title, ' finished downloading !')
                response.attachment(target, title)
            })
        })
    }
}

module.exports = DownloadController
