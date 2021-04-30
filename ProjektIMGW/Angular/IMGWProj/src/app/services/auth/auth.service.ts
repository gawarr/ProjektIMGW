import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { Router } from '@angular/router';

export const AUTH_TOKEN_KEY = 'auth-token';
export const AUTH_USER_DATA = 'user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authToken: string;
  public login: string;

  constructor(private http: HttpClient, private _router: Router) {
    this.UpdateStorage();
   }

  CheckLogin(data): Observable<any> {
    return this.http.post(`${baseUrl}CheckLogIn`, data)
  }

  Login(login: string) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, login + 'TOKEN');
    sessionStorage.setItem(AUTH_USER_DATA, login);
    this.UpdateStorage();
  }

  UpdateStorage() {
    const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const login = sessionStorage.getItem(AUTH_USER_DATA);
    this.authToken = authToken;
    if (login)
      this.login = login;
    else
      this.login = null;
  }

  public IsLoggedIn() {
    return this.authToken !== null;
  }

  public LogOut() {
    if (!this.IsLoggedIn()) 
      return;
    sessionStorage.clear();
    this.UpdateStorage();
    this._router.navigateByUrl(`/`);
  }
}
