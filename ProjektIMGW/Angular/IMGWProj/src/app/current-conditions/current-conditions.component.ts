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
  conditionsTable = [];

  constructor(private _dataService: DataService, public _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    if (!this._authService.IsLoggedIn())
      this._router.navigateByUrl(`/`);
    this.conditionsTable[0] = {AgriculturalDate: '20-04-2021', Name: 'name', Data1: 'data1', Data2: 'data2', }
    this.conditionsTable[1] = {AgriculturalDate: '05-06-2021', Name: 'name2', Data1: 'data12', Data2: 'data22', }

    //this._dataService.

  }

}
