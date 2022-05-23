import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {Task} from '../../../../mock-api/common/activiti-workflow/task';
import {MatTableDataSource} from '@angular/material/table';
import {ApexOptions} from 'ng-apexcharts';
import {ActivitiworkflowService} from '../../../services/activitiworkflow.service';
import {Subject, takeUntil} from 'rxjs';
import {InboxServiceService} from '../inbox-service.service';

@Component({
    selector       : 'app-taskdetails',
    templateUrl    : './taskdetails.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class TaskdetailsComponent implements OnInit, OnDestroy {

    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    tasks: Task[];
    data: any;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['id', 'name', 'createTime', 'assignee', 'description', 'action'];
    accountBalanceOptions: ApexOptions;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private activitiWorkflowService: ActivitiworkflowService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _inboxServcie: InboxServiceService)
    {
    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this._changeDetectorRef.markForCheck();
        this.displayTasks();

    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    displayTasks()
    {
        this.activitiWorkflowService.getTasks().subscribe(
            (data) => {
                this.tasks = data;
                // console.log('showing tasks coming from mysql', data);
        this._changeDetectorRef.markForCheck();
            }
        );

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
