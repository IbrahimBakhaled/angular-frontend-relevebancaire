import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {filter, map, Observable} from 'rxjs';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {AuthState, OktaAuth} from '@okta/okta-auth-js';


@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    public isAuthenticated$!: Observable<boolean>;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */





    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _oktaStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth
    )
    {

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
            filter((s: AuthState) => !!s),
            map((s: AuthState) => s.isAuthenticated ?? false)
        );

    // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['hughes.brian@company.com', [Validators.required, Validators.email]],
            password  : ['admin', Validators.required],
            rememberMe: ['']
        });

    }




    public async signIn(): Promise<void> {
        await this._oktaAuth.signInWithRedirect().then(
            _ => this._router.navigate([''])
        );
    }
    public async signOut(): Promise<void> {
        await this._oktaAuth.signOut();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    // signIn(): void
    // {
    //     // Return if the form is invalid
    //     if ( this.signInForm.invalid )
    //     {
    //         return;
    //     }
    //
    //     // Disable the form
    //     this.signInForm.disable();
    //
    //         // Hide the alert
    //         this.showAlert = false;
    //
    //     // Sign in
    //     this._authService.signIn(this.signInForm.value)
    //         .subscribe(
    //             () => {
    //
    //                     // Set the redirect url.
    //                     // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
    //                     // to the correct page after a successful sign in. This way, that url can be set via
    //                     // routing file and we don't have to touch here.
    //                     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    //
    //                     // Navigate to the redirect url
    //                     this._router.navigateByUrl(redirectURL);
    //
    //                 },
    //                 (response) => {
    //
    //                     // Re-enable the form
    //                     this.signInForm.enable();
    //
    //                     // Reset the form
    //                     this.signInNgForm.resetForm();
    //
    //                     // Set the alert
    //                     this.alert = {
    //                         type   : 'error',
    //                         message: 'Wrong email or password'
    //                     };
    //
    //                 // Show the alert
    //                 this.showAlert = true;
    //             }
    //         );
    // }
}
