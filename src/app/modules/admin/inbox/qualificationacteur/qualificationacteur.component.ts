import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, map, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {RelevebancaireService} from '../../../services/relevebancaire.service';
import {Router} from '@angular/router';
import {Acteur} from '../../../../mock-api/common/relevebancaire/acteur';
import {SharedServiceService} from '../../../../shared/shared-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-qualificationacteur',
  templateUrl: './qualificationacteur.component.html',
  styleUrls: ['./qualificationacteur.component.scss']
})
export class QualificationacteurComponent implements OnInit, OnDestroy {

    peopleLoaded = false;
    _acteurs: Acteur[];
    _shownActeurs: Acteur[];
    completedActeurList: Acteur[]= [];
    acteur$: Observable<Acteur>;
    isEditing: boolean = false;
    enableEditIndex = null;


    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private value: string;


  constructor(private _releveBancaireService: RelevebancaireService,
              private route: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              private _sharedService: SharedServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
      this._sharedService._acteursCurrent.subscribe(
          (acteurs) => {
              this._acteurs = acteurs;
          }
      );
  }


  public onCLick(selectedActeurId): void {
      this._acteurs.forEach((acteur) => {
          if (acteur.acteurId === selectedActeurId) {
              acteur.ligneReleveId = this.data.selectedLigneReleve.ligneReleveId;
          }
      });


      this._sharedService.changeActeurs(this._acteurs);
  }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    switchEditMode(i) {
        this.isEditing = true;
        this.enableEditIndex = i;
    }



    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
     searchedActeur(value: string){
      this._releveBancaireService.searchedActeur(value).pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (data) => {
              this._shownActeurs = this._acteurs.filter(acteur => acteur.nomActeur.toLowerCase() === value || acteur.prenomActeur.toLowerCase() === value);
              this._shownActeurs.forEach((a) => {
                  this._sharedService.addActeur(a);
                  this.completedActeurList.push(a);
              });
              console.log('consoling this._shownActeurs ', this._shownActeurs);
              this._changeDetectorRef.markForCheck();
              this.peopleLoaded = true;

          }
      );


    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
