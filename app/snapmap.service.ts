import 'rxjs/add/operator/map';
import { Injectable, Component, Input, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';

function jsonToEncode(json) {
    return stringToEncode(JSON.stringify(json));
}

function stringToEncode(str) {
    if (!str) return 'null';
    var strFixed = str.replace(new RegExp('%', 'g'), '%25'),
        strEncoded = encodeURIComponent(strFixed);
    return strEncoded;
}

@Injectable()
export class PdfService {
    http: Http;
    constructor(http: Http) { this.http = http; }

    get(degree, map, index) {
        return this.http.get('../pdfFill/' + jsonToEncode(degree) + "/" + jsonToEncode(map) + "/" + index);
    }
}

@Injectable()
export class DbService {
    http: Http;
    constructor(http: Http) { this.http = http; }

    degrees() {
        return this.http.get('../db/degrees').map(res => res.json());
    }

    updateDegree(degree) {
        if (degree.id < 0)
            return this.http.get('../db/degree/insert/' + jsonToEncode(degree)).map(res => res.json());
        return this.http.get('../db/degree/update/' + jsonToEncode(degree)).map(res => res.json());
    }

    courses() {
        return this.http.get('../db/courses').map(res => res.json());
    }

    maps(degree) {
        return this.http.get('../db/maps/' + degree.id).map(res => res.json());
    }

    saveMaps(degree) {
        return this.http.get('../db/maps/save/' + jsonToEncode(degree)).map(res => res.json());
    }
}