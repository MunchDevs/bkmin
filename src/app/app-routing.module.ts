import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './layout/customers/customers.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DriversComponent } from './layout/drivers/drivers.component';
import { EditMerchantComponent } from './layout/edit-merchant/edit-merchant.component';
import { EditmenuComponent } from './layout/editmenu/editmenu.component';
import { LayoutComponent } from './layout/layout.component';
import { MerchantsComponent } from './layout/merchants/merchants.component';
import { NewMenuItemComponent } from './layout/new-menu-item/new-menu-item.component';
import { NewMerchantComponent } from './layout/new-merchant/new-merchant.component';
import { NewSectionComponent } from './layout/new-section/new-section.component';
import { ProductsComponent } from './layout/products/products.component';
import { RequestDetailsComponent } from './layout/request-details/request-details.component';
import { RequestsComponent } from './layout/requests/requests.component';
import { SectionsComponent } from './layout/sections/sections.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { SystemUsersComponent } from './layout/system-users/system-users.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'',component:LayoutComponent, children:[
    {path:'dashboard',component:DashboardComponent},
    {path:'requests',component:RequestsComponent},
    {path:'merchants',component:MerchantsComponent},
    {path:'merchants/:id',component:EditMerchantComponent},
    {path:'merchants/:merchant_id/sections',component:SectionsComponent},
    {path:'merchants/:merchant_id/sections/:idx/products',component:ProductsComponent},
    {path:'customers',component:CustomersComponent},
    {path:'drivers',component:DriversComponent},
    {path:'system-users',component:SystemUsersComponent},
    {path:'settings',component:SettingsComponent},
    {path:'request/:id',component:RequestDetailsComponent},
    {path:'newsection',component:NewSectionComponent},
    {path:'products/new',component:NewMenuItemComponent},
    {path:'newmerchant',component:NewMerchantComponent},
    {path:'products/:id',component:EditmenuComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
