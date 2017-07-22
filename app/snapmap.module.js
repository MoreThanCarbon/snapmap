System.register(["@angular/core", "@angular/platform-browser", "@angular/http", "@angular/forms", "./snapmap.component", "./snapmap.service", "ng2-dnd", "ng2-typeahead"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, platform_browser_1, http_1, forms_1, snapmap_component_1, snapmap_service_1, ng2_dnd_1, ng2_typeahead_1, SnapMapModule;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (snapmap_component_1_1) {
                snapmap_component_1 = snapmap_component_1_1;
            },
            function (snapmap_service_1_1) {
                snapmap_service_1 = snapmap_service_1_1;
            },
            function (ng2_dnd_1_1) {
                ng2_dnd_1 = ng2_dnd_1_1;
            },
            function (ng2_typeahead_1_1) {
                ng2_typeahead_1 = ng2_typeahead_1_1;
            }
        ],
        execute: function () {
            SnapMapModule = (function () {
                function SnapMapModule() {
                }
                return SnapMapModule;
            }());
            SnapMapModule = __decorate([
                core_1.NgModule({
                    imports: [
                        platform_browser_1.BrowserModule,
                        http_1.HttpModule,
                        forms_1.FormsModule,
                        ng2_dnd_1.DndModule.forRoot(),
                    ],
                    declarations: [
                        snapmap_component_1.SnapMapComponent,
                        ng2_typeahead_1.Typeahead
                    ],
                    providers: [
                        snapmap_service_1.PdfService,
                        snapmap_service_1.DbService
                    ],
                    bootstrap: [
                        snapmap_component_1.SnapMapComponent
                    ]
                })
            ], SnapMapModule);
            exports_1("SnapMapModule", SnapMapModule);
        }
    };
});
