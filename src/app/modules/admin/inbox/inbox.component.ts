import {Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {ActivitiworkflowService} from '../../services/activitiworkflow.service';
import {Task} from '../../../mock-api/common/activiti-workflow/task';
import {MatTableDataSource} from '@angular/material/table';
import {ApexOptions} from 'ng-apexcharts';
import {MatSort} from '@angular/material/sort';
@Component({
    selector     : 'inbox',
    templateUrl  : './inbox.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent
{
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    tasks: Task[];
    data: any;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['id', 'name', 'createTime', 'assignee', 'description', 'action'];
    accountBalanceOptions: ApexOptions;
    /**
     * Constructor
     */
    constructor(private activitiWorkflowService: ActivitiworkflowService)
    {
    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
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
                console.log('showing tasks coming from mysql', data);
            }
        );
        console.log('showing tasks ' + this.tasks);
    }



}
