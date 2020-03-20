import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Issue } from '../../models/issue';

@IonicPage()
@Component({
  selector: 'page-report-bug',
  templateUrl: 'report-bug.html',
})
export class ReportBugPage {

  issue: Issue = {
    category: '',
    description: ''
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  submitFeedback() {
    console.log('Feedback sent');
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
