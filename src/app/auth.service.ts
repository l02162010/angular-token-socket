import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private storageSub= new Subject<string>();
  
  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next('changed');
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next('changed');
  }
  getAuthorizationToken() {
    let accessToken = localStorage.getItem('accessToken')
    let refreshToken = localStorage.getItem('refreshToken')
    let data = {
      accessToken: "",
      refreshToken: ""
    }
    if(accessToken) {
      data.accessToken = accessToken
    }
    if(refreshToken){
      data.refreshToken = refreshToken
    }
    return data;
  }
}
