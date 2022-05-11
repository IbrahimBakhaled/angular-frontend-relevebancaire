import {LigneReleve} from '../../../mock-api/common/relevebancaire/ligne-releve';


export interface ITask {
    releveBancaireId: number;
    proccessesName: string;
    taskId: number;
    assignee: string;
    name: string;
    description: string;
    processDefinitionId: string;
    processInstanceId: string;
    createTime: string;
}





