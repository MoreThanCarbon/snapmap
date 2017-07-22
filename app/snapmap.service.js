System.register(["rxjs/add/operator/map", "@angular/core", "@angular/http"], function (exports_1, context_1) {
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
    function jsonToEncode(json) {
        return stringToEncode(JSON.stringify(json));
    }
    function stringToEncode(str) {
        if (!str)
            return 'null';
        var strFixed = str.replace(new RegExp('%', 'g'), '%25'), strEncoded = encodeURIComponent(strFixed);
        return strEncoded;
    }
    var core_1, http_1, PdfService, DbService;
    return {
        setters: [
            function (_1) {
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }
        ],
        execute: function () {
            PdfService = (function () {
                function PdfService(http) {
                    this.http = http;
                }
                PdfService.prototype.get = function (degree, map, index) {
                    return this.http.get('../pdfFill/' + jsonToEncode(degree) + "/" + jsonToEncode(map) + "/" + index);
                };
                return PdfService;
            }());
            PdfService = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [http_1.Http])
            ], PdfService);
            exports_1("PdfService", PdfService);
            DbService = (function () {
                function DbService(http) {
                    this.http = http;
                }
                DbService.prototype.degrees = function () {
                    return this.http.get('../db/degrees').map(function (res) { return res.json(); });
                };
                DbService.prototype.updateDegree = function (degree) {
                    if (degree.id < 0)
                        return this.http.get('../db/degree/insert/' + jsonToEncode(degree)).map(function (res) { return res.json(); });
                    return this.http.get('../db/degree/update/' + jsonToEncode(degree)).map(function (res) { return res.json(); });
                };
                DbService.prototype.courses = function () {
                    return this.http.get('../db/courses').map(function (res) { return res.json(); });
                };
                DbService.prototype.maps = function (degree) {
                    return this.http.get('../db/maps/' + degree.id).map(function (res) { return res.json(); });
                };
                DbService.prototype.saveMaps = function (degree) {
                    return this.http.get('../db/maps/save/' + jsonToEncode(degree)).map(function (res) { return res.json(); });
                };
                return DbService;
            }());
            DbService = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [http_1.Http])
            ], DbService);
            exports_1("DbService", DbService);
        }
    };
});
