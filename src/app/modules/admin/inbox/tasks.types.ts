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






export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
