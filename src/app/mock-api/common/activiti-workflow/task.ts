import {ITask} from '../../../modules/admin/inbox/tasks.types';

export class Task implements Required<ITask>{

    id: number;
    releveBancaireId: number;
    proccessesName: string;
    taskId: number;
    assignee: string;
    name: string;
    description: string;
    processDefinitionId: string;
    processInstanceId: string;
    createTime: string;


    constructor(task: ITask) {
        this.releveBancaireId = task.releveBancaireId;
        this.proccessesName = task.proccessesName;
        this.taskId = task.taskId;
        this.assignee = task.assignee;
        this.name = task.name;
        this.description = task.description;
        this.processDefinitionId = task.processDefinitionId;
        this.processInstanceId = task.processInstanceId;
        this.createTime = task.createTime;
    }
}
