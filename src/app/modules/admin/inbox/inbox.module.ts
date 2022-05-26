import { NgModule } from '@angular/core';
import { InboxComponent } from 'app/modules/admin/inbox/inbox.component';
import {Route, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import { TaskdetailsComponent } from './taskdetails/taskdetails.component';
import {MatTabsModule} from '@angular/material/tabs';
import { InboxmanagementComponent } from './inboxmanagement/inboxmanagement.component';
import {InboxesResolvers} from './inbox.resolvers';
import {ActivitiworkflowService} from '../../services/activitiworkflow.service';
import {MatRippleModule} from '@angular/material/core';
import {RelevebancaireService} from '../../services/relevebancaire.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { QualificationacteurComponent } from './qualificationacteur/qualificationacteur.component';
import {MatDialogModule} from '@angular/material/dialog';
import { QualifierswComponent } from './qualifiersw/qualifiersw.component';
import {MatSelectModule} from '@angular/material/select';
import {FuseAlertModule} from '../../../../@fuse/components/alert';

const inboxRoutes: Route[] = [
    {
        path     : '',
        component: TaskdetailsComponent
    },

    {
        path: ':taskId',
        component : InboxmanagementComponent,
        resolve : {
            task : InboxesResolvers
        }
    }
];

@NgModule({
  declarations: [
    InboxComponent,
    TaskdetailsComponent,
    InboxmanagementComponent,
    QualificationacteurComponent,
    QualifierswComponent
  ],
    imports: [
        RouterModule.forChild(inboxRoutes),
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        NgApexchartsModule,
        MatButtonModule,
        MatSortModule,
        MatTabsModule,
        MatRippleModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        FuseAlertModule
    ],
    providers: [
        ActivitiworkflowService
    ]
})
export class InboxModule { }
