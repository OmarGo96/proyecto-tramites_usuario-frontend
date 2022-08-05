import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MessageService} from "../../../services/messages.service";
import {DocumentsService} from "../../../services/documents.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {DocumentTypesService} from "../../../services/document-types.service";

@Component({
    selector: 'app-upload-modal',
    templateUrl: './upload-modal.component.html',
    styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit {

    public documentsForm: any;

    public files: File[] = [];
    public documentTypes: any;

    /* Banderas */
    public loading: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private documentsService: DocumentsService,
        private documentTypesService: DocumentTypesService,
        private messagesService: MessageService,
        private formBuilder: UntypedFormBuilder,
        public matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.getDocumentTypes();
        this.initDocumentForm();
    }

    initDocumentForm(){
        this.documentsForm = this.formBuilder.group({
            tipos_documentos_id: ['', Validators.required],
            tipo_documento: ['', Validators.required],
            vigencia_inicial: ['', Validators.required],
            vigencia_final: ['', Validators.required]
        });
    }

    uploadFiles() {
        this.files.forEach(file => {
            this.createDocuments(file);
        });
    }

    createDocuments(file: any) {
        this.loading = true;
        let formData = new FormData()
        formData.append('tipos_documentos_id', this.documentsForm.value.tipos_documentos_id);
        formData.append('tipo_documento', this.documentsForm.value.tipo_documento);
        formData.append('vigencia_inicial', this.documentsForm.value.vigencia_inicial);
        formData.append('vigencia_final', this.documentsForm.value.vigencia_final);
        formData.append('file', file);
        this.documentsService.createRecord(formData).subscribe({
            next: res => {
                this.loading = false;
                this.messagesService.printStatus(res.message, 'success')
                setTimeout(() => {
                    this.matDialog.closeAll();
                }, 2500);
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
    }

    getDocumentTypes(){
        this.documentTypesService.getRecords().subscribe({
            next: res => {
                this.documentTypes = res.documentos;
            },
            error: err => {
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
    }

    onSelect(event: any) {
        this.files.push(...event.addedFiles);
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

}
