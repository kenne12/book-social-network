import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './pages/login/login.component';
import {FormsModule} from "@angular/forms";
import {RegisterComponent} from './pages/register/register.component';
import {ActivateAccountComponent} from './pages/activate-account/activate-account.component';
import {CodeInputModule} from "angular-code-input";
import {httpTokenInterceptor} from "./services/interceptor/http-token.interceptor";
import {ApiModule} from "./services/api.module";
import {KeycloakService} from "./services/keycloak/keycloak.service";

import {environment} from "../environments/environment";
import {ToastrModule} from "ngx-toastr";

export function kcFactory(kcService: KeycloakService) {
    return () => kcService.init();
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ActivateAccountComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        CodeInputModule,
        ApiModule.forRoot({rootUrl: environment.API_URL}),
        ToastrModule.forRoot({
          progressBar: true,
          closeButton: true,
          newestOnTop: true,
          tapToDismiss: true,
          positionClass: "toast-bottom-right",
          timeOut: 8000
        })
    ],
    providers: [
        HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            //useValue: httpTokenInterceptor,
            useClass: httpTokenInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            deps: [KeycloakService],
            useFactory: kcFactory,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
