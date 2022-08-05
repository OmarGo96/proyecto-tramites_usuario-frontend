import {Component, Inject, OnInit} from '@angular/core';
import {RequestService} from "../../../services/request.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MessageService} from "../../../services/messages.service";

@Component({
    selector: 'app-request-history-modal',
    templateUrl: './request-history-modal.component.html',
    styleUrls: ['./request-history-modal.component.css']
})
export class RequestHistoryModalComponent implements OnInit {

    public records: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private requestService: RequestService,
        private messagesService: MessageService
    ) {
    }

    ngOnInit(): void {
        const requestId = this.data.requestId;
        this.getHistory(requestId);
    }

    getHistory(requestId: any){
        this.requestService.getHistory(requestId).subscribe({
            next: res => {
                this.records = res.history;
            },
            error: err => {
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
    }

}
