import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitorPage } from './visitor';

@NgModule({
  declarations: [
    VisitorPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitorPage),
  ],
})
export class VisitorPageModule {}
