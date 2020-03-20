import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../models/user';
import { NationalityPage } from '../nationality/nationality';
import { SetupPage } from '../setup/setup';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { COLLECTION } from '../../utils/consts';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { DataProvider } from '../../providers/data/data';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupType: string = '';

  emailSignup = {
    nickname: '',
    email: '',
    password: '',
    uid: ''
  }

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

  phoneSignup = {
    nickname: '',
    otpCode: '',
    phone: {
      flag: "🇿🇦",
      code: "+27",
      number: ''
    }
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private firebaseApiProvider: FirebaseApiProvider,
    private zone: NgZone,
    public feedbackProvider: FeedbackProvider) {
  }

  ionViewDidLoad() {
    this.signupType = this.navParams.get('signupType'); // 'emailAddress'// 
    this.firebaseApiProvider.getAllItems(COLLECTION.users).then(res => {
      this.users = this.firebaseApiProvider.convertObjectToArray(res.val());
    }).catch(err => {
      console.log(err);
    })
  }

  signupWithPhoneNumber() {
    console.log(this.phoneSignup);
  }

  signupWithEmailAndPassword() {
    const registeredUsers = this.users.filter(user => user.email.toLocaleLowerCase() === this.emailSignup.email.toLocaleLowerCase());
    console.log(registeredUsers);
    if (registeredUsers && registeredUsers.length > 0) {
      this.feedbackProvider.presentAlert('Signup failed', 'Email address is already registered');
    } else {
      this.navCtrl.push(SetupPage, { data: this.emailSignup });
    }
  }

  cancelSignup() {
    this.navCtrl.pop();
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
        this.phoneSignup.phone.number = data.number;
        this.phoneSignup.phone.code = data.dial_code;
        this.phoneSignup.phone.flag = data.flag;
      }
    });
    modal.present();
  }
}
