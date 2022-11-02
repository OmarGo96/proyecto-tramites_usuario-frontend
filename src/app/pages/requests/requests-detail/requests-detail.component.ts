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
import {UntypedFormBuilder} from "@angular/forms";

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

    public dataSource: any;
    public displayedColumns: string[] = ['requisito', 'seleccionar', 'archivo'];

    /* Banderas */
    public loading = false;
    public saving = false;
    public sending = false;

    constructor(
        private requestsService: RequestService,
        private messagesService: MessageService,
        private documentsService: DocumentsService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private router: Router,
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
            comentario: this.request.comentario
        });
    }

    getId() {
        this.activatedRoute.params.subscribe({
            next: res => {
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
                console.log(res.requisitos);
                this.request = res.solicitud;
                const requeriments = res.requisitos.filter((req: any) => req.Requisito.Documento);
                this.reqWithDocuments = requeriments;
                this.requeriments = res.requisitos;
                this.dataSource = new MatTableDataSource(res.requisitos);
                this.initSolicitudForm();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

    saveRequest(status: any){
        status === '1' ? this.saving = true : this.sending = true;
        this.solicitudForm.controls.estatus_solicitud_id.setValue(status);
        this.solicitudForm.controls.solicitud_id.setValue(this.request.id.toString());
        const data = this.solicitudForm.value;
        this.requestsService.updateRecord(data).subscribe({
            next: res => {
                this.saving = false;
                this.sending = false;
                this.messagesService.printStatus(res.message, 'success');
                setTimeout(()=>{
                    this.router.navigate(['escritorio/solicitudes']);
                }, 2500);
            },
            error: err => {
                this.saving = false;
                this.sending = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
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
        console.log(requisitoId);
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

    setDocument(document: any, requisitoId: any) {
        this.loading = true;
        const data = {
            documentacion_id: document.id,
            solicitud_id: this.request.id,
            requisito_id: requisitoId
        }

        this.documentsService.createDocumentoSolicitud(data).subscribe({
            next: res => {
                this.loading = false;
                this.getId();
            },
            error: err => {
                this.loading = false;
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    openDocument(documentId: any) {
        this.documentsService.getUserDocument(documentId).subscribe({
            next: res => {
                let url = URL.createObjectURL(res);
                window.open(url, '_blank');
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        });
    }

}
