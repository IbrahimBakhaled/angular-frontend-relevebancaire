import {Injectable, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {ReleveBancaire} from '../../mock-api/common/relevebancaire/releve-bancaire';

@Injectable({
  providedIn: 'root'
})
export class RelevebancaireService {

    private baseUrl = 'http://localhost:8765/api/v1/relevebancaire';

    constructor(private httpClient: HttpClient) { }

    getReleveBancaires(): Observable<ReleveBancaire[]>{
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map((response: any) => response)
        );
    }

    postReleveBancaire( relevebancaire: ReleveBancaire): Observable<any> {
        return this.httpClient.post<ReleveBancaire>(this.baseUrl,relevebancaire);
    }


}


interface GetResponse{
    response: {
        relevebancaire: ReleveBancaire[];
    };
}
