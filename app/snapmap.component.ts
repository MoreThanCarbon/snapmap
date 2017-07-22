import { Component, AfterViewInit, ViewEncapsulation, 
    ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
// import { localStorageDB as ldb } from 'localstoragedb';
import { PdfService, DbService } from './snapmap.service';

export interface course {
    id: number,
    name: string,
    units: string,
    milestone: boolean
}
export interface term {
    courses: course[],
    units: string
}
export interface map {
    id: number,
    terms: term[],
    units: string
}
export interface idegree {
    id: number,
    maps:map[]
}
export class degree implements idegree {
    id: number = -1;
    maps:map[];
    constructor() {
        this.maps = [];
        for(var map = 0; map < 4; map++) {
            var m = {
                id: -1,
                units: "",
                terms: []
            }
            this.maps.push(m);
            for(var term = 0; term < 14; term++) {
                var t = {
                    units: "",
                    courses: []
                }
                m.terms.push(t);
                for(var course = 0; course < 6; course++) {
                    var c = {
                        id: -1,
                        name: "",
                        units: "",
                        milestone: false
                    }
                    t.courses.push(c);
                }
            }
        }
    }
}

@Component({
    selector: 'snapmap',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './snapmap.component.html',
    styleUrls: ['./snapmap.component.css']
})
export class SnapMapComponent {
    degree: degree;
    degreeSel: any = {id:-1, name: '', units_req: ''};
    pdfService: PdfService;
    dbService: DbService;
    degrees: any;
    courses: any;
    viewTypeahead: boolean = true;
    disableTypeahead: boolean;


    constructor(pdfService: PdfService, dbService: DbService) {
        this.pdfService = pdfService;
        this.dbService = dbService;
        this.degree = new degree();
        this.degreeSel = {id:-1, name: '', units_req: ''};
        this.dbService.degrees().subscribe(degrees => {
            this.degrees = degrees;
        });
        
        this.dbService.courses().subscribe(courses => {
            this.courses = courses;
            console.log(this.courses);
        });
    }

    nextTab(map, term, course, pos): string {
        var tabi = 2000 * (map + 1) + 100 * (term + 1) + 10 * (course + 1) + pos;
        return tabi.toString();
    }

    timeoutRef: any;
    unitsChange(x) {
        clearTimeout(this.timeoutRef);
        let myThis = this;
        this.timeoutRef = setTimeout(function() {
            let map = myThis.degree.maps[x],
                mmin = 0,
                mmax = 0;
            for(var term = 0; term < 14; term++) {
                let tmin = 0,
                    tmax = 0;
                for(var course = 0; course < 6; course++) {
                    let units = map.terms[term].courses[course].units,
                        cmin = 0,
                        cmax = 0;
                    if (units.toString().indexOf('-') > 0) {
                        let u = units.split('-');
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
    }
    
    onDrop(to, from) {
        if(to[0] == from[0] && to[1] == from[1] && to[2] == from[2])
            return;
        let fromCourse = this.degree.maps[from[0]].terms[from[1]].courses[from[2]],
            toCourse = this.degree.maps[to[0]].terms[to[1]].courses[to[2]];
        toCourse.name = fromCourse.name;
        toCourse.units = fromCourse.units;
        toCourse.milestone = fromCourse.milestone;
        if (from[0] == to[0]) {
            fromCourse.name = "";
            fromCourse.units = "";
            fromCourse.milestone = false;
        }
        this.unitsChange(to[0]);
    }

    print(x) {
        this.pdfService.get(this.degreeSel.name, this.degree.maps[x], x).subscribe(data => {

        });
    }

    courseSelected(course, typed){
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
    }
    degreeSelected(degree) {
        if(degree && degree.id) {
            this.degreeSel = degree;
            this.degree.id = degree.id;
            this.dbService.maps(this.degreeSel).subscribe(data => {
                console.log(data);
                if (!data.length)
                    return;
                for(var map = 0; map < 4; map++) {
                    this.degree.maps[map].id = data[map].id;
                    this.degree.maps[map].units = data[map].units;
                    for(var term = 1; term < 15; term++) {
                        this.degree.maps[map].terms[term-1].units = data[map]["t" + term + "_units"];
                        for(var course = 1; course < 7; course++) {
                            this.degree.maps[map].terms[term-1].courses[course-1].id = data[map]["t" + term + "_c" + course + "_id"];
                            this.degree.maps[map].terms[term-1].courses[course-1].name = data[map]["t" + term + "_c" + course + "_name"];
                            this.degree.maps[map].terms[term-1].courses[course-1].units = data[map]["t" + term + "_c" + course + "_units"];
                            this.degree.maps[map].terms[term-1].courses[course-1].milestone = data[map]["t" + term + "_c" + course + "_milestone"] == 0 ? false : true;
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
    }
    newDegree() {
        this.degreeSel = {id:-1, name: '', units_req: ''};
        this.degree = new degree();
        this.viewTypeahead = true;
        this.disableTypeahead = false;
    }
    editDegree() {
        this.disableTypeahead = false;
        this.viewTypeahead = false;
    }
    saveDegree() {
        this.viewTypeahead = true;
        this.disableTypeahead = true;

        this.dbService.updateDegree(this.degreeSel).subscribe(
            data => {
                if (this.degreeSel.id == -1) {
                    this.degreeSel.id = data;
                    this.degree.id = data;
                }
            },
            e => {

            },
            () => {
                this.dbService.saveMaps(this.degree).subscribe(
                    data => {
                        for(var map = 0; map < 4; map++) {
                            this.degree.maps[map].id = data.maps[map].id;
                            for(var term = 1; term < 15; term++) {
                                for(var course = 1; course < 7; course++) {
                                    this.degree.maps[map].terms[term-1].courses[course-1].id = data.maps[map]["t" + term + "_c" + course + "_id"];
                                }
                            }
                        }
                        this.degrees = data.degrees;
                        this.courses = data.courses;
                        console.log('data', data);
                    },
                    err => {
                        
                    },
                    () => {
                    });
            });
    }
    ngAfterViewInit() {
    }
}
