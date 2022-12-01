import {Component, OnInit} from '@angular/core';
import {DocumentsService} from "../../../services/documents.service";
import {MessageService} from "../../../services/messages.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UploadModalComponent} from "../upload-modal/upload-modal.component";

@Component({
    selector: 'app-documents-modal',
    templateUrl: './documents-modal.component.html',
    styleUrls: ['./documents-modal.component.css']
})
export class DocumentsModalComponent implements OnInit {

    public documents: any;

    constructor(
        private documentsService: DocumentsService,
        private messagesService: MessageService,
        private dialog: MatDialog,
        public matDialogRef: MatDialogRef<any>
    ) {
    }

    ngOnInit(): void {
        this.getDocuments();
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
