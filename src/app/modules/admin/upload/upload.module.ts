import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UploadComponent } from 'app/modules/admin/upload/upload.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatTabsModule} from '@angular/material/tabs';
import { FuseCardModule } from '@fuse/components/card';
import {MatMenuModule} from '@angular/material/menu';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatSortModule} from '@angular/material/sort';
import {FuseAlertModule} from '../../../../@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';

const uploadRoutes: Route[] = [
    {
        path     : '',
        component: UploadComponent
    },

];

@NgModule({
    declarations: [
        UploadComponent
    ],
  imports: [
    RouterModule.forChild(uploadRoutes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MaterialFileInputModule,
    MatTabsModule,
    FuseCardModule,
    MatMenuModule,
    NgApexchartsModule,
    MatTableModule,
    CommonModule,
    MatSortModule,
    FuseAlertModule,
    FuseConfirmationModule
  ]
})
export class UploadModule
{
}
