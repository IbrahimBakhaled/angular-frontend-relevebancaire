import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Acteur} from '../mock-api/common/relevebancaire/acteur';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

    public _acteursSource: BehaviorSubject<Acteur[] | null> = new BehaviorSubject(null);
    public _acteursCurrent= this._acteursSource.asObservable();

    constructor() { }


    public changeActeurs(acteurs: Acteur[]): void {
      this._acteursSource.next(acteurs);
    }
}
