import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NationalityPage } from './nationality';

@NgModule({
  declarations: [
    NationalityPage,
  ],
  imports: [
    IonicPageModule.forChild(NationalityPage),
  ],
})
export class NationalityPageModule {}
