import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Acteur} from '../mock-api/common/relevebancaire/acteur';
import {Produit} from '../mock-api/common/relevebancaire/produit';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService implements OnDestroy{

    public _acteursSource: BehaviorSubject<Acteur[] | null> = new BehaviorSubject(null);
    public _acteursCurrent= this._acteursSource.asObservable();



    public _produitSource: BehaviorSubject<Produit[] | null> = new BehaviorSubject(null);
    public _produitCurrent= this._produitSource.asObservable();


    private acteurs: Acteur[] = [];
    private produits: Produit[] = [];


    constructor() {}


    public changeActeurs(acteurs: Acteur[]): void {
      this._acteursSource.next(acteurs);
    }


    public changeProduit(produits: Produit[]): void {
        this._produitSource.next(produits);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addActeur(item: Acteur) {
        this.acteurs.push(item);
    }

    getActeurs(): Acteur[] {
        return this.acteurs;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addProduit(item: Produit){
        this.produits.push(item);
    }

    getProduits(): Produit[]{
        return this.produits;
    }

    ngOnDestroy(): void {


    }



}
