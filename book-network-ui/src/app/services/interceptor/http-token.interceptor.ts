import {
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import {inject, Injectable} from "@angular/core";
import {TokenService} from "../token/token.service";
import {Observable} from "rxjs";


// export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
//
//     const tokenService = inject(TokenService);
//
//     const token = tokenService.token;
//     if (token) {
//         const authRequest = req.clone({
//             headers: new HttpHeaders({
//                 Authorization: "Bearer " + token
//             })
//         });
//
//         return next(authRequest);
//     }
//
//     return next(req);
// };


@Injectable()
export class httpTokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.tokenService.token;
        if (token) {
            const authRequest = req.clone({
                headers: new HttpHeaders({
                    Authorization: "Bearer " + token
                })
            });

            return next.handle(authRequest);
        }
        return next.handle(req);
    }
}
