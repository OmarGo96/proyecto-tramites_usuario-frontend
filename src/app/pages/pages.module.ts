import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {MaterialModule} from "../material/material.module";
import {PublicComponent} from './public/public.component';
import {DependenciesComponent} from './dependencies/dependencies.component';
import {ServicesComponent} from './services/services.component';
import {LayoutsModule} from "../layouts/layouts.module";
import {ServicesDetailComponent} from './services/services-detail/services-detail.component';
import { PredialComponent } from './predial/predial.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LicencesComponent } from './licences/licences.component';
import { DocumentsComponent } from './documents/documents.component';
import { RequestsComponent } from './requests/requests.component';
import {RequestsDetailComponent} from "./requests/requests-detail/requests-detail.component";
import { ProfileComponent } from './profile/profile.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import {NgxDropzoneModule} from "ngx-dropzone";

const routes: Routes = [
    {path: '', component: DependenciesComponent},
    {path: 'tramites/:uuid', component: ServicesComponent},
    {path: 'servicio/:uuid', component: ServicesDetailComponent},
    {path: 'solicitudes', component: RequestsComponent},
    {path: 'solicitud/:id', component: RequestsDetailComponent},
    {path: 'predial', component: PredialComponent},
    {path: 'licencia-funcionamiento', component: LicencesComponent},
    {path: 'documentos', component: DocumentsComponent},
    {path: 'perfil', component: ProfileComponent},
    {path: 'tramite/:uuid', component: ServiceDetailComponent},
]

@NgModule({
    declarations: [
        HomeComponent,
        PublicComponent,
        DependenciesComponent,
        ServicesComponent,
        ServicesDetailComponent,
        PredialComponent,
        LicencesComponent,
        DocumentsComponent,
        RequestsComponent,
        RequestsDetailComponent,
        ProfileComponent,
        ServiceDetailComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        LayoutsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        NgxDropzoneModule
    ]
})
export class PagesModule {
}
