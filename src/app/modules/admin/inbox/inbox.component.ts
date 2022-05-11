import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector     : 'inbox',
    templateUrl  : './inbox.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent
{
   constructor() {
   }

}
