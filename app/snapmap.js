System.register(["@angular/core", "@angular/platform-browser-dynamic", "./snapmap.module"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, platform_browser_dynamic_1, snapmap_module_1, platform;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (snapmap_module_1_1) {
                snapmap_module_1 = snapmap_module_1_1;
            }
        ],
        execute: function () {
            core_1.enableProdMode();
            platform = platform_browser_dynamic_1.platformBrowserDynamic();
            platform.bootstrapModule(snapmap_module_1.SnapMapModule);
        }
    };
});
