import {
    Component,
    ElementRef,
    OnDestroy,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import {ReleveBancaire} from '../../../mock-api/common/relevebancaire/releve-bancaire';
import {LigneReleve} from '../../../mock-api/common/relevebancaire/ligne-releve';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RelevebancaireService} from '../../services/relevebancaire.service';
import { FuseCardComponent } from '@fuse/components/card';
import {MatTableDataSource} from '@angular/material/table';
import {FileData} from '../../../mock-api/common/filedata/file-data';
import {debounceTime, Subject, switchMap, takeUntil, timer} from 'rxjs';
import {ActivitiworkflowService} from '../../services/activitiworkflow.service';
import {FuseConfirmationService} from '../../../../@fuse/services/confirmation';


@Component({
    selector     : 'upload',
    templateUrl  : './upload.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UploadComponent implements OnDestroy
{
    @ViewChildren(FuseCardComponent, {read: ElementRef}) private _fuseCards: QueryList<ElementRef>;
    relevebancaire!: ReleveBancaire[];
    lignereleve: LigneReleve[] = [];
    checkoutFormGroup: FormGroup;
    fileSize: string;
    fileName: string;
    filelastModifiedDate: string;
    fileType: string;
    data: any;
    fileData: FileData;
    _fileReader: any;
    fileUrl: any;
    cat = '';
    configForm: FormGroup;

    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    csvRecords: any;
    recentTransactionsTableColumns: string[] = ['fileSize', 'fileName', 'filelastModifiedDate', 'fileType'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(public formBuilder: FormBuilder,
                private relevebancaireService: RelevebancaireService,
                private activitiWorkflowService: ActivitiworkflowService,
                private _fuseConfirmationService: FuseConfirmationService)
    {
    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {

        this.releveBancaires();

        this.checkoutFormGroup = this.formBuilder.group( {
            relevebancaire: new FormControl('')
        });

        this.configForm = this.formBuilder.group({
            title      : 'Fichier téléchargé',
            message    : 'Vous avez téléchargé le releve bancaire avec succès, vérifiez la base de données mysql.',
            icon       : this.formBuilder.group({
                show : true,
                name : 'heroicons_outline:badge-check',
                color: 'success'
            }),
            actions    : this.formBuilder.group({

                cancel : this.formBuilder.group({
                    show : true,
                    label: 'Fermer'
                })
            }),
            dismissible: true
        });
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }




    fileChangeListener($event: any): void {

        this.fileSize = Math.round($event.target.files[0].size /1024) + 'KB';
        this.fileName = $event.target.files[0].name;
        this.fileType = $event.target.files[0].type;
        this.filelastModifiedDate = new Date($event.target.files[0].lastModified).toLocaleDateString();
        this.fileUrl =  $event.target.files[0].url;
        // console.log('this.fileUrl ', this.fileUrl);

        // console.log(this.fileName, this.fileType);

        // console.log('submitted here');
        const file = $event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const data = fileReader.result;
            this.storeResults(data);
            this._fileReader = data;
            // console.log('FileREAAAAAAAAAAADER \n', data);
            // console.log(this._fileReader);
            this.parseData(data);
        };
        fileReader.readAsText(file);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    storeResults(result) {
    this.cat = result;
}

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    parseData(data: string | ArrayBuffer | null){
        const dummyArr: string[][] = [];
        const eachLine = data?.toString().split('\n');
        eachLine?.forEach((line: string) => {
            const arr = [];
            let str = '';
            for(const element of line) {
                if (element == ';') {
                    arr.push(str);
                    str = '';
                } else {
                    str += element;
                }
            }
            arr.push(str);
            dummyArr.push(arr);
            this.csvRecords = dummyArr;
        });
        // console.log(dummyArr);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    onSubmit() {




        const releveBancaire = new ReleveBancaire();


        let nLines = 0;
        let numberOfOperationCredit =0;
        let numberOfOperationDebit = 0;
        const label = 'Label coming from onSubmit() method';

        for (let i = 0, n = this.csvRecords.length; i < n;i++) {
            if (this.csvRecords[i][10] === 'C'){
                numberOfOperationCredit++;
            } else if (this.csvRecords[i][10] === 'D'){
                numberOfOperationDebit++;
            }
            // console.log("showing this .csvrecords " + this.csvRecords);


            nLines++;
        }


        releveBancaire.nbrLignes =this.csvRecords.length;
        releveBancaire.nbrOperationCredit = numberOfOperationCredit;
        releveBancaire.nbrOperationDebit = numberOfOperationDebit;
        releveBancaire.label = this.fileName.slice(0, -4);
        releveBancaire.soldeInitial=this.csvRecords[0][6];
        releveBancaire.soleFinal = this.csvRecords[this.csvRecords.length-1][6];
        // console.log("relevebancaire solde final " + releveBancaire.soleFinal , + " __ " + releveBancaire.soldeInitial)

        for (const element of this.csvRecords.slice(1,-1)) {
            const l = new LigneReleve();
            l.refCdg = element[0];
            l.dateOperation = element[1];
            l.dateValue = element[2];
            l.modePaiment = element[3];
            l.rib = element[5];
            l.refPaiment = element[6];
            l.operationNature = element[7];
            l.montant = element[9];
            l.creditDebit = element[10];
            l.numCheck = element[11];
            this.lignereleve.push(l);
        }

        releveBancaire.lignereleve = this.lignereleve;
        // console.log(releveBancaire.lignereleve);
        this.relevebancaireService.postReleveBancaire(releveBancaire)
        .pipe(
            switchMap(response => this.activitiWorkflowService.createPreccess(response.releveBancaireId).pipe(takeUntil(this._unsubscribeAll), debounceTime(3000)))
        )
        .subscribe({
            next : (data: any) => data
        });

        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }



    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    releveBancaires()
    {
        this.relevebancaireService.getReleveBancaires().subscribe(
            (data) => {
                this.relevebancaire = data;
                // console.log("showing data from MySQL", data);
            }
        );
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
