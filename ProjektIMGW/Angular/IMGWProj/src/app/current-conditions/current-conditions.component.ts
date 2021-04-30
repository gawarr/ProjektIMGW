import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data/data.service'
import { baseUrl } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {
  conditionsTable: Object;
  currentConditionsTable: Object;
  eventsTable: Object;

  jsonLogin: Object;

  constructor(private _dataService: DataService, public _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    if (!this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/`);
    this.jsonLogin = { "login": this._authService.login }
    this.AgriculturalTechniquesGet();
    this.CurrentConditionsGet();
    this.EventsGet();
  }

  AgriculturalTechniquesGet() {
    this._dataService.AgriculturalTechniquesGet(this.jsonLogin).subscribe(
      data =>
      {
        console.log(data);
        this.conditionsTable = data;
      }
    );
  }

  CurrentConditionsGet() {
    this._dataService.CurrentConditionsGet(this.jsonLogin).subscribe(
      data =>
      {
        console.log(data);
        this.currentConditionsTable = data;
      }
    );
  }

  EventsGet() {
    this._dataService.EventsGet(this.jsonLogin).subscribe(
      data =>
      {
        console.log(data);
        this.eventsTable = data;
      }
    );
  }
}
