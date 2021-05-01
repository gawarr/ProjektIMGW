import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth/auth.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { baseUrl } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public _authService: AuthService, private _router: Router) { }
  
  ngOnInit(): void {
    if (this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/currentconditions`);
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      login: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    });
  }

  loginProces() {
    if (this.formGroup.valid) {
      this._authService.CheckLogin(this.formGroup.value).subscribe(
        data => 
        {
          if (data.IsCorrect) {
            this._authService.Login(this.formGroup.controls.login.value);
            this._authService.IsLoggedIn();
            this._router.navigateByUrl(`/currentconditions`);
          }
          else
            alert("Błędne dane logowania.")
        }
      );
    }
  }
}
