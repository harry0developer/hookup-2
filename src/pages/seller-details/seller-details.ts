import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ChatPage } from '../chat/chat';
import { COLLECTION, MESSAGES } from '../../utils/consts';
import { Observable } from 'rxjs';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { User } from '../../models/user';
import { Image } from '../../models/image';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { MediaProvider } from '../../providers/media/media';

@IonicPage()
@Component({
  selector: 'page-seller-details',
  templateUrl: 'seller-details.html',
})
export class SellerDetailsPage {
  profile: User;
  user: User;
  isLoading: boolean = false;
  hasImages: boolean = true;
  allRatingsSubscription$: Observable<any>;
  locationAllowed: boolean;
  locationAccess: {
    allowed: boolean,
    msg: string;
  };
  images: Image[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public zone: NgZone,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider) {
    this.isLoading = true;
    this.hasImages = true;
  }

  ionViewDidLoad() {
    this.profile = this.authProvider.getStoredUser();
    this.locationAccess = this.navParams.get('locationAccess');
    this.user = this.navParams.get('user');

    this.getUserImages(this.user);
    this.locationAccess = {
      allowed: this.user.location && this.user.location.lat && this.user.location.lat ? true : false,
      msg: MESSAGES.locationAccessError
    }
  }


  getUserImages(user: User) {
    this.firebaseApiProvider.getItem(COLLECTION.images, user.uid).then(res => {
      const imgObj = res.val();
      if (imgObj) {
        const imgs = this.firebaseApiProvider.convertObjectToArray(imgObj);
        this.downloadImagesFromStorage(user, imgs);
      } else {
        this.images = [];
        this.isLoading = false;
        this.hasImages = false;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  downloadImagesFromStorage(user: User, imgs: Image[]): void {
    this.images = [];
    this.zone.run(() => {
      imgs.forEach(img => {
        this.mediaProvider.getImageByFilename(user.uid, img.url).then(resImg => {
          const myImg = { ...img, path: resImg };
          this.images.push(myImg);
          this.isLoading = false;
          this.hasImages = true;
        }).catch(err => {
          console.log(err);
          this.isLoading = false;
          this.hasImages = true;
        })
      })
    });
  }

  getUserDistance(user: User): string {
    return user.distance && user.distance > "0" ? user.distance.toString() : 'unknown';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // downloadImageFromFirebaseStorage(user: User, img: Image): any {
  //   let dImg;
  //   this.mediaProvider.getImageByFilename(user.uid, img.url).then(resImg => {
  //     const myImg = { ...img, path: resImg };
  //     dImg = myImg;
  //     console.log(myImg);

  //   }).catch(err => {
  //     console.log(err);
  //     dImg = null;
  //   });
  //   return dImg;
  // }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

  getAge(date: string): string {
    return this.dataProvider.getAgeFromDate(date);
  }

  openChats(user) {
    this.navCtrl.push(ChatPage, { user });
  }

  requestUser(user) {
    console.log(user);
  }


  updateCompanyRating(data) {
    // const newRatingData: Ratings = {
    //   id: data.company.id,
    //   rid: this.profile.uid,
    //   rating: data.rating,
    //   dateRated: this.dataProvider.getDateTime()
    // };
    // this.dataProvider.addUserActionToCollection(COLLECTION.ratings, this.allRatings, newRatingData, this.profile.uid);
  }

}
