import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy,
    OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Task} from '../../../../mock-api/common/activiti-workflow/task';
import {ActivitiworkflowService} from '../../../services/activitiworkflow.service';
import {InboxServiceService} from '../inbox-service.service';
import {mergeMap, Subject, takeUntil, tap} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {RelevebancaireService} from '../../../services/relevebancaire.service';
import {ReleveBancaire} from '../../../../mock-api/common/relevebancaire/releve-bancaire';
import {LigneReleve} from '../../../../mock-api/common/relevebancaire/ligne-releve';
import {MatPaginator} from '@angular/material/paginator';
@Component({
  selector: 'app-inboxmanagement',
  templateUrl: './inboxmanagement.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls : ['./inboxmanagement.component.scss']
})
export class InboxmanagementComponent implements OnInit, OnDestroy {


    @ViewChild('paginator') paginator: MatPaginator;
    task: Task;
    releveBancaire: ReleveBancaire;
    ligneReleves: LigneReleve[];
    recentTransactionsDataSource = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['id', 'credit debit', 'date operation', 'date value', 'mode paiment',
        'montant', 'numero cheque', 'operation nature', 'ref cdg','ref paiment','rib'];
    selectedObject: string = 'Releve Bancaire';
    tasks: Task[];
    data: any;
    releveBancaireId: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();




  constructor(private activitiWorkflowService: ActivitiworkflowService,
              private _inboxServcie: InboxServiceService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _relebeBancaireService: RelevebancaireService) { }


  ngOnInit(): void {
      this.displayTasks();
          this.recentTransactionsDataSource.paginator = this.paginator;
      this._inboxServcie.task$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((task: Task) => {
          console.log('=== ngOnit ====', task.releveBancaireId);
          this.task = {... task};
          // console.log( 'LOGGING THIS.TASK ' , this.task);
          // Mark for check
          this._changeDetectorRef.markForCheck();
      });

      this.displayTaskByIdDetails();
      this.displayReleveBancaireById();

  }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    displayTaskByIdDetails(){
        this._inboxServcie.getTask(this.task.id).subscribe(
            (data) => {
                this.task = data;
                this.releveBancaireId = data.releveBancaireId;  // this is the variable I want to access
                console.log('this.releveBancaireId' ,this.releveBancaireId); // this returs 1 which is right "releveBancaireId" has value 1
            }
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    displayReleveBancaireById(){

      this._relebeBancaireService.getReleveBancaireById(this.task.releveBancaireId).subscribe(
          (data) => {
              this.releveBancaire = data;
              this.ligneReleves= data.lignereleve;
              console.log('logging this.displayReleveBancaireById();' , data);
          }
      );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    displayTasks()
    {
        this.activitiWorkflowService.getTasks().subscribe(
            (data) => {
                this.tasks = data;
                // console.log('showing tasks coming from mysql', data);
            }
        );
        // console.log('showing task Name ' + this.taskName);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
