import {LigneReleve} from './ligne-releve';

export class ReleveBancaire {

    dateReception!: Date;
    label!: string;
    nbrLignes!: number;
    nbrOperationCredit!: number;
    nbrOperationDebit!: number;
    soldeInitial!: number;
    soleFinal!: number;
    lignereleve!: LigneReleve [];
}
