import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html',
    styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
    message = "";
    isOk = true;
    submitted = false;

    constructor(
        private router: Router,
        private authService: AuthenticationService) {
    }

    onCodeCompleted(token: string) {
        this.confirmAccount(token);
    }

    goToLogin() {
        this.router.navigate(["/login"]);
    }

    private confirmAccount(token: string) {
        this.authService.confirm({
            token
        }).subscribe({
            next: () => {
                this.message = "Your account has been successfully activated.\n Now you can proceed to login";
                this.submitted = true;
                this.isOk = true;
            },
            error: err => {
                this.message = "Token has been expired or invalid";
                this.submitted = true;
                this.isOk = false;
            }
        });
    }
}
