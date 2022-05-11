import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, tap, BehaviorSubject} from 'rxjs';
import {ReleveBancaire} from '../../mock-api/common/relevebancaire/releve-bancaire';

@Injectable({
  providedIn: 'root'
})
export class RelevebancaireService {

    private baseUrl = 'http://localhost:8081/api/v1/relevebancaire';

    constructor(private httpClient: HttpClient) { }

    getReleveBancaires(): Observable<ReleveBancaire[]>{
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map((response: any) => response)
        );
    }

    postReleveBancaire( relevebancaire: ReleveBancaire): Observable<any> {
        return this.httpClient.post<ReleveBancaire>(this.baseUrl,relevebancaire);
    }


    getReleveBancaireById(id: number): Observable<ReleveBancaire>{
        const taskIdUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<any>(taskIdUrl).pipe(
            map((response: any) => response)
        );
    }


}


interface GetResponse{
    response: {
        relevebancaire: ReleveBancaire[];
    };
}
