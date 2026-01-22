import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../../services/messages.service";
import {DocumentsService} from "../../../services/documents.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {DocumentTypesService} from "../../../services/document-types.service";
import * as moment from 'moment';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-upload-modal',
    templateUrl: './upload-modal.component.html',
    styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit {

    public documentsForm: any;

    public files: File[] = [];
    public documentTypes: any;
    public documentoTipos: any;
    public currentDate = new Date();

    /* Banderas */
    public loading: any;
    public showDocumentName = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private documentsService: DocumentsService,
        private documentTypesService: DocumentTypesService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        private spinner: NgxSpinnerService,
        public matDialog: MatDialogRef<any>,
    ) {
    }

    ngOnInit(): void {
        this.getDocumentTypes();
        this.initDocumentForm();
    }

    initDocumentForm() {
        this.documentsForm = this.formBuilder.group({
            tipos_documentos_id: ['', Validators.required],
            nombre_documento: ['', Validators.required],
            tipo_documento: ['', Validators.required],
            vigencia_final: ['']
        });
    }

    uploadFiles() {
        this.files.forEach(file => {
            this.createDocuments(file);
        });
    }

    createDocuments(file: any) {
        this.spinner.show();
        let formData = new FormData()
        formData.append('tipos_documentos_id', this.documentsForm.value.tipos_documentos_id);
        formData.append('tipo_documento', this.documentsForm.value.tipo_documento);
        formData.append('vigencia_inicial', this.documentsForm.value.vigencia_inicial);
        formData.append('nombre_documento', this.documentsForm.value.nombre_documento);
        formData.append('vigencia_final', this.documentsForm.value.vigencia_final ? moment(this.documentsForm.value.vigencia_final).format('YYYY-MM-DD') : '');
        formData.append('file', file);
        this.documentsService.createRecord(formData).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.matDialog.close();
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    getDocumentTypes() {
        this.spinner.show();
        this.documentTypesService.getRecords().subscribe({
            next: res => {
                this.spinner.hide();
                this.documentTypes = res.documentos;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    getTypeDocuments(event: any) {
        this.spinner.show();
        const documentId = event.value;

        this.documentTypesService.getDocumentTypes(documentId).subscribe({
            next: res => {
                this.spinner.hide();
                this.documentoTipos = res.documentosTipos;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    onSelect(event: any) {
        if (this.files.length >= 1){
            this.messagesService.printStatus('Solo se puede adjuntar un documento a la vez', 'error');
        } else {
            this.files.push(...event.addedFiles);
        }

    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

}
