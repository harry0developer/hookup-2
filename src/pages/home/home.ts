import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { TermsPage } from '../terms/terms';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../models/user';
import { STORAGE_KEY, USER_TYPE, EVENTS } from '../../utils/consts';
import { SellersPage } from '../sellers/sellers';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  readTCsAndCs: boolean = true;
  profile: User;
  avatars = [
    '/assets/imgs/profile/men/1.svg',
    '/assets/imgs/profile/men/2.svg',
    '/assets/imgs/profile/men/3.svg',
    '/assets/imgs/profile/men/4.svg',
    '/assets/imgs/profile/men/5.svg',
    '/assets/imgs/profile/men/6.svg',
    '/assets/imgs/profile/men/7.svg',
    '/assets/imgs/profile/men/8.svg',
    '/assets/imgs/profile/men/9.svg',
    '/assets/imgs/profile/men/10.svg',
    '/assets/imgs/profile/men/11.svg',
    '/assets/imgs/profile/men/12.svg'
  ];

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public ionEvents: Events,
    public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.profile = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    if (this.profile && this.profile.uid) {
      this.navigate();
    }
  }

  navigate() {
    this.ionEvents.publish(EVENTS.loggedIn, this.profile);
    this.profile.userType === USER_TYPE.buyer ?
      this.navCtrl.setRoot(SellersPage, { user: this.profile }) :
      this.navCtrl.setRoot(DashboardPage, { user: this.profile });
  }

  loginWithEmailAddress() {
    console.log('Pushing login');

    this.navCtrl.push(LoginPage, { loginType: 'emailAddress' });
  }

  loginWithPhoneNumber() {
    this.navCtrl.push(LoginPage, { loginType: 'phoneNumber' });
  }

  signupWithEmailAddress() {
    this.navCtrl.push(SignupPage, { signupType: 'emailAddress' });
  }

  signupWithPhoneNumber() {
    this.navCtrl.push(SignupPage, { signupType: 'phoneNumber' });
  }

  presentLoginActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Login with',
      buttons: [
        {
          text: 'Phone number',
          icon: 'call',
          handler: () => {
            this.loginWithPhoneNumber();
          }
        },
        {
          text: 'Email address',
          icon: 'mail',
          handler: () => {
            this.loginWithEmailAddress();
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

  presentSignupActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Signup with',
      buttons: [
        {
          text: 'Phone number',
          icon: 'call',
          handler: () => {
            this.signupWithPhoneNumber();
          }
        },
        {
          text: 'Email address',
          icon: 'mail',
          handler: () => {
            this.signupWithEmailAddress();
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

  showTermsAndConditions() {
    this.navCtrl.push(TermsPage);
  }

  getStatus(e) {
    this.readTCsAndCs = e.checked;
  }
}
