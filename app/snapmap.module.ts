// From Angular
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

// My Services
// import {ShopService, EmpService} from './apps/shoptime.services';

// Root Module
import {SnapMapComponent} from './snapmap.component';
import {PdfService, DbService} from './snapmap.service';
import {DndModule} from 'ng2-dnd';

import { Typeahead } from 'ng2-typeahead';

@NgModule({
    imports: [
        BrowserModule, 
        HttpModule,
        FormsModule, 
        DndModule.forRoot(),
    ],
    declarations: [
        SnapMapComponent,
        Typeahead
    ], 
    providers: [
        PdfService,
        DbService
    ],
    bootstrap: [
        SnapMapComponent
    ]
})
export class SnapMapModule { }
