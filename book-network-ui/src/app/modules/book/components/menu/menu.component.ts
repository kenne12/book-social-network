import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "../../../../services/keycloak/keycloak.service";
import {UserProfile} from "../../../../services/keycloak/user-profile";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

    profile: UserProfile | undefined;

    constructor(private keycloakService: KeycloakService) {
      this.profile = this.keycloakService.profile;
    }

    ngOnInit(): void {
        const linkColor = document.querySelectorAll(".nav-link");
        linkColor.forEach(link => {
            if (window.location.href.endsWith(link.getAttribute("href") || "")) {
                link.classList.add('active');
            }

            link.addEventListener("click", () => {
                linkColor.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            });
        });
    }

    async logout() {
        await this.keycloakService.logout()
    }

    // logout() {
    //     localStorage.removeItem("token");
    //     window.location.reload();
    // }
}
