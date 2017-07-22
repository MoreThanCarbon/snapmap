System.register(["@angular/core", "./snapmap.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, snapmap_service_1, degree, SnapMapComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (snapmap_service_1_1) {
                snapmap_service_1 = snapmap_service_1_1;
            }
        ],
        execute: function () {
            degree = (function () {
                function degree() {
                    this.id = -1;
                    this.maps = [];
                    for (var map = 0; map < 4; map++) {
                        var m = {
                            id: -1,
                            units: "",
                            terms: []
                        };
                        this.maps.push(m);
                        for (var term = 0; term < 14; term++) {
                            var t = {
                                units: "",
                                courses: []
                            };
                            m.terms.push(t);
                            for (var course = 0; course < 6; course++) {
                                var c = {
                                    id: -1,
                                    name: "",
                                    units: "",
                                    milestone: false
                                };
                                t.courses.push(c);
                            }
                        }
                    }
                }
                return degree;
            }());
            exports_1("degree", degree);
            SnapMapComponent = (function () {
                function SnapMapComponent(pdfService, dbService) {
                    var _this = this;
                    this.degreeSel = { id: -1, name: '', units_req: '' };
                    this.viewTypeahead = true;
                    this.pdfService = pdfService;
                    this.dbService = dbService;
                    this.degree = new degree();
                    this.degreeSel = { id: -1, name: '', units_req: '' };
                    this.dbService.degrees().subscribe(function (degrees) {
                        _this.degrees = degrees;
                    });
                    this.dbService.courses().subscribe(function (courses) {
                        _this.courses = courses;
                        console.log(_this.courses);
                    });
                }
                SnapMapComponent.prototype.nextTab = function (map, term, course, pos) {
                    var tabi = 2000 * (map + 1) + 100 * (term + 1) + 10 * (course + 1) + pos;
                    return tabi.toString();
                };
                SnapMapComponent.prototype.unitsChange = function (x) {
                    clearTimeout(this.timeoutRef);
                    var myThis = this;
                    this.timeoutRef = setTimeout(function () {
                        var map = myThis.degree.maps[x], mmin = 0, mmax = 0;
                        for (var term = 0; term < 14; term++) {
                            var tmin = 0, tmax = 0;
                            for (var course = 0; course < 6; course++) {
                                var units = map.terms[term].courses[course].units, cmin = 0, cmax = 0;
                                if (units.toString().indexOf('-') > 0) {
                                    var u = units.split('-');
                                    cmin = parseFloat(u[0].trim());
                                    cmax = parseFloat(u[1].trim());
                                    map.terms[term].courses[course].units = u[0].trim() + ' - ' + u[1].trim();
                                }
                                else if (units.toString() == '')
                                    null;
                                else {
                                    cmin = parseFloat(units.toString().trim());
                                    cmax = parseFloat(units.toString().trim());
                                    if (cmin == 0)
                                        map.terms[term].courses[course].units = '';
                                }
                                tmin += cmin;
                                tmax += cmax;
                            }
                            if (tmin == tmax)
                                map.terms[term].units = tmin.toString();
                            else
                                map.terms[term].units = tmin.toString() + ' - ' + tmax.toString();
                            mmin += tmin;
                            mmax += tmax;
                        }
                        if (mmin == mmax)
                            map.units = mmin.toString();
                        else
                            map.units = mmin.toString() + ' - ' + mmax.toString();
                    }, 300);
                };
                SnapMapComponent.prototype.onDrop = function (to, from) {
                    if (to[0] == from[0] && to[1] == from[1] && to[2] == from[2])
                        return;
                    var fromCourse = this.degree.maps[from[0]].terms[from[1]].courses[from[2]], toCourse = this.degree.maps[to[0]].terms[to[1]].courses[to[2]];
                    toCourse.name = fromCourse.name;
                    toCourse.units = fromCourse.units;
                    toCourse.milestone = fromCourse.milestone;
                    if (from[0] == to[0]) {
                        fromCourse.name = "";
                        fromCourse.units = "";
                        fromCourse.milestone = false;
                    }
                    this.unitsChange(to[0]);
                };
                SnapMapComponent.prototype.print = function (x) {
                    this.pdfService.get(this.degreeSel.name, this.degree.maps[x], x).subscribe(function (data) {
                    });
                };
                SnapMapComponent.prototype.courseSelected = function (course, typed) {
                    if (typed !== null && typed !== '')
                        console.log(course, typed);
                    if (typed != null && typed.name) {
                        this.degree.maps[course[0]].terms[course[1]].courses[course[2]].id = typed.id;
                        this.degree.maps[course[0]].terms[course[1]].courses[course[2]].name = typed.name;
                        this.degree.maps[course[0]].terms[course[1]].courses[course[2]].units = typed.units;
                        this.unitsChange(course[0]);
                    }
                    else {
                        if (this.degree.maps[course[0]].terms[course[1]].courses[course[2]].name !== typed)
                            this.degree.maps[course[0]].terms[course[1]].courses[course[2]].id = -1;
                        this.degree.maps[course[0]].terms[course[1]].courses[course[2]].name = typed;
                    }
                };
                SnapMapComponent.prototype.degreeSelected = function (degree) {
                    var _this = this;
                    if (degree && degree.id) {
                        this.degreeSel = degree;
                        this.degree.id = degree.id;
                        this.dbService.maps(this.degreeSel).subscribe(function (data) {
                            console.log(data);
                            if (!data.length)
                                return;
                            for (var map = 0; map < 4; map++) {
                                _this.degree.maps[map].id = data[map].id;
                                _this.degree.maps[map].units = data[map].units;
                                for (var term = 1; term < 15; term++) {
                                    _this.degree.maps[map].terms[term - 1].units = data[map]["t" + term + "_units"];
                                    for (var course = 1; course < 7; course++) {
                                        _this.degree.maps[map].terms[term - 1].courses[course - 1].id = data[map]["t" + term + "_c" + course + "_id"];
                                        _this.degree.maps[map].terms[term - 1].courses[course - 1].name = data[map]["t" + term + "_c" + course + "_name"];
                                        _this.degree.maps[map].terms[term - 1].courses[course - 1].units = data[map]["t" + term + "_c" + course + "_units"];
                                        _this.degree.maps[map].terms[term - 1].courses[course - 1].milestone = data[map]["t" + term + "_c" + course + "_milestone"] == 0 ? false : true;
                                    }
                                }
                            }
                        });
                        this.viewTypeahead = true;
                        this.disableTypeahead = true;
                    }
                    else {
                        this.degreeSel.name = degree;
                    }
                };
                SnapMapComponent.prototype.newDegree = function () {
                    this.degreeSel = { id: -1, name: '', units_req: '' };
                    this.degree = new degree();
                    this.viewTypeahead = true;
                    this.disableTypeahead = false;
                };
                SnapMapComponent.prototype.editDegree = function () {
                    this.disableTypeahead = false;
                    this.viewTypeahead = false;
                };
                SnapMapComponent.prototype.saveDegree = function () {
                    var _this = this;
                    this.viewTypeahead = true;
                    this.disableTypeahead = true;
                    this.dbService.updateDegree(this.degreeSel).subscribe(function (data) {
                        if (_this.degreeSel.id == -1) {
                            _this.degreeSel.id = data;
                            _this.degree.id = data;
                        }
                    }, function (e) {
                    }, function () {
                        _this.dbService.saveMaps(_this.degree).subscribe(function (data) {
                            for (var map = 0; map < 4; map++) {
                                _this.degree.maps[map].id = data.maps[map].id;
                                for (var term = 1; term < 15; term++) {
                                    for (var course = 1; course < 7; course++) {
                                        _this.degree.maps[map].terms[term - 1].courses[course - 1].id = data.maps[map]["t" + term + "_c" + course + "_id"];
                                    }
                                }
                            }
                            _this.degrees = data.degrees;
                            _this.courses = data.courses;
                            console.log('data', data);
                        }, function (err) {
                        }, function () {
                        });
                    });
                };
                SnapMapComponent.prototype.ngAfterViewInit = function () {
                };
                return SnapMapComponent;
            }());
            SnapMapComponent = __decorate([
                core_1.Component({
                    selector: 'snapmap',
                    encapsulation: core_1.ViewEncapsulation.None,
                    templateUrl: './snapmap.component.html',
                    styleUrls: ['./snapmap.component.css']
                }),
                __metadata("design:paramtypes", [snapmap_service_1.PdfService, snapmap_service_1.DbService])
            ], SnapMapComponent);
            exports_1("SnapMapComponent", SnapMapComponent);
        }
    };
});
