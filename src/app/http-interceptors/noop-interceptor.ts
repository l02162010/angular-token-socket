import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError,tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppService, BASE_URL } from '../app.service';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  refreshURL:string = `${BASE_URL}auth/rest/token/refresh`

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log(event.status);
          }
        }, error => {        
            let token = this.authService.getAuthorizationToken()
            if(error.status == 401){
              if(token.refreshToken && this.refreshURL != error.url){
                let data = {
                  "refreshToken" : token.refreshToken
                }
                this.appService.refresh(data)
                  .subscribe((res: any)=>{})
              }else{
                this.router.navigateByUrl('/login')
              }
            }
        })
      )
  }
}
