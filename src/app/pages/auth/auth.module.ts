import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from "./auth.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {RegisterComponent} from './register/register.component';
import {ActivateAccountComponent} from './activate-account/activate-account.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ResendActivationLinkComponent} from './resend-activation-link/resend-activation-link.component';
import {LayoutsModule} from "../../layouts/layouts.module";
import {RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings} from "ng-recaptcha";
import {environment} from "../../../environments/environment";
import { ChangeInformationComponent } from './change-information/change-information.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login/:first',
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
    {
        path: 'reenviar-link-activacion',
        component: ResendActivationLinkComponent
    },
    {
        path: 'cambiar-informacion',
        component: ChangeInformationComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
]

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
        RegisterComponent,
        ActivateAccountComponent,
        ResetPasswordComponent,
        ChangePasswordComponent,
        ResendActivationLinkComponent,
        ChangeInformationComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        LayoutsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
    ],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: environment.recaptcha.siteKey,
            } as RecaptchaSettings,
        },
    ],
})
export class AuthModule {
}
