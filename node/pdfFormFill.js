var express = require('express'),
    fillSvr = express(),
    opn = require('opn');
const co = require('co');
const fill = require('@panosoft/pdf-form-fill');
const fs = require('fs');

fillSvr.get('/:map', function(req, res) { 
    var map = JSON.parse(decodeURIComponent(req.params.map)),
        sourcePDF = "./maps/Program Map _Template.pdf",
        destinationPDF =  "./maps/test_complete.pdf",
        data = {
            "degree" : "BS in BS",
            "map_units_req": "60"
        };
    co(function * () {
        const input = {
            formFile: fs.readFileSync(sourcePDF, 'base64'),
            formData: data
        };
        const output = yield fill(input); //=> Filled PDF Buffer 
        fs.writeFileSync(destinationPDF, output).then( function () {
            opn(destinationPDF);
        });
    });
});

module.exports = function(app) {
    app.use('/pdfFill', fillSvr);
};