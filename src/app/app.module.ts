import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from "@angular/common";
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutsModule} from "./layouts/layouts.module";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PagesModule} from "./pages/pages.module";

import localeEsMX from '@angular/common/locales/es-MX';
import { NgxSpinnerModule } from 'ngx-spinner';


registerLocaleData(localeEsMX, 'mx');

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        LayoutsModule,
        PagesModule,
        BrowserAnimationsModule,
        NgxSpinnerModule.forRoot({ type: 'ball-beat' }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ { provide: LOCALE_ID, useValue: 'mx' } ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
