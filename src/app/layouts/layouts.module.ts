import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {ModalsComponent} from './modals/modals.component';
import {BaseComponent} from './base/base.component';
import {MaterialModule} from "../material/material.module";
import {ExcerptPipe} from "../pipes/excerpt.pipe";
import { EstadoCuentaModalComponent } from './modals/estado-cuenta-modal/estado-cuenta-modal.component';
import { LicencesModalComponent } from './modals/licenses/licenses-modal/licences-modal.component';
import { UploadModalComponent } from './modals/upload-modal/upload-modal.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {ReactiveFormsModule} from "@angular/forms";
import { MessagesModalComponent } from './modals/messages-modal/messages-modal.component';
import { RequestHistoryModalComponent } from './modals/request-history-modal/request-history-modal.component';
import { DocumentsModalComponent } from './modals/documents-modal/documents-modal.component';
import { SearcherModalComponent } from './modals/searcher-modal/searcher-modal.component';
import { AddLicensesModalComponent } from './modals/licenses/add-licenses-modal/add-licenses-modal.component';
import { RenewLicensesComponent } from './modals/licenses/renew-licenses/renew-licenses.component';

@NgModule({
    declarations: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        ModalsComponent,
        BaseComponent,
        ExcerptPipe,
        EstadoCuentaModalComponent,
        LicencesModalComponent,
        UploadModalComponent,
        MessagesModalComponent,
        RequestHistoryModalComponent,
        DocumentsModalComponent,
        SearcherModalComponent,
        AddLicensesModalComponent,
        RenewLicensesComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        NgxDropzoneModule,
        ReactiveFormsModule
    ],
    exports: [
        ExcerptPipe
    ],
})
export class LayoutsModule {
}
