import {Component, OnInit} from '@angular/core';
import {ServicesService} from "../../../services/services.service";
import {MessageService} from "../../../services/messages.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-searcher-modal',
    templateUrl: './searcher-modal.component.html',
    styleUrls: ['./searcher-modal.component.css']
})
export class SearcherModalComponent implements OnInit {

    public services: any;
    public showList = false;
    public result: any;

    constructor(
        private servicesService: ServicesService,
        private messagesService: MessageService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit(): void {
        this.getServices();
    }

    getServices(){
        this.spinner.show();
        this.servicesService.getPublicServices().subscribe({
            next: res => {
                this.spinner.hide()
                this.services = res.servicios;
            },
            error: err => {
                this.spinner.hide();
                this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
    }

    applyFilter(event: Event) {
        this.showList = true;
        const query = (event.target as HTMLInputElement).value;
        this.result = this.services.filter((d: any) => d.nombre.toLowerCase().indexOf(query) > -1);
    }

}
