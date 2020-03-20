import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerDetailsPage } from './seller-details';

@NgModule({
  declarations: [
    SellerDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerDetailsPage),
  ],
})
export class SellerDetailsPageModule {}
