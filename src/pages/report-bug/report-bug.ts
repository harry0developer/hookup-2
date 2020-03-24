import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Issue } from '../../models/issue';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { COLLECTION } from '../../utils/consts';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-report-bug',
  templateUrl: 'report-bug.html',
})
export class ReportBugPage {

  issue: Issue = {
    category: '',
    description: '',
    uid: ''
  };
  profile: User;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseApiProvider: FirebaseApiProvider,
    public feedbackProvider: FeedbackProvider,
    public viewCtrl: ViewController) {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
  }

  submitFeedback() {
    this.issue.uid = this.profile.uid;
    this.firebaseApiProvider.addItem(COLLECTION.feedback, this.issue).then(() => {
      this.feedbackProvider.presentAlert('Feedback sent', 'Thanks for the feedback, we will look into it.')
      this.dismiss();
    }).catch(err => {
      this.feedbackProvider.presentAlert('Oops', 'Something went wrong, please try again');
      this.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
