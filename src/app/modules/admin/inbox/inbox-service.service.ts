import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {Task} from '../../../mock-api/common/activiti-workflow/task';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class InboxServiceService {
    private _task: BehaviorSubject<Task | null>;
    private baseUrl = 'http://localhost:8765/api/v3/task';



  constructor(private _httpClient: HttpClient) { this._task = new BehaviorSubject(null); }

    get task$(): Observable<Task>
    {
        return this._task.asObservable();
    }


    getTask(taskId: number): Observable<Task>
    {
        const taskIdUrl = `${this.baseUrl}/${taskId}`;
        return this._httpClient.get<Task>(taskIdUrl, {params: {taskId}}).pipe(
            map(response => new Task(response)),
            tap(task => this._task.next(task)),
        );
    }
}
