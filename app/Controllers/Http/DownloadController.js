'use strict'

class DownloadController {
    async getMP4({request, response}) {
        const req = request.all()
        var getURL = req.params.URL
        console.log(getURL)
        return response.json({url:getURL});
    }
    async test({request, response}){
        console.log('hello')
        return 'hello'
    }
}

module.exports = DownloadController
