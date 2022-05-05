import { NgModule } from '@angular/core';
import { InboxComponent } from 'app/modules/admin/inbox/inbox.component';
import {Route, RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatButtonModule} from "@angular/material/button";
import {MatSortModule} from "@angular/material/sort";

const inboxRoutes: Route[] = [
    {
        path     : '',
        component: InboxComponent
    }
];

@NgModule({
  declarations: [
    InboxComponent
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
    MatSortModule
  ]
})
export class InboxModule { }
