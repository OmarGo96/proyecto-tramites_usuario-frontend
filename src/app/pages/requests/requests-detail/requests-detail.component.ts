import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../services/messages.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../services/request.service";
import {MatTableDataSource} from "@angular/material/table";

import {
    RequestHistoryModalComponent
} from "../../../layouts/modals/request-history-modal/request-history-modal.component";
import {MessagesModalComponent} from "../../../layouts/modals/messages-modal/messages-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {DocumentsModalComponent} from "../../../layouts/modals/documents-modal/documents-modal.component";
import {DocumentsService} from "../../../services/documents.service";
import {FormBuilder, UntypedFormBuilder} from "@angular/forms";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";
import {UploadModalComponent} from "../../../layouts/modals/upload-modal/upload-modal.component";

@Component({
    selector: 'app-requests-detail',
    templateUrl: './requests-detail.component.html',
    styleUrls: ['./requests-detail.component.css']
})
export class RequestsDetailComponent implements OnInit {

    public solicitudForm: any;

    public request: any;
    public requeriments: any;
    public reqWithDocuments: any;
    public reqMandatory: any;
    public records: any;
    public messages: any;
    public files: any;
    public requestId: any;

    public dataSource: any;
    public displayedColumns: string[] = ['requisito', 'seleccionar', 'archivo'];

    /* Banderas */
    public loading = false;
    public saving = false;
    public sending = false;
    public reUpload = false;

    constructor(
        private requestsService: RequestService,
        private messagesService: MessageService,
        private documentsService: DocumentsService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private spinner: NgxSpinnerService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getId();

    }

    initSolicitudForm() {
        this.solicitudForm = this.formBuilder.group({
            estatus_solicitud_id: [''],
            solicitud_id: [''],
            comentario: this.request.comentario ? this.request.comentario : ['']
        });
    }

    getId() {
        this.activatedRoute.params.subscribe({
            next: res => {
                this.spinner.show();
                this.getSolicitud(res['id']);
            },
            error: err => {
                console.log(err);
            }
        });
    }

    getSolicitud(id: any) {
        this.requestsService.getRecord(id).subscribe({
            next: res => {
                this.request = res.solicitud;
                console.log(this.request);
                this.requeriments = res.requisitos;
                this.reqWithDocuments = res.requisitos.filter((req: any) => req.Requisito.Documento);
                this.reqMandatory = res.requisitos.filter((req: any) => req.obligatorio === 1);
                this.dataSource = new MatTableDataSource(res.requisitos);
                this.initSolicitudForm();
                this.getHistory(res.solicitud.id);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getHistory(requestId: any) {
        this.requestsService.getHistory(requestId).subscribe({
            next: res => {
                this.records = res.history;
                this.getMessages(requestId);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    getMessages(requestId: any) {
        this.requestsService.getMessages(requestId).subscribe({
            next: res => {
                this.spinner.hide();
                this.messages = res.mensajes;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    saveRequest(status: any) {
        this.spinner.show();
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(() => {
                    this.router.navigate(['escritorio/solicitudes']);
                }, 2500);
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    onSelect(event: any) {
        if (this.files.length >= 1) {
            this.messagesService.printStatus('Solo se puede adjuntar un documento a la vez', 'error');
        } else {
            this.files.push(...event.addedFiles);
        }
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    openHistoryDialog(requestId: any): void {
        const config = {
            width: '50%',
            data: {
                requestId
            },
        }

        const dialogRef = this.dialog.open(RequestHistoryModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            console.log('The dialog was closed');
        });
    }

    openMessagesDialog(requestId: any): void {
        const config = {
            width: '50%',
            data: {
                requestId
            },
        }

        const dialogRef = this.dialog.open(MessagesModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            console.log('The dialog was closed');
        });
    }

    selectDocument(requisitoId: any): void {
        const config = {
            width: '100%',
            data: {
                title: ''
            },
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.setDocument(document, requisitoId);
            }
        });
    }

    reSelectDocumentToUpdate(requisitoId: any, documentoSolicitudRequisitoId: any) {
        const config = {
            width: '100%',
            data: {
                title: ''
            },
        }

        const dialogRef = this.dialog.open(DocumentsModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            if (document) {
                this.updateDocument(document, requisitoId, documentoSolicitudRequisitoId);
            }
        });
    }

    setDocument(document: any, requisitoId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            requisito_id: requisitoId
        }

        this.documentsService.createDocumentoSolicitud(data).subscribe({
            next: res => {
                this.spinner.hide();
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    updateDocument(document: any, requisitoId: any, documentoSolicitudRequisitoId: any) {
        this.spinner.show();
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            requisito_id: requisitoId
        }

        this.documentsService.updateDocumentSolicitudRequisito(documentoSolicitudRequisitoId, data).subscribe({
            next: res => {
                this.reUpload = false;
                this.requestId = null;
                this.spinner.hide();
                this.getId();
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    openDocument(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatus('Algo salio mal al obtener el documento. Intente mas tarde.', 'warning');
            }
        });
    }

    openUploadDialog(): void {
        const config = {
            width: '50%',
            data: {
                title: false
            },
        }

        const dialogRef = this.dialog.open(UploadModalComponent, config);

        dialogRef.afterClosed().subscribe(document => {
            console.log(document);
            /*if (document) {
                this.setDocument(document, requisitoId);
            }*/
        });
    }

    reUploadDocument(requestId: any) {
        this.messagesService.confirmDelete('¿Estás seguro de eliminar este archivo?').then((result: any) => {
            if (result.isConfirmed) {
                this.requestId = requestId;
                this.reUpload = true;
            }
        });
    }

}
