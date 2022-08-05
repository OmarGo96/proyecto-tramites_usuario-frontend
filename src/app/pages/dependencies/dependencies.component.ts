import {Component, OnInit} from '@angular/core';
import {DependenciesService} from 'src/app/services/dependencies.service';
import {MessageService} from 'src/app/services/messages.service';

@Component({
    selector: 'app-dependencies',
    templateUrl: './dependencies.component.html',
    styleUrls: ['./dependencies.component.css']
})
export class DependenciesComponent implements OnInit {

    public dependencies: any;

    constructor(
        private dependenciesService: DependenciesService,
        private messagesService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.getAreas();
    }

    getAreas() {
        this.dependenciesService.getRecords().subscribe({
            next: res => {
                this.dependencies = res.areas;
            },
            error: err => {
                console.log(err);
                // this.messagesService.printStatus(err.error.errors, 'error');
            }
        })
    }

}
