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
    private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _releveBancaireService: RelevebancaireService,
              private formBuilder: FormBuilder,
              private _sharedService: SharedServiceService,
              private _changeDetectorRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngAfterViewInit(): void {
        this._changeDetectorRef.markForCheck();
    }

  ngOnInit(): void {
      this.getProduits();

      this.swForm = this.formBuilder.group({
          produit:[''],
          montant: ['']

      });
      this._changeDetectorRef.markForCheck();



      this._sharedService._produitSource.subscribe(
          (produits) => {
              this._produits = produits;
          }
      );

      this._sharedService.changeProduit(this._produits);
      this._changeDetectorRef.markForCheck();
  }




    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    getProduits(){
      this._releveBancaireService.getProduits().subscribe(
          (data) => {
              this._produits = data;
              this._sharedService.changeProduit(this._produits);
          }
      );
        this._changeDetectorRef.markForCheck();
  }


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    addProduit(){
        this.listData = this.swForm.value;
        this.swTableLoaded = true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    removeProduit(element){
        if(element === this.listData){
        delete this.listData;
        }
        this._changeDetectorRef.markForCheck();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    onClick(element){
      this._produits.forEach((produit) => {
          if (produit.produitLabel === element){
              produit.ligneReleve = this.data.selectedLigneReleve;
          }
      });
      this._sharedService.changeProduit(this._produits);

        console.log()
        this._changeDetectorRef.markForCheck();
    }



    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
