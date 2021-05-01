import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data/data.service'
import { baseUrl } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from '../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  AgriculturalTechniquesGroup: FormGroup;
  actionsList: Object;

  constructor(private _dataService: DataService, public _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    if (!this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/`);
    this.jsonLogin = { "login": this._authService.login }
    this.AgriculturalTechniquesGet();
    this.CurrentConditionsGet();
    this.EventsGet();
    this.initForms();
  }

  AgriculturalTechniquesGet() {
    this._dataService.AgriculturalTechniquesGet(this.jsonLogin).subscribe(
      data =>
      {
        this.conditionsTable = data;
      }
    );
  }

  CurrentConditionsGet() {
    this._dataService.CurrentConditionsGet(this.jsonLogin).subscribe(
      data =>
      {
        this.currentConditionsTable = data;
      }
    );
  }

  EventsGet() {
    this._dataService.EventsGet(this.jsonLogin).subscribe(
      data =>
      {
        this.eventsTable = data;
      }
    );
  }

  initForms() {
    this.AgriculturalTechniquesGroup = new FormGroup({
      login:  new FormControl(this._authService.login, [Validators.required]),
      agriculturalDate: new FormControl('', [Validators.required]),
      actionId: new FormControl('', [Validators.required]),
      data1: new FormControl('', [Validators.required]),
      data2: new FormControl('', [Validators.required])
    });
    this.ActionsListGet();
  }

  AgriculturalTechniquesAdd() {
    if (this.AgriculturalTechniquesGroup.valid) {
      this._dataService.AgriculturalTechniquesAdd(this.AgriculturalTechniquesGroup.value).subscribe(
        data => {}
      );
    this.AgriculturalTechniquesGet();
    this.initForms();
    }
  }

  ActionsListGet() {
    this._dataService.ActionsListGet().subscribe(
      data =>
      {
        this.actionsList = data;
      }
    );
  }

  AgriculturalTechniquesShowAddStuff() {
    document.getElementById("AgriculturalTechniquesSbtBtn").style.display="block";
    document.getElementById("AgriculturalTechniquesAddBtn").style.display="none";
  }

  AgriculturalTechniquesHideAddStuff() {
    document.getElementById("AgriculturalTechniquesAddBtn").style.display="block";
    document.getElementById("AgriculturalTechniquesSbtBtn").style.display="none";
  }
}
