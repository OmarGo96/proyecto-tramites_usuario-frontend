import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-licenses-modal',
    templateUrl: './licences-modal.component.html',
    styleUrls: ['./licences-modal.component.css']
})
export class LicencesModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
    }

}
