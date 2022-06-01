import {Route} from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

export const authSignInRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignInComponent
    }
];



//        "@okta/okta-angular": "^3.2.2",
//        "@okta/okta-signin-widget": "^5.10.1",
