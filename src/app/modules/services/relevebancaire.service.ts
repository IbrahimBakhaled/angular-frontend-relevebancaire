import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, tap, BehaviorSubject} from 'rxjs';
import {ReleveBancaire} from '../../mock-api/common/relevebancaire/releve-bancaire';
import {Acteur} from '../../mock-api/common/relevebancaire/acteur';
import {Produit} from '../../mock-api/common/relevebancaire/produit';

@Injectable({
  providedIn: 'root'
})
export class RelevebancaireService {

    private baseUrl = 'https://localhost:8765/api/v1/relevebancaire';
    private acteurUrl ='https://localhost:8765/api/v1/acteurs';
    private baseUrlSearchActeur = 'https://localhost:8765/api/v1/search/mockacteurs?query=';
    private baseUrlProduit = 'https://localhost:8765/api/v1/mockproduit';
    private baseUrlQualification = 'https://localhost:8765/api/v1/relevebancaire/qualification';
    private baseUrlActeurEntity = 'https://localhost:8765/api/v1/createacteur';
    private baseUrlProduitEntity = 'https://localhost:8765/api/v1/createproduit';
    private baseUrlProduits = 'https://localhost:8765/api/v1/produits';

    constructor(private httpClient: HttpClient) { }

    getReleveBancaires(): Observable<ReleveBancaire[]>{
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map((response: any) => response)
        );
    }


    postReleveBancaire( relevebancaire: ReleveBancaire): Observable<ReleveBancaire> {
        return this.httpClient.post<ReleveBancaire>(this.baseUrl,relevebancaire).pipe(
            map(response => response)
        );
    }


    getReleveBancaireById(id: number): Observable<ReleveBancaire>{
        const taskIdUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<any>(taskIdUrl).pipe(
            map((response: any) => response)
        );
    }

    getActeurs(): Observable<Acteur[]>{
        return this.httpClient.get(this.acteurUrl).pipe(
            map((response: any) => response)
        );
    }

    getProduitsfromDB(): Observable<Produit[]>{
        return this.httpClient.get(this.baseUrlProduits).pipe(
            map((response: any) => response)
        );
    }

    searchedActeur(value: string): Observable<any>{
        const acteurUrl = `${this.baseUrlSearchActeur}${value}`;
        return this.httpClient.get(acteurUrl).pipe(
            map((response: any) => response)
        );
    }

    getProduits(): Observable<any>{
        return this.httpClient.get(this.baseUrlProduit).pipe(
            map((response: any) => response)
        );
    }

    changeReleveBancaireStatus(releveBancaireId: number, value: any): Observable<ReleveBancaire>{
        const releveBancaireUrl = `${this.baseUrl}/statusrejeter/${releveBancaireId}`;
        return this.httpClient.put<GetResponse>(releveBancaireUrl, value).pipe(
            map((res: any)=> res)
        );
    }

    changeReleveBancaireStatusQualifier(releveBancaireId: number, value: any): Observable<ReleveBancaire>{
        const releveBancaireUrl = `${this.baseUrl}/statusqualifier/${releveBancaireId}`;
        return this.httpClient.put<GetResponse>(releveBancaireUrl, value).pipe(
            map((res: any)=> res)
        );
    }

    qualificationReleveBancaire(releveBancaireId: number): Observable<ReleveBancaire>{
        const releveBancaireIdUrl = `${this.baseUrlQualification}/${releveBancaireId}`;
        return this.httpClient.post<ReleveBancaire>(releveBancaireIdUrl, releveBancaireId).pipe(
            (data: any ) => data
        );
    }


    postActeur(acteur: Acteur[]): Observable<Acteur[]>{
        return this.httpClient.post<Acteur> (this.baseUrlActeurEntity, acteur).pipe(
            map ((data: any) => data)
        );
    }

    postProduit(produit: Produit[]): Observable<Produit[]> {
        return this.httpClient.post<Produit>(this.baseUrlProduitEntity, produit).pipe(
            map ((data: any) => data)
        );
    }

}
interface GetResponse {
    response: {
        relevebancaire: ReleveBancaire[];
    };
}
