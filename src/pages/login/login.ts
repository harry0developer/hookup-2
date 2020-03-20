import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { NationalityPage } from '../nationality/nationality';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { AuthProvider } from '../../providers/auth/auth';
import { STORAGE_KEY, MESSAGES, COLLECTION, USER_NOT_FOUND, INVALID_PASSWORD, USER_TYPE, EVENTS } from '../../utils/consts';
import { LocationProvider } from '../../providers/location/location';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { DataProvider } from '../../providers/data/data';
import { Geo } from '../../models/location';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginType: string = '';
  data = {
    email: '',
    password: '',
    otpCode: '',
    phonenumber: '',
    phone: {
      flag: "🇿🇦",
      code: "+27",
      number: ''
    },
    location: { address: '' }
  }
  type = 'password';
  showPass = false;
  showOTPPage = false;
  verificationId: string = '';

  // user: any;
  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  countries: any = [];
  users: User[] = [];

  profile: User;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public feedbackProvider: FeedbackProvider,
    public authProvider: AuthProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public locationProvider: LocationProvider,
    public dataProvider: DataProvider,
    public ionEvents: Events,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loginType = this.navParams.get('loginType');
  }

  loginWithPhoneNumber() {
    console.log('loginWithPhoneNumber');
  }

  loginWithEmailAndPassword() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signInWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      const isVerified = res.user.emailVerified;
      this.firebaseApiProvider.getItem(COLLECTION.users, res.user.uid).then(snap => {
        this.feedbackProvider.dismissLoading();
        this.profile = snap.val();
        this.profile.verified = isVerified;
        this.getUserLocation();
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast(MESSAGES.oops);
      });
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      if (err.code === USER_NOT_FOUND || err.code == INVALID_PASSWORD) {
        this.feedbackProvider.presentErrorAlert(MESSAGES.loginFailed, MESSAGES.emailNotRegistered);
      }
    });
  }

  getUserLocation() {
    this.feedbackProvider.presentLoading('Getting location...');
    this.locationProvider.getLocation().then(res => {
      this.feedbackProvider.dismissLoading();
      const loc: Geo = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      };
      console.log(res);

      this.updateUserProfile(this.profile, loc);
      this.navigate();
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.handleLocationError();
    });
  }

  updateUserProfile(user: User, location: Geo) {
    this.feedbackProvider.presentLoading('Updating location...');
    this.firebaseApiProvider.updateItem(COLLECTION.users, user.uid, { location }).then(loc => {
      console.log(loc);
      this.feedbackProvider.dismissLoading();
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
    })
  }

  navigate() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, this.profile);
    this.ionEvents.publish(EVENTS.loggedIn, { user: this.profile });
    this.profile.userType === USER_TYPE.buyer ? this.navCtrl.setRoot(SellersPage, { user: this.profile }) : this.navCtrl.setRoot(DashboardPage, { user: this.profile })
  }

  handleLocationError() {
    const confirm = this.alertCtrl.create({
      title: 'Location error',
      message: 'Ooops, we could not get your current location, please allow access to your location',
      buttons: [
        {
          text: 'Continue',
          handler: () => {
            this.navigate();
          }
        },
        {
          text: 'Retry',
          handler: () => {
            this.getUserLocation();
          }
        }
      ]
    });
    confirm.present();
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  getCountryCode() {
    let modal = this.modalCtrl.create(NationalityPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.data.phone.number = data.number;
        this.data.phone.code = data.dial_code;
        this.data.phone.flag = data.flag;
      }
    });
    modal.present();
  }
}
