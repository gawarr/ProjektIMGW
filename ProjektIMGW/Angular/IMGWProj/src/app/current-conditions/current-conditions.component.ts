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
  jsonLogin: Object;
  jsonLocalization: Object;

  localizationsGroup: FormGroup;
  localizationsList: Object;

  agriculturalTechniquesTable: Object;
  agriculturalTechniquesGroup: FormGroup;
  actionsList: Object;

  currentConditionsTable: Object;
  currentConditionsGroup: FormGroup;
  plantsList: Object;
  statesList: Object;

  eventsTable: Object;
  eventsGroup: FormGroup;
  eventsList: Object;

  constructor(private _dataService: DataService, public _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    if (!this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/`);
    this.jsonLogin = { "login": this._authService.login }

    this.LocalizationsGet();

    this.initForms();
  }

  LocalizationsGet() {
    this._dataService.LocatizationsGet(this.jsonLogin).subscribe(
      data => this.localizationsList = data
    );

    this.localizationsGroup = new FormGroup({
      localizationId:  new FormControl('', [Validators.required])
    });
  
    this.jsonLocalization = { "localizationId": this.localizationsGroup.controls.localizationId.value };
  }

  initForms() {
    this.initAgriculturalTechniquesForm();
    this.initCurrentConditionsForm();
    this.initEventsForm();
  }

  initAgriculturalTechniquesForm() {
    this.agriculturalTechniquesGroup = new FormGroup({
      localizationId:  new FormControl(this.localizationsGroup.controls.localizationId.value, [Validators.required]),
      agriculturalDate: new FormControl('', [Validators.required]),
      actionId: new FormControl('', [Validators.required]),
      data1: new FormControl('', [Validators.required]),
      data2: new FormControl('', [Validators.required])
    });
    this.ActionsListGet();
  }

  ActionsListGet() {
    this._dataService.ActionsListGet().subscribe(
      data => this.actionsList = data
    );
  }

  initCurrentConditionsForm() {
    this.currentConditionsGroup = new FormGroup({
      localizationId:  new FormControl(this.localizationsGroup.controls.localizationId.value, [Validators.required]),
      plantTypeId: new FormControl('', [Validators.required]),
      sowingDate: new FormControl('', [Validators.required]),
      cultivationStateId: new FormControl('', [Validators.required])
    });
    this.PlantTypesListGet();
    this.CultivationStatesListGet();
  }

  PlantTypesListGet() {
    this._dataService.PlantTypesListGet().subscribe(
      data => this.plantsList = data
    );
  }

  CultivationStatesListGet() {
    this._dataService.CultivationStatesListGet().subscribe(
      data => this.statesList = data
    );
  }

  initEventsForm() {
    this.eventsGroup = new FormGroup({
      localizationId:  new FormControl(this.localizationsGroup.controls.localizationId.value, [Validators.required]),
      eventDate: new FormControl('', [Validators.required]),
      eventTypeId: new FormControl('', [Validators.required]),
      lossesPercentage: new FormControl('', [Validators.required]),
      photoPath: new FormControl('')
    });
    this.EventTypesListGet();
  }

  EventTypesListGet() {
    this._dataService.EventsListGet().subscribe(
      data => this.eventsList = data
    );
  }
  
  ChangeLocation() {
    this.jsonLocalization = { "localizationId": this.localizationsGroup.controls.localizationId.value };
    this.AgriculturalTechniquesGet();
    this.CurrentConditionsGet();
    this.EventsGet();
    this.initForms();
  }

  AgriculturalTechniquesGet() {
    this._dataService.AgriculturalTechniquesGet(this.jsonLocalization).subscribe(
      data => this.agriculturalTechniquesTable = data
    );
  }

  CurrentConditionsGet() {
    this._dataService.CurrentConditionsGet(this.jsonLocalization).subscribe(
      data => this.currentConditionsTable = data
    );
  }

  EventsGet() {
    this._dataService.EventsGet(this.jsonLocalization).subscribe(
      data => this.eventsTable = data
    );
  }

  AgriculturalTechniquesAdd() {
    if (this.agriculturalTechniquesGroup.valid) {
      this._dataService.AgriculturalTechniquesAdd(this.agriculturalTechniquesGroup.value).subscribe(
        data => {}
      );
    this.AgriculturalTechniquesHideAddStuff();
    this.AgriculturalTechniquesGet();
    this.initAgriculturalTechniquesForm();
    }
  }

  CurrentConditionsAdd() {
    if (this.currentConditionsGroup.valid) {
      this._dataService.CurrentConditionsAdd(this.currentConditionsGroup.value).subscribe(
        data => {}
      );
    this.CurrentConditionsHideAddStuff();
    this.CurrentConditionsGet();
    this.initCurrentConditionsForm();
    }
  }

  EventsAdd() {
    if (this.eventsGroup.valid) {
      this._dataService.EventsAdd(this.eventsGroup.value).subscribe(
        data => {}
      );

    this.EventsSbtBtn();
    this.EventsGet();
    this.initEventsForm();
    }
  }

  AgriculturalTechniquesShowAddStuff() {
    document.getElementById("AgriculturalTechniquesAddBtn").style.display = "none";
    document.getElementById("AgriculturalTechniquesSbtBtn").style.display = "block";
    document.getElementById("agriculturalDateField").style.display =        "block";
    document.getElementById("actionIdField").style.display =                "block";
    document.getElementById("data1Field").style.display =                   "block";
    document.getElementById("data2Field").style.display =                   "block";
  }

  AgriculturalTechniquesHideAddStuff(){
    document.getElementById("AgriculturalTechniquesAddBtn").style.display = "block";
    document.getElementById("AgriculturalTechniquesSbtBtn").style.display = "none";
    document.getElementById("agriculturalDateField").style.display =        "none";
    document.getElementById("actionIdField").style.display =                "none";
    document.getElementById("data1Field").style.display =                   "none";
    document.getElementById("data2Field").style.display =                   "none";
  }

  CurrentConditionsShowAddStuff() {
    document.getElementById("CurrentConditionsAddBtn").style.display =             "none";
    document.getElementById("CurrentConditionsSbtBtn").style.display =              "block";
    document.getElementById("currentConditionsPlantTypeId").style.display =        "block";
    document.getElementById("currentConditionsSowingDate").style.display =         "block";
    document.getElementById("currentConditionsCultivationStateId").style.display = "block";
  }

  CurrentConditionsHideAddStuff(){
    document.getElementById("CurrentConditionsAddBtn").style.display =             "block";
    document.getElementById("CurrentConditionsSbtBtn").style.display =              "none";
    document.getElementById("currentConditionsPlantTypeId").style.display =        "none";
    document.getElementById("currentConditionsSowingDate").style.display =         "none";
    document.getElementById("currentConditionsCultivationStateId").style.display = "none";
  }

  EventsAddBtn() {
    document.getElementById("EventsAddBtn").style.display =             "none";
    document.getElementById("EventsSbtBtn").style.display =              "block";
    document.getElementById("eventsEventDate").style.display =        "block";
    document.getElementById("eventsEventTypeId").style.display =         "block";
    document.getElementById("eventsLossesPercentage").style.display = "block";
    document.getElementById("eventsPhotoPath").style.display = "block";
  }

  EventsSbtBtn(){
    document.getElementById("EventsAddBtn").style.display =             "block";
    document.getElementById("EventsSbtBtn").style.display =              "none";
    document.getElementById("eventsEventDate").style.display =        "none";
    document.getElementById("eventsEventTypeId").style.display =         "none";
    document.getElementById("eventsLossesPercentage").style.display = "none";
    document.getElementById("eventsPhotoPath").style.display = "none";
  }
}
