import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkErrorPage } from './network-error';

@NgModule({
  declarations: [
    NetworkErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworkErrorPage),
  ],
})
export class NetworkErrorPageModule {}
