import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Task} from '../../mock-api/common/activiti-workflow/task';

@Injectable({
  providedIn: 'root'
})
export class ActivitiworkflowService {
    private baseUrl = 'http://localhost:8765/api/v3/tasks?assignee=Gestionnaire-Integration';

  constructor(private httpClient: HttpClient) { }


    getTasks(): Observable<Task[]>{
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map((response: any) => response)
        );
    }


}
    interface GetResponse {
        response: {
            tasks: Task[];
        };
    }
