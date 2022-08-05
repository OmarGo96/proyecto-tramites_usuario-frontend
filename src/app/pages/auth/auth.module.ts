import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from "./auth.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registrarse',
        component: RegisterComponent
    }
]

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ]
})
export class AuthModule {
}
