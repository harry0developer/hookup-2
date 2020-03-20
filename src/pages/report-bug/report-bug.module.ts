import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportBugPage } from './report-bug';

@NgModule({
  declarations: [
    ReportBugPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportBugPage),
  ],
})
export class ReportBugPageModule {}
