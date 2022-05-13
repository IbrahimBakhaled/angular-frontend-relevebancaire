import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy,
    OnInit, ViewChild,
    ViewEncapsulation, Input
} from '@angular/core';
import {Task} from '../../../../mock-api/common/activiti-workflow/task';
import {ActivitiworkflowService} from '../../../services/activitiworkflow.service';
import {InboxServiceService} from '../inbox-service.service';
import {mergeMap, pipe, Subject, takeUntil, tap} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {RelevebancaireService} from '../../../services/relevebancaire.service';
import {ReleveBancaire} from '../../../../mock-api/common/relevebancaire/releve-bancaire';
import {LigneReleve} from '../../../../mock-api/common/relevebancaire/ligne-releve';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-inboxmanagement',
  templateUrl: './inboxmanagement.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls : ['./inboxmanagement.component.scss']
})
export class InboxmanagementComponent implements OnInit, OnDestroy {


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    task: Task;
    releveBancaire: ReleveBancaire;
    ligneReleves: LigneReleve[]= [];
    dataSource= new MatTableDataSource<LigneReleve>(this.ligneReleves);
    // dataSource = new MatTableDataSource(this.ligneReleves);
    displayedColumns: string[] = ['ligneReleveId', 'creditDebit', 'dateOperation', 'dateValue', 'modePaiment',
        'montant', 'numCheck', 'operationNature', 'refCdg','refPaiment','rib', 'details'];
    selectedObject: string = 'Releve Bancaire';
    selectedLigneReleve: LigneReleve | null = null;
    selectedLigneReleveForm: FormGroup;
    tasks: Task[];
    data: any;
    releveBancaireId: number;
    isLoading: boolean = false;

    _fileReader = new FileReader();
    private _unsubscribeAll: Subject<any> = new Subject<any>();




  constructor(private activitiWorkflowService: ActivitiworkflowService,
              private _inboxServcie: InboxServiceService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _relebeBancaireService: RelevebancaireService,
              private _formBuilder: FormBuilder) { }


  ngOnInit(): void {
      this.displayTasks();
          // this.dataSource.paginator = this.paginator;
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



      this.selectedLigneReleveForm = this._formBuilder.group({
          ligneReleveId   : [''],
          rib             : [''],
          numCheck             : [''],
          operationNature      : [''],
          creditDebit            : [''],
          refCdg           : [''],
          refPaiment            : [''],
      });

  }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    selectedTabChange(event: any){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
              this.dataSource= new MatTableDataSource(this.ligneReleves);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
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














    toggleDetails(ligneReleveId: number): void
    {
        // If the ligne de releve is already selected...
        if ( this.selectedLigneReleve && this.selectedLigneReleve.ligneReleveId === ligneReleveId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        let _ligneReleveId: number |null = null;

        this.ligneReleves.map((l) => {
           _ligneReleveId= l.ligneReleveId;
        });

        // Get the ligne releve by id
        this._relebeBancaireService.getReleveBancaireById(this.task.releveBancaireId)
        .subscribe((data) => {

            // Set the selected product
            this.selectedLigneReleve = data.lignereleve.find(i => i.ligneReleveId === ligneReleveId);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    closeDetails(): void
    {
        this.selectedLigneReleve = null;
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
