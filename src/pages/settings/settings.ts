import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, ActionSheetController, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { User } from '../../models/user';
import { TermsPage } from '../terms/terms';
import { ReportBugPage } from '../report-bug/report-bug';
import { STORAGE_KEY, COLLECTION, STATUS } from '../../utils/consts';
import { AppVersion } from '@ionic-native/app-version';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  profile: User;
  version;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public app: App,
    private platform: Platform,
    private appVersion: AppVersion,
    private openNativeSettings: OpenNativeSettings,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    if (this.platform.is(('cordova'))) {
      this.appVersion.getVersionNumber().then(v => {
        this.version = v;
      });
    }
  }

  deactivateAccout() {
    this.firebaseApiProvider.updateItem(COLLECTION.users, this.profile.uid, { status: STATUS.deactive }).then(() => {
      this.logout();
    }).catch(() => {
      this.feedbackProvider.presentAlert('Deactivate error', 'Oops something went wrong. please try again');
    })
  }

  presentDeactivateAccountActionsheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'Yes, deactivate',
          role: 'destructive',
          handler: () => {
            this.deactivateAccout();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


  presentLogoutActionsheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to logout',
      buttons: [
        {
          text: 'Yes, Logout',
          role: 'destructive',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  allowLocationAccess() {
    this.openNativeSettings.open('location').then(res => {
    }).catch(err => {
      this.feedbackProvider.presentToast('Oops an error has occured, please try again.');
    })
  }

  reportBug() {
    let reportBugModal = this.modalCtrl.create(ReportBugPage, { profile: this.profile });
    reportBugModal.onDidDismiss((data) => {
      console.log(data);
    });
    reportBugModal.present();
  }

  showTermsAndConditions() {
    this.navCtrl.push(TermsPage);
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.location, null);
      this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.user, null);
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {
      this.feedbackProvider.presentAlert('Logout failed', 'Oopsie, this is rather odd. Please try again');
    });
  }
}
