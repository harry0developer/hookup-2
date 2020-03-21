import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefaultProfilePage } from './default-profile';

@NgModule({
  declarations: [
    DefaultProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DefaultProfilePage),
  ],
})
export class DefaultProfilePageModule {}
