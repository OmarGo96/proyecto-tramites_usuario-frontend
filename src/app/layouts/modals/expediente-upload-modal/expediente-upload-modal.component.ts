import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DocumentsService} from "../../../services/documents.service";
import {DocumentTypesService} from "../../../services/document-types.service";
import {MessageService} from "../../../services/messages.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from "moment/moment";
import {UsersService} from "../../../services/users.service";

@Component({
    selector: 'app-expediente-upload-modal',
    templateUrl: './expediente-upload-modal.component.html',
    styleUrls: ['./expediente-upload-modal.component.css']
})
export class ExpedienteUploadModalComponent implements OnInit {

    public documentsForm: any;

    public files: File[] = [];
    public documentTypes: any;
    public tiposDocumentosId: any;
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

        this.tiposDocumentosId = this.data.tipo_documento_id;
        this.initDocumentForm();
    }

    initDocumentForm() {
        this.documentsForm = this.formBuilder.group({
            tipos_documentos_id: [this.tiposDocumentosId, Validators.required],
            nombre_documento: ['', Validators.required],
            tipo_documento: ['3', Validators.required],
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
        formData.append('nombre_documento', this.documentsForm.value.nombre_documento);
        formData.append('tipo_documento', this.documentsForm.value.tipo_documento);
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
