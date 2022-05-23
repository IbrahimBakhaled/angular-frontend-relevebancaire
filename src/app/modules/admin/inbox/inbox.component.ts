import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef, OnInit
} from '@angular/core';

@Component({
    selector     : 'inbox',
    templateUrl  : './inbox.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent implements OnInit
{
   constructor(private _changeDetectorRef: ChangeDetectorRef) {
   }

    ngOnInit(): void {
       this._changeDetectorRef.detectChanges();
    }

}
