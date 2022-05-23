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
import {Subject} from 'rxjs';

@Component({
  selector: 'app-qualifiersw',
  templateUrl: './qualifiersw.component.html',
  styleUrls: ['./qualifiersw.component.scss']
})
export class QualifierswComponent implements OnInit,OnDestroy,AfterViewInit {


    _produits: Produit[];
    swTableLoaded = false;
    swForm: FormGroup;
    listData: any;
    _shownProduits: Produit[];
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

    ngAfterViewInit(): void {
        this._changeDetectorRef.markForCheck();
    }

  ngOnInit(): void {

      this.addProduit();

      this._sharedService._produitCurrent.subscribe(
          (produits) => {
              this._produits = produits;
          }
      );

      this._sharedService.changeProduit(this._produits);
      this._changeDetectorRef.markForCheck();
  }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addProduit(){
        this._releveBancaireService.getProduits().subscribe(
            (data) => {
                this._produits = data;
                this._shownProduits = this._produits;
                console.log('DATA ', data);
            }
        );

        this.listData = this.swForm.value;
        this._sharedService.addProduit(this.listData);
        this.swTableLoaded = true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    onClick(element){
      this._produits.forEach((produit) => {
          if (produit.produitLabel === element){
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
