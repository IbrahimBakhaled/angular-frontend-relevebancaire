import {LigneReleve} from './ligne-releve';

export class ReleveBancaire{

    releveBancaireId: number;
    dateReception: Date;
    label: string;
    nbrLignes: number;
    nbrOperationCredit: number;
    nbrOperationDebit: number;
    soldeInitial: number;
    soleFinal: number;
    status: string;
    lignereleve: LigneReleve [];
}
