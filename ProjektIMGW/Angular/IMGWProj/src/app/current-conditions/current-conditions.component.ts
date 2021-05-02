import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data/data.service'
import { baseUrl } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from '../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

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
  jsonLocalization: Object;

  LocalizationsGroup: FormGroup;
  localizationsList: Object;

  AgriculturalTechniquesGroup: FormGroup;
  actionsList: Object;

  CurrentConditionsGroup: FormGroup;
  plantsList: Object;
  statesList: Object;

  EventsGroup: FormGroup;
  eventsList: Object;

  constructor(private _dataService: DataService, public _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    if (!this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/`);
    this.jsonLogin = { "login": this._authService.login }

    this.LocalizationsGet();
    this.LocalizationsGroup = new FormGroup({
      localizationId:  new FormControl(1, [Validators.required])
    });
    this.jsonLocalization = { "localizationId": this.LocalizationsGroup.controls.localizationId.value };

    this.AgriculturalTechniquesGet();
    this.CurrentConditionsGet();
    this.EventsGet();

    this.initForms();
  }

  LocalizationsGet() {
    this._dataService.LocatizationsGet(this.jsonLogin).subscribe(
      data => 
      {
        this.localizationsList = data;
      }
    );
  }
  
  ChangeLocation() {
    this.jsonLocalization = { "localizationId": this.LocalizationsGroup.controls.localizationId.value };
    this.AgriculturalTechniquesGet();
    this.CurrentConditionsGet();
    this.EventsGet();
    this.initForms();
  }

  AgriculturalTechniquesGet() {
    this._dataService.AgriculturalTechniquesGet(this.jsonLocalization).subscribe(
      data =>
      {
        this.conditionsTable = data;
      }
    );
  }

  CurrentConditionsGet() {
    this._dataService.CurrentConditionsGet(this.jsonLocalization).subscribe(
      data =>
      {
        this.currentConditionsTable = data;
      }
    );
  }

  EventsGet() {
    this._dataService.EventsGet(this.jsonLocalization).subscribe(
      data =>
      {
        this.eventsTable = data;
      }
    );
  }

  initForms() {
    this.initAgriculturalTechniquesForm();
    this.initCurrentConditionsForm();
    this.initEventsForm();
  }

  initAgriculturalTechniquesForm() {
    this.AgriculturalTechniquesGroup = new FormGroup({
      localizationId:  new FormControl(this.LocalizationsGroup.controls.localizationId.value, [Validators.required]),
      agriculturalDate: new FormControl('', [Validators.required]),
      actionId: new FormControl('', [Validators.required]),
      data1: new FormControl('', [Validators.required]),
      data2: new FormControl('', [Validators.required])
    });
    this.ActionsListGet();
  }

  initCurrentConditionsForm() {
    this.CurrentConditionsGroup = new FormGroup({
      localizationId:  new FormControl(this.LocalizationsGroup.controls.localizationId.value, [Validators.required]),
      plantTypeId: new FormControl('', [Validators.required]),
      sowingDate: new FormControl('', [Validators.required]),
      cultivationStateId: new FormControl('', [Validators.required])
    });
    this.PlantTypesListGet();
    this.CultivationStatesListGet();
  }

  initEventsForm() {
    this.EventsGroup = new FormGroup({
      localizationId:  new FormControl(this.LocalizationsGroup.controls.localizationId.value, [Validators.required]),
      eventDate: new FormControl('', [Validators.required]),
      eventTypeId: new FormControl('', [Validators.required]),
      lossesPercentage: new FormControl('', [Validators.required]),
      photoPath: new FormControl('')
    });
    this.EventTypesListGet();
  }

  AgriculturalTechniquesAdd() {
    if (this.AgriculturalTechniquesGroup.valid) {
      this._dataService.AgriculturalTechniquesAdd(this.AgriculturalTechniquesGroup.value).subscribe(
        data => {}
      );
    this.AgriculturalTechniquesGet();
    this.initAgriculturalTechniquesForm();
    }
  }

  CurrentConditionsAdd() {
    if (this.CurrentConditionsGroup.valid) {
      this._dataService.CurrentConditionsAdd(this.CurrentConditionsGroup.value).subscribe(
        data => {}
      );
    this.CurrentConditionsGet();
    this.initCurrentConditionsForm();
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

  PlantTypesListGet() {
    this._dataService.PlantTypesListGet().subscribe(
      data =>
      {
        this.plantsList = data;
      }
    );
  }

  CultivationStatesListGet() {
    this._dataService.CultivationStatesListGet().subscribe(
      data =>
      {
        this.statesList = data;
      }
    );
  }

  EventsAdd() {
    if (this.EventsGroup.valid) {
      this._dataService.EventsAdd(this.EventsGroup.value).subscribe(
        data => {}
      );
    this.EventsGet();
    this.initEventsForm();
    }
  }

  EventTypesListGet() {
    this._dataService.EventsListGet().subscribe(
      data =>
      {
        this.eventsList = data;
      }
    );
  }
}
