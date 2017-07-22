var pdfFiller = require('pdffiller'),
    express = require('express'),
    fillSvr = express();
fillSvr.get('/:map', function(req, res) { 
    var map = JSON.parse(decodeURIComponent(req.params.map)),
        shouldFlatten = false,
        sourcePDF = "./maps/Program Map _Template.pdf",
        destinationPDF =  "./maps/test_complete.pdf",
        data = {
            "degree" : "BS in BS",
            "map_units_req": "60"
        };
    
    pdfFiller.fillFormWithFlatten( sourcePDF, destinationPDF, data, shouldFlatten, function(err) {
        if (err) throw err;
        console.log("In callback (we're done).");
        opn(destinationPDF);
    });
});
module.exports = function(app) {
    app.use('/pdfFill', dbSvr);
};