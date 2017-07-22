// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SnapMapModule } from './snapmap.module';

enableProdMode();
const platform = platformBrowserDynamic();
platform.bootstrapModule(SnapMapModule);