import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Material Modules
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RequestsComponent } from './layout/requests/requests.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule}  from '@angular/material/table';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule,  } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { ClipboardModule } from '@angular/cdk/clipboard';

//Angular Fire Modules
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';


import { MerchantsComponent } from './layout/merchants/merchants.component';

import { SettingsComponent } from './layout/settings/settings.component';
import { PromotionsComponent } from './layout/promotions/promotions.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { RequestDetailsComponent } from './layout/request-details/request-details.component';
import { SectionsComponent } from './layout/sections/sections.component';
import { NewSectionComponent } from './layout/new-section/new-section.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NewMenuItemComponent } from './layout/new-menu-item/new-menu-item.component';
import { NewMerchantComponent } from './layout/new-merchant/new-merchant.component';
import { EditmenuComponent } from './layout/editmenu/editmenu.component';
import { ProductsComponent } from './layout/products/products.component';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { NewBannerComponent } from './new-banner/new-banner.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { DriversComponent } from './layout/drivers/drivers.component';

import { SystemUsersComponent } from './layout/system-users/system-users.component';
import { CustomersComponent } from './layout/customers/customers.component';
import { InviteUserComponent } from './layout/invite-user/invite-user.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NewDriverComponent } from './new-driver/new-driver.component';
import { EditMerchantComponent } from './layout/edit-merchant/edit-merchant.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [

    {
      requireDisplayName: true,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    RequestsComponent,
    SidebarComponent,

    MerchantsComponent,

    NewMenuItemComponent,
    SettingsComponent,
    PromotionsComponent,
    DashboardComponent,
    RequestDetailsComponent,
    SectionsComponent,
    NewSectionComponent,
    NewMerchantComponent,
    EditmenuComponent,
    ProductsComponent,
    AssignDriverComponent,
    NewBannerComponent,
    LoginComponent,
    DriversComponent,

    SystemUsersComponent,
    CustomersComponent,
    InviteUserComponent,
    ConfirmDialogComponent,
    NewDriverComponent,
    EditMerchantComponent,
    UnauthorizedComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    //Material Modules
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    LayoutModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTableModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    ClipboardModule,

    //angular fire modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ImageCropperModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
