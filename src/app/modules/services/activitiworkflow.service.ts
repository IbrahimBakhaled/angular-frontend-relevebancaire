import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Task} from '../../mock-api/common/activiti-workflow/task';

@Injectable({
  providedIn: 'root'
})
export class ActivitiworkflowService {
    private baseUrl = 'https://localhost:8765/api/v3/tasks?assignee=Gestionnaire-Integration';
    // private baseUrl = 'http://localhost:8765/api/v3/tasks?assignee=Gestionnaire-Integration';

    private processUrl = 'https://localhost:8765/api/v3/process?relevebancaireId=';
    private taskIdUrl = 'https://localhost:8765/api/v3/completetask?taskId=';

    constructor(private httpClient: HttpClient) {
    }


    getTasks(): Observable<Task[]> {
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map((response: any) => response)
        );
    }


    createPreccess(releveBancaireId: number): Observable<any> {
        const localProcessUrl = `${this.processUrl}${releveBancaireId}`;

        return this.httpClient.post<any>(localProcessUrl, releveBancaireId);

    }

    completeTask(taskId: number): Observable<Task> {
        const currentTaskUrl = `${this.taskIdUrl}${taskId}`;
        return this.httpClient.get<Task>(currentTaskUrl).pipe(
            map(response => response)
        );


    }
}
    interface GetResponse {
        response: {
            tasks: Task[];
        };
    }
