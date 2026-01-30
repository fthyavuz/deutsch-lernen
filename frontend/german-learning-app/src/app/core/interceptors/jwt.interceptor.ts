import { Injectable, inject, Injector } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private injector = inject(Injector);
    private router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);
        let authReq = req;

        const token = authService.getToken();
        if (token && !authService.isTokenExpired()) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
