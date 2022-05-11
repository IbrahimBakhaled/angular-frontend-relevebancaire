import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {InboxServiceService} from './inbox-service.service';
import {catchError, Observable, throwError} from 'rxjs';
import {Task} from '../../../mock-api/common/activiti-workflow/task'


@Injectable({
    providedIn: 'root'
})

export class InboxesResolvers implements Resolve<any>{

    constructor(
        private _router: Router,
        private _inboxService: InboxServiceService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task>
    {
        return this._inboxService.getTask(Number(route.paramMap.get('taskId')))
        .pipe(
            // Error here means the requested task is not available
            catchError((error) => {

                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
    }
}
