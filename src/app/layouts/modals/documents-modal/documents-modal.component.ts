import {Component, OnInit} from '@angular/core';
import {DocumentsService} from "../../../services/documents.service";
import {MessageService} from "../../../services/messages.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UploadModalComponent} from "../upload-modal/upload-modal.component";
import {ExpedienteUploadModalComponent} from "../expediente-upload-modal/expediente-upload-modal.component";
import {NgxSpinnerService} from "ngx-spinner";
import {UsersService} from "../../../services/users.service";

@Component({
    selector: 'app-documents-modal',
    templateUrl: './documents-modal.component.html',
    styleUrls: ['./documents-modal.component.css']
})
export class DocumentsModalComponent implements OnInit {

    public documents: any;

    public expedienteUnico: any;
    private user: any;

    constructor(
        private documentsService: DocumentsService,
        private messagesService: MessageService,
        private usersService: UsersService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        public matDialogRef: MatDialogRef<any>
    ) {
    }

    ngOnInit(): void {
        this.user = this.usersService.getIdentity();
        this.getExpedienteUnico();
    }

    openUploadDialog(): void {
        const config = {
            width: '50%',
            data: {
                title: false
            },
        }

        const dialogRef = this.dialog.open(UploadModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            this.getDocuments()
        });
    }

    openUploadExpedienteDialog(tipoDocumentoId: any): void {
        const config = {
            width: '50%',
            data: {
                tipo_documento_id: tipoDocumentoId
            },
        }

        const dialogRef = this.dialog.open(ExpedienteUploadModalComponent, config);

        dialogRef.afterClosed().subscribe(res => {
            this.getExpedienteUnico()
        });
    }

    getExpedienteUnico() {
        this.documentsService.getExpedienteUnico(this.user.uuid).subscribe({
            next: res => {
                this.expedienteUnico = res.documentacionExpediente;
                this.spinner.hide();
                this.getDocuments();
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
                this.spinner.hide();
            }
        })
    }

    getDocuments(){
        this.documentsService.getRecords().subscribe({
            next: res => {
                this.documents = res.documentacion;
            },
            error: err => {
                this.messagesService.printStatusArrayNew(err.error.errors, 'error');
            }
        })
    }

    selectDocument(document: any){
        this.matDialogRef.close(document);
    }

}
