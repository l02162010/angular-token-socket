import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { AuthService } from "./auth.service";

export const BASE_URL = 'http://test.comismart.com/'

export interface login {
  login: string;
  password: string;
}
export interface refresh {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  //login 
  //url auth/rest/token
  doLogin (data: login): Observable<string> {
    let url = `${BASE_URL}auth/rest/token`
    return this.http.post<string>(url, data)
    .pipe(
      tap((data: string) => {
        if(data){
          this.authService.setItem('accessToken',data['accessToken'])
          this.authService.setItem('refreshToken',data['refreshToken'])
        }
      }),
      catchError(this.handleError<any>())
    );
  }

  //refresh 
  //url auth/rest/token/refresh
  refresh (data: refresh): Observable<string> {
    let url = `${BASE_URL}auth/rest/token/refresh`
    return this.http.post<string>(url, data)
    .pipe(
      tap((data: string) => {
        if(data){
          this.authService.setItem('accessToken',data['accessToken'])
        }
      }),
      catchError(this.handleError<any>())
    );
  }
  //deviceId
  //url api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be
  getDevice (): Observable<object> {
    let url = `${BASE_URL}api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be`
    return this.http.get<object>(url)
    .pipe(
      tap((data: object) => {
      }),
      catchError(this.handleError<any>())
    );
  }

  //handError
  private handleError<T> (result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      switch (error.error.error) {
        case 400:
          alert('帳號密碼不能為空')
          break;

        case 401:
          alert('帳號或密碼錯誤')
          break;
      
        default:
          break;
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
