import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from "./auth.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {RegisterComponent} from './register/register.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registrarse',
        component: RegisterComponent
    },
    {
        path: 'activar/:codigo',
        component: ActivateAccountComponent
    },
    {
        path: 'restaurar-contraseña',
        component: ResetPasswordComponent
    },
    {
        path: 'restablecer/:codigo',
        component: ChangePasswordComponent
    },
]

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
        RegisterComponent,
        ActivateAccountComponent,
        ResetPasswordComponent,
        ChangePasswordComponent
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
