// map tells the System loader where to look for things
var map = {
  '@angular':                   '@angular',
  'rxjs':                       'rxjs',
  'ng2-dnd':                    'ng2-dnd/bundles',
  'typescript':                 'typescript',
  'ng2-typeahead':              'ng2-typeahead',
  'snapmap':                    './'
};
// packages tells the System loader how to load when no filename and/or no extension
var packages = {
  'snapmap':                    { main: 'snapmap', defaultExtension: 'js' },
  'typescript':                 { main: 'typescript.js', defaultExtension: 'js' },
  'rxjs':                       { main: 'Rx', defaultExtension: 'js' },
  'ng2-dnd':                    { main: 'index', defaultExtension: 'umd.js' },
  'ng2-typeahead':              { main: 'index', defaultExtension: 'js' },
  'ts':                         { main: "plugin.js" },
  "typescript":                 { main: "lib/typescript.js",
                                  meta: {
                                    "lib/typescript.js": {
                                      "exports": "ts"
                                    }
                                  }
    }
};
var meta = {};
meta["typescript/lib/typescript.js"] = { exports: "ts" };
var ngPackageNames = [
  'common',
  'compiler',
  'core',
  'forms',
  'http',
  'platform-browser',
  'platform-browser-dynamic'
];
// Individual files (~300 requests):
function packIndex(pkgName) {
  packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  packMeta(pkgName);
}
// Bundled (~40 requests):
function packUmd(pkgName) {
  packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  packMeta(pkgName);
}
// Bundled (~40 requests):
function packMeta(pkgName) {
  meta['@angular/'+pkgName] = { esModule: true, format: 'cjs' };
}
// Most environments should use UMD; some (Karma) need the individual index files
var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
// Add package entries for angular packages
ngPackageNames.forEach(setPackageConfig);
var config = {
  warnings: true,
  transpiler: 'ts',
  map: map,
  packages: packages,
  meta: meta
};
System.typescriptOptions = {
      "target": "es5",
      "module": "system",
      "isolatedModules": false,
      "jsx": "react",
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "declaration": false,
      "noImplicitAny": false,
      "removeComments": true,
      "noLib": false,
      "preserveConstEnums": true,
      "suppressImplicitAnyIndexErrors": true,
      "allowSyntheticDefaultImports": true
  };
System.config(config);
System.import('snapmap');
