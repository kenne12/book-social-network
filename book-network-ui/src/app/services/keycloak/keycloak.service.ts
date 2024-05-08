import {Injectable} from "@angular/core";
import Keycloak from "keycloak-js";
import {UserProfile} from "./user-profile";

import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})

export class KeycloakService {
    private _keycloak: Keycloak | undefined;
    private _profile: UserProfile | undefined;


    async init() {
        const authenticated = await this.keycloak?.init({
            onLoad: "login-required",
        });

        if (authenticated) {
            this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
            this._profile.token = this.keycloak?.token;
        }
    }

    login(): Promise<void> {
        return this.keycloak?.login();
    }

    logout(): Promise<void> {
        return this.keycloak?.logout();
        //return this.keycloak?.accountManagement();
    }

    get keycloak() {
        if (!this._keycloak) {
            this._keycloak = new Keycloak({
                url: environment.KEYCLOAK_SERVER_URL,
                realm: "book-social-network",
                clientId: "bsn"
            });
        }

        return this._keycloak;
    }

    get profile(): UserProfile | undefined {
        return this._profile;
    }
}
