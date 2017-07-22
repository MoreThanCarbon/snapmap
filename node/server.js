var express = require('express'),
    snapmapSvr = express(),
    opn = require('opn'),
    co = require('co'),
    fill = require('@panosoft/pdf-form-fill'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.cached.Database('snapmapDB');

db.once('open', function(err) {
    if (err) return console.error(err);
    db.serialize(function() {
        db.run("DROP TABLE IF EXISTS degrees");
        db.run("DROP TABLE IF EXISTS courses");
        db.run("DROP TABLE IF EXISTS maps");
        var degreeTable = "CREATE TABLE IF NOT EXISTS degrees (name TEXT, units_req TEXT)";
        db.run(degreeTable);

        var courseTable = "CREATE TABLE IF NOT EXISTS courses (name TEXT, units TEXT)";
        db.run(courseTable);

        var mapsTable = "CREATE TABLE IF NOT EXISTS maps (";
        mapsTable += "degree_id INT, PTFT TEXT, college TEXT, units TEXT, ";
        for(var term = 1; term < 15; term++) {
            mapsTable += "t" + term + "_units TEXT, ";
            for(var course = 1; course < 7; course++) {
                mapsTable += "t" + term + "_c" + course + "_id INT, ";
                mapsTable += "t" + term + "_c" + course + "_name TEXT, ";
                mapsTable += "t" + term + "_c" + course + "_units TEXT, ";
                mapsTable += "t" + term + "_c" + course + "_milestone TEXT, ";
            }
        }
        mapsTable = mapsTable.substr(0, mapsTable.length - 2) + ")";
        db.run(mapsTable);
    });
});

// Client hosted
snapmapSvr.use(express.static('app'));
snapmapSvr.use(express.static('node_modules'));
snapmapSvr.use(express.static('systemjs'));
snapmapSvr.use(express.static('database'));
snapmapSvr.use('/rxjs', express.static('./node_modules/rxjs'));
snapmapSvr.use('/typescript', express.static('./node_modules/typescript'));

snapmapSvr.get('/', function (req, res) { res.sendFile('index.html'); });

snapmapSvr.get('/pdfFill/:degree/:map/:index', function(req, res) { 
    var degree = JSON.parse(decodeURIComponent(req.params.degree)),
        map = JSON.parse(decodeURIComponent(req.params.map)),
        index = req.params.index,
        title = ['FT (Below College Level)', 'PT (Below College Level)', 'FT (College Level)', 'PT (College Level)']
        sourcePDF = "./maps/Program Map _Template.pdf",
        destinationPDF =  "../../maps/" + degree.name + " - " + title[index] + ".pdf",
        data = {
            "degree" : degree.name,
            "map_units_req": degree.units_req + ' UNITS',
            "TOTAL UNITS": map.units
        };
        
        for(var term = 0; term < 14; term++) {
            data["TOTAL UNITS " + (term + 1)] = map.terms[term].units;
            for(var course = 0; course < 6; course++) {
                var c = (course + 1).toString(),
                    t = term > 0 ? "_" + (term + 1).toString() : "";
                data["COURSE " + c + t] = map.terms[term].courses[course].name;
                data["UNITS " + c + t] = map.terms[term].courses[course].units;
                data["MILESTONE " + c + t] = map.terms[term].courses[course].milestone == true ? "X" : "";
            }
        }
    co(function * () {
        const input = {
            formFile: fs.readFileSync(sourcePDF, 'base64'),
            formData: data
        };
        const output = yield fill(input); //=> Filled PDF Buffer 
        fs.writeFile(destinationPDF, output, () => {
            opn(destinationPDF);
        });
        res.json({ filename: destinationPDF});
    });
});


snapmapSvr.get('/db/degrees', function(req, res) {
    db.all("SELECT rowid as id, name, units_req FROM degrees", function(err, rows) {
        res.json(rows);
    });
});
snapmapSvr.get('/db/degree/insert/:degree', function(req, res) {
    var degree = JSON.parse(decodeURIComponent(req.params.degree));
    db.run("INSERT INTO degrees (name, units_req) VALUES (?, ?)", 
        [degree.name, degree.units_req],
        function(err) {
            if (!err)
                res.json(this.lastID);
        }
    ) 
});
snapmapSvr.get('/db/degree/update/:degree', function(req, res) {
    var degree = JSON.parse(decodeURIComponent(req.params.degree));
    db.run("UPDATE degrees SET name = ?, units_req = ? WHERE rowid = ?", 
        [degree.name, degree.units_req, degree.id],
        function(err) {
            if (!err)
                res.json(this.changes);
        }
    ) 
});

snapmapSvr.get('/db/courses', function(req, res) {
    db.all("SELECT rowid as id, name, units FROM courses", function(err, rows) {
        res.json(rows);
    }) 
});

snapmapSvr.get('/db/maps/:degreeId', function(req, res) {
    var degreeId = req.params.degreeId;
    db.all("SELECT rowid as id, * FROM maps WHERE degree_id = ? ORDER BY college, PTFT", degreeId, function(err, rows) {
        res.json(rows);
    }) 
});

snapmapSvr.get('/db/maps/save/:degree', function(req, res) {
    var degree = JSON.parse(decodeURIComponent(req.params.degree)),
        degrees = null, 
        courses = null;

    db.serialize(function() {
        var mapCols = "degree_id, PTFT, college, units, ",
            varis = "?, ?, ?, ?, ",
            PTFT = ["FT", "PT", "FT", "PT"],
            college = ["below", "below", "college", "college"],
            m = 0,
            newCourses = [];
        
        for(var term = 1; term < 15; term++) {
            mapCols += "t" + term + "_units, ";
            varis += "?, ";
            for(var course = 1; course < 7; course++) {
                mapCols += "t" + term + "_c" + course + "_id, ";
                mapCols += "t" + term + "_c" + course + "_name, ";
                mapCols += "t" + term + "_c" + course + "_units, ";
                mapCols += "t" + term + "_c" + course + "_milestone, ";
                varis += "?, ?, ?, ?, ";
            }
        }
        mapCols = mapCols.substr(0, mapCols.length - 2);
        varis = varis.substr(0, varis.length - 2);

        var newMap = db.prepare("INSERT INTO maps (" + mapCols + ") VALUES (" + varis + ")"),
            updateMap = db.prepare("UPDATE maps SET (" + mapCols + ") = (" + varis + ") WHERE rowid = ?"),
            newCourse = db.prepare("INSERT INTO courses (name, units) VALUES (?, ?)");

        degree.maps.forEach(map => {
            var fills = [degree.id];
            fills.push(PTFT[m]);
            fills.push(college[m]);
            fills.push(map.units);
            map.terms.forEach(term => {
                fills.push(term.units);
                term.courses.forEach(course => {
                    var courseId = course.id == -1 ? -2 : course.id;
                    if (course.id == -1 && course.name != '' && newCourses.indexOf(course.name) < 0) {
                        newCourses.push(course.name);
                        console.log(newCourses);
                        newCourse.run([course.name, course.units]);
                    }
                    fills.push(courseId);
                    fills.push(course.name);
                    fills.push(course.units);
                    fills.push(course.milestone);
                });
            });
            if (map.id > -1) {
                fills.push(map.id);
                updateMap.run(fills);
            }
            else {
                newMap.run(fills);
            }
            m++;
        });
        newMap.finalize();
        updateMap.finalize();
        newCourse.finalize();
        
        db.all("SELECT rowid as id, name, units_req FROM degrees", function(err, rows) {
            degrees = rows;
            db.all("SELECT rowid as id, name, units FROM courses", function(err, rows) {
                courses = rows;
                db.all("SELECT rowid as id, * FROM maps WHERE degree_id = ? ORDER BY college, PTFT", degree.id, function(err, rows) {
                    res.json({ maps: rows, degrees: degrees, courses: courses});
                }) 
            });
        });
    });
});
// require('./pdfFill')(app); 
// require('./pdfFormFill')(snapmapSvr); 

// Listener
var snapmap = snapmapSvr.listen(80, function () {
  var host = snapmapSvr.settings.env; //server.address().address;
  var port = snapmap.address().port;
  console.log('Snapmap starting, making maps a snap...', host, port);
  opn('http://localhost', {app: 'chrome'});
});