import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy,
    OnInit, ViewChild,
    ViewEncapsulation, Input
} from '@angular/core';
import {Task} from '../../../../mock-api/common/activiti-workflow/task';
import {InboxServiceService} from '../inbox-service.service';
import {debounceTime, mergeMap, pipe, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {RelevebancaireService} from '../../../services/relevebancaire.service';
import {ReleveBancaire} from '../../../../mock-api/common/relevebancaire/releve-bancaire';
import {LigneReleve} from '../../../../mock-api/common/relevebancaire/ligne-releve';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {QualificationacteurComponent} from '../qualificationacteur/qualificationacteur.component';
import {Acteur} from '../../../../mock-api/common/relevebancaire/acteur';
import {SharedServiceService} from '../../../../shared/shared-service.service';
import {QualifierswComponent} from '../qualifiersw/qualifiersw.component';
import {Produit} from '../../../../mock-api/common/relevebancaire/produit';
import {ActivitiworkflowService} from '../../../services/activitiworkflow.service';

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
    releveBancaire: ReleveBancaire = new ReleveBancaire();
    ligneReleves: LigneReleve[]= [];
    dataSource= new MatTableDataSource<LigneReleve>(this.ligneReleves);
    // dataSource = new MatTableDataSource(this.ligneReleves);
    displayedColumns: string[] = ['dateOperation', 'dateValue', 'modePaiment',
        'montant','acteur', 'dejaqualifieracteur', 'dejaqualifiersw', 'swp', 'qualifierActeur', 'qualifierSwp', 'details'];
    selectedObject: string = 'Releve Bancaire';
    selectedLigneReleve: LigneReleve | null = null;
    selectedLigneReleveForm: FormGroup;
    tasks: Task[];
    data: any;
    releveBancaireId: number;
    _fileReader = new FileReader();
    _acteurs: Acteur[]= [];
    _savedActeurs: Acteur[]= [];
    _savedProduits: Produit[]= [];
    _produits: Produit[];
    _shownActeurs: Acteur[]= [];
    _shownProduits: Produit[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();








  constructor(
              private _inboxServcie: InboxServiceService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _relebeBancaireService: RelevebancaireService,
              private _formBuilder: FormBuilder,
              private _matDialog: MatDialog,
              private _sharedService: SharedServiceService,
              private _activitiWorkflowService: ActivitiworkflowService) { }


  ngOnInit(): void {


          // this.dataSource.paginator = this.paginator;
      this._inboxServcie.task$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((task: Task) => {
          this.task = {... task};
          // console.log( 'LOGGING THIS.TASK ' , this.task);
          // Mark for check
          this._changeDetectorRef.markForCheck();
      });
      this.displayTaskByIdDetails();
      this.displayReleveBancaireById();

      this._relebeBancaireService.searchedActeur('').pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (data) => {
              this._acteurs = data;
              this._sharedService.changeActeurs(this._acteurs);
              this._changeDetectorRef.markForCheck();
          });


      this._relebeBancaireService.getProduits().pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (data) => {
              this._produits = data;
              this._sharedService.changeProduit(this._produits);
              this._changeDetectorRef.markForCheck();
          }
      );

      this._sharedService.changeProduit(this._produits);
      this._changeDetectorRef.markForCheck();

      this.selectedLigneReleveForm = this._formBuilder.group({
          ligneReleveId   : [''],
          rib             : [''],
          numCheck             : [''],
          operationNature      : [''],
          creditDebit            : [''],
          refCdg           : [''],
          refPaiment            : [''],
      });

      this.recieveActeur();
      this.recieveProduit();
      this._changeDetectorRef.markForCheck();
      this._shownActeurs = [];

      console.log('showing acteurs goes to DB >>>> ', this._shownActeurs);
      this._shownActeurs = this._sharedService.getActeurs();
      this._shownProduits = this._sharedService.getProduits();
      this._relebeBancaireService.getActeurs().pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (acteurs) => {
              this._savedActeurs = acteurs;
              // console.log(this._savedActeurs);
          }
      );


      this._relebeBancaireService.getProduitsfromDB().pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (produits) => {
              this._savedProduits = produits;
              // console.log(this._savedProduits);
          }
      );

      this._changeDetectorRef.markForCheck();
  }


    recieveActeur(): void {
        this._sharedService._acteursCurrent.subscribe(

            acteurs => (this._acteurs = acteurs)
        );
        this._changeDetectorRef.markForCheck();


    }


    recieveProduit(): void {
      this._sharedService._produitCurrent.subscribe(
          produits => (this._produits = produits)
      );
      this._changeDetectorRef.markForCheck();
    }

    public removeActor(selectedActeurId): void {
        this._acteurs.forEach((acteur) => {
            if (acteur.acteurId === selectedActeurId) {
                acteur.ligneReleveId = null;
            }
        });

        this._sharedService.changeActeurs(this._acteurs);
        this._changeDetectorRef.markForCheck();
    }


    public removeProduit(selectedProduitId): void {
        this._produits.forEach((produit) => {
            if (produit.produitId === selectedProduitId) {
                produit.ligneReleveId = null;
            }
        });

        this._sharedService.changeProduit(this._produits);
        this._changeDetectorRef.markForCheck();
    }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    selectedTabChange(event: any){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._changeDetectorRef.markForCheck();
    }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    displayTaskByIdDetails(){
        this._inboxServcie.getTask(this.task.id).subscribe(
            (data) => {
                this.task = data;
                this.releveBancaireId = data.releveBancaireId;  // this is the variable I want to access
                // console.log('this.releveBancaireId' ,this.releveBancaireId); // this returs 1 which is right "releveBancaireId" has value 1
            }
        );
        this._changeDetectorRef.markForCheck();
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
              // console.log('logging this.displayReleveBancaireById();' , data);
        this._changeDetectorRef.markForCheck();
          }
      );
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
        this._changeDetectorRef.markForCheck();
    }

    closeDetails(): void
    {
        this.selectedLigneReleve = null;
        this._changeDetectorRef.markForCheck();
    }



    qualifierActeur(ligneReleveId: number): void
    {
        let _ligneReleveId: number |null = null;
        let _data: any;

        this.ligneReleves.map((l) => {
            _ligneReleveId= l.ligneReleveId;
        });

        this._relebeBancaireService.getReleveBancaireById(this.task.releveBancaireId)
        .subscribe((data) => {
            _data=data;
            // Set the selected ligne de releve
            this.selectedLigneReleve = data.lignereleve.find(i => i.ligneReleveId === ligneReleveId);

        this._matDialog.open(QualificationacteurComponent, {
            autoFocus: false,
            data: {
                selectedLigneReleve: this.selectedLigneReleve
            }
        });
            {
                // Close the details
                this.closeDetails();
                return;
            }
    });
            this._changeDetectorRef.markForCheck();
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    qualifierSW(ligneReleveId: number): void {

      this._relebeBancaireService.getReleveBancaireById(this.task.releveBancaireId)
      .subscribe((data) => {

          this.selectedLigneReleve = data.lignereleve.find(i => i.ligneReleveId ===ligneReleveId);

          this._matDialog.open(QualifierswComponent, {
              autoFocus: false,
              data: {
                  selectedLigneReleve: this.selectedLigneReleve
              }

          });
        {
            // Close the details
            this.closeDetails();
            return;
        }
      });
        this._changeDetectorRef.markForCheck();

    }



    changeReleveBancaireStatus(value: any): void {
      this._relebeBancaireService.changeReleveBancaireStatus(this.releveBancaire.releveBancaireId, value).subscribe(
          (data) => {
              this.releveBancaire = data;
          }
      );
    }

    changeReleveBancaireStatusQualifier(value: any): void {
      this._relebeBancaireService.changeReleveBancaireStatusQualifier(this.releveBancaire.releveBancaireId, value).subscribe(
          (data) => {
              this.releveBancaire = data;
          }
      );
    }



    completeReleveBancaire(releveBancaireId: number): void {

      this._relebeBancaireService.qualificationReleveBancaire(releveBancaireId).subscribe(data => data);
      this._relebeBancaireService.postActeur(this._shownActeurs).subscribe(data => data);
      this._shownActeurs.length = 0;
      this._relebeBancaireService.postProduit(this._shownProduits).subscribe( data => data);

        this._changeDetectorRef.markForCheck();
    }
    completeTask(): void {
      // this._activitiWorkflowService.completeTask(this.task.taskId).subscribe(data => data);
      this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    ngOnDestroy(): void {
      this._shownActeurs = [];
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
