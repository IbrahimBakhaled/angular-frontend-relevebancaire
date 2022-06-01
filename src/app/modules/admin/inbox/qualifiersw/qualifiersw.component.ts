import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import {RelevebancaireService} from '../../../services/relevebancaire.service';
import {Produit} from '../../../../mock-api/common/relevebancaire/produit';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedServiceService} from '../../../../shared/shared-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {debounceTime, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-qualifiersw',
  templateUrl: './qualifiersw.component.html',
  styleUrls: ['./qualifiersw.component.scss']
})
export class QualifierswComponent implements OnInit,OnDestroy {


    _produits: Produit[];
    swTableLoaded = false;
    swForm: FormGroup;
    listData: any;
    _shownProduits: Produit[]= [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _releveBancaireService: RelevebancaireService,
              private formBuilder: FormBuilder,
              private _sharedService: SharedServiceService,
              private _changeDetectorRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any) {

      this.swForm = this.formBuilder.group({
          produit:[''],
          montant: ['']

      });
  }


  ngOnInit(): void {

      this._sharedService._produitCurrent.subscribe(
          (produits) => {
              this._produits = produits;
          }
      );

      this._sharedService.changeProduit(this._produits);
      this._changeDetectorRef.markForCheck();

      this._releveBancaireService.getProduits().pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
          (data) => {
              data.forEach((p) => {
                  // console.log('Logging P ', p);
                  this.listData = p.produitLabel;
                  this._shownProduits.push(p);
              });
              // console.log('this._shownProduits ', this._shownProduits);
              this._changeDetectorRef.markForCheck();
              this.swTableLoaded = true;
          }
      );
  }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // addProduit(){
    //     this._releveBancaireService.getProduits().pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe(
    //         (data) => {
    //             data.forEach((p) => {
    //                 // console.log('Logging P ', p);
    //                 this.listData = p.produitLabel;
    //                 this._shownProduits.push(p);
    //             });
    //             // console.log('this._shownProduits ', this._shownProduits);
    //             this._changeDetectorRef.markForCheck();
    //             this.swTableLoaded = true;
    //         }
    //     );
    // }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    onClick(element){
      this._produits.forEach((produit) => {
          if (produit.produitId === element){
              this._sharedService.addProduit(produit);
              produit.ligneReleveId = this.data.selectedLigneReleve.ligneReleveId;
          }
      });
      this._sharedService.changeProduit(this._produits);
    }



    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
