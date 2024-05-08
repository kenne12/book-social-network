import {Component, OnInit} from '@angular/core';
import {AuthenticationRequest} from "../../services/models/authentication-request";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";
import {TokenService} from "../../services/token/token.service";
import {KeycloakService} from "../../services/keycloak/keycloak.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    // public authRequest: AuthenticationRequest = {email: "", password: ""};
    // public errorMsg: Array<string> = [];

    constructor(private router: Router,
                private authService: AuthenticationService,
                private tokenService: TokenService,
                private keycloakService: KeycloakService) {
    }

    async ngOnInit(): Promise<void> {
        await this.keycloakService.init();
        await this.keycloakService.login();
    }

    // login() {
    //     this.errorMsg = [];
    //     this.authService.authenticate({
    //         body: this.authRequest
    //     }).subscribe({
    //         next: (response) => {
    //             this.tokenService.token = response.token as string;
    //             this.router.navigate(["/books"]);
    //         },
    //         error: (err) => {
    //             if (err.error.validationsErrors) {
    //                 this.errorMsg = err.error.validationsErrors;
    //             } else {
    //                 this.errorMsg.push(err.error.error);
    //             }
    //         }
    //     });
    // }

    // register(): void {
    //     this.router.navigate(["register"]);
    // }
}
