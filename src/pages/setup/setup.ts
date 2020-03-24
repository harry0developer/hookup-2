import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { PlacesPage } from '../places/places';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, USER_TYPE, STORAGE_KEY, MESSAGES, STATUS } from '../../utils/consts';
import { User } from '../../models/user';
import { Slides } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { SellersPage } from '../sellers/sellers';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { AuthProvider } from '../../providers/auth/auth';
import { LocationProvider } from '../../providers/location/location';
import { Geo } from '../../models/location';

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  @ViewChild(Slides) slides: Slides;

  loc: string;
  data: User = {
    nickname: '',
    gender: '',
    age: 0,
    race: '',
    bodyType: '',
    height: 0,
    email: '',
    phone: '',
    password: '',
    uid: '',
    dateCreated: '',
    userType: '',
    verified: false,
    profilePic: '',
    location: null,
    status: '',
    avatar: ''
  };

  avatarIndex: number = -999;

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
    '/assets/imgs/profile/men/12.svg',
    '/assets/imgs/profile/men/13.svg',
    '/assets/imgs/profile/men/14.svg',
    '/assets/imgs/profile/men/15.svg',
    '/assets/imgs/profile/men/16.svg'
  ];

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public feedbackProvider: FeedbackProvider,
    public locationProvider: LocationProvider,
    public alertCtrl: AlertController,
    public firebaseApiProvider: FirebaseApiProvider) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    const data: User = this.navParams.get('data');
    if (data) {
      if (data.nickname && data.email) { //email signup
        this.data.nickname = data.nickname;
        this.data.email = data.email;
        this.data.password = data.password;
        this.data.uid = data.uid;
        this.data.status = STATUS.active;
        this.data.dateCreated = this.dataProvider.getDateTime();
      } else { //phone signup
        this.data.nickname = data.nickname;
        this.data.phone = data.phone;
        this.data.uid = data.uid;
        this.data.status = STATUS.active;
        this.data.dateCreated = this.dataProvider.getDateTime();
      }
    } else {
      console.log('Cannot be here');
    }
  }

  addUserToRealtimeDatabase(user) {
    this.firebaseApiProvider.addItemWithKey(COLLECTION.users, user.uid, user).then(() => {
      this.getUserLocation();
    }).catch(err => {
      this.feedbackProvider.presentAlert(MESSAGES.signupFailed, 'Oops something went wrong, please try again');
    });
  }

  completeSignup() {
    this.feedbackProvider.presentLoading();
    this.authProvider.signUpWithEmailAndPassword(this.data.email, this.data.password).then(res => {
      this.feedbackProvider.dismissLoading();
      this.data.uid = res.user.uid;
      this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.firstTimeLogin, true);
      this.addUserToRealtimeDatabase(this.data);
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log(err);
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
      this.updateUserProfile(this.data, loc);
      this.navigate();
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      this.handleLocationError();
    });
  }

  navigate() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.user, this.data);
    if (this.data.userType.toLocaleLowerCase() === USER_TYPE.seller) {
      this.navCtrl.setRoot(DashboardPage);
    } else {
      this.navCtrl.setRoot(SellersPage);
    }
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

  handleLocationError() {
    let alert = this.alertCtrl.create({
      title: 'Location error',
      message: 'An error occured while retrieving your location. Would you like to retry?',
      buttons: [
        {
          text: "Don't retry",
          role: 'cancel',
          handler: () => {
            console.log('Dont retry clicked');
            this.navigate();
          }
        },
        {
          text: 'Yes retry',
          handler: () => {
            console.log('Retry clicked');
            this.getUserLocation();
          }
        }
      ]
    });
    alert.present();
  }

  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  previousSlide() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  selectAvatar(index: number) {
    console.log(index);
    this.avatarIndex = index;
  }

  slideChange(data) {
    console.log(data);
  }

  isFirstSlide(): boolean {
    return this.slides.isBeginning();
  }

  isLastSlide(): boolean {
    return this.slides.isEnd();
  }

  getSlideNumber(): string {
    return `${this.slides.getActiveIndex()} of 6`;
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(PlacesPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.loc = data.address;
      }
    });
    modal.present();
  }
}
