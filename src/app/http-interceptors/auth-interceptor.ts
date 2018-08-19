import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();
   
    if(authToken.accessToken){
        const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${authToken.accessToken}` } });
        return next.handle(authReq);
    }else{
        return next.handle(req);
    }
  }
}
