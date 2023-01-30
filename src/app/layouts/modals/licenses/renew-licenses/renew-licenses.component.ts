import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'app-renew-licenses',
    templateUrl: './renew-licenses.component.html',
    styleUrls: ['./renew-licenses.component.css']
})
export class RenewLicensesComponent implements OnInit {

    firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this.formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    isLinear = true;

    constructor( private formBuilder: FormBuilder ) {
    }

    ngOnInit(): void {
    }

}
