import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { SellerDetailsPage } from '../seller-details/seller-details';
import { COLLECTION, USER_TYPE, MESSAGES, STORAGE_KEY, DEFAULT_PIC } from '../../utils/consts';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Photo } from '../../models/photo';
import { UserLocation, Geo } from '../../models/location';
import { bounceIn } from '../../utils/animations';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { FilterPage } from '../filter/filter';
import { Filter } from '../../models/filter';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-sellers',
  templateUrl: 'sellers.html',
  animations: [bounceIn]

})
export class SellersPage {
  sellers: any[] = [];
  profile: User;
  images = [];
  oldImages = [];
  imgs = [];
  onlineUsers = [];
  isLoading: boolean = true;
  filter: Filter;
  locationAccess: {
    allowed: boolean,
    msg: string;
  };
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
    public mediaProvider: MediaProvider,
    public modalCtrl: ModalController,
    public firebaseApiProvider: FirebaseApiProvider,
    public zone: NgZone) {
  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    this.filter = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.filter);
    if (!this.filter || !this.filter.age) {
      this.filter = {
        distance: 100,
        age: 99,
        race: 'all'
      };
    }
    this.isLoading = true;
    this.locationAccess = {
      allowed: this.profile.location && this.profile.location.lat && this.profile.location.lat ? true : false,
      msg: MESSAGES.locationAccessError
    };

    this.getSellers();
  }


  getSellers() {
    const ref = this.firebaseApiProvider.firebaseRef.ref(`/${COLLECTION.users}`);
    ref.on("value", snap => {
      this.zone.run(() => {
        const users = this.firebaseApiProvider.convertObjectToArray(snap.val());
        const sellers = users.filter(u => u.userType === USER_TYPE.seller);
        const unOrderedSellers = this.calculateUserDistance(sellers);
        this.sellers = this.filterSellers(unOrderedSellers);
        this.isLoading = false;
      });
    });
  }

  filterSellers(sellers: User[]): User[] {
    if (this.filter.race) {
      const race = this.filter.race.toLocaleLowerCase() !== 'all' ? sellers.filter(s => s.race.toLocaleLowerCase() === this.filter.race.toLocaleLowerCase()) : sellers;
      return race.filter(a => a.age <= this.filter.age);
    }
    return sellers;
  }

  calculateUserDistance(users: User[]): User[] {
    if (users && users.length > 0 && this.profile.location && this.profile.location.lat && this.profile.location.lng) {
      const userz: User[] = this.dataProvider.getLocationFromGeo(users, this.profile);
      return userz;
    }
    return users;
  }

  filterUsers() {
    let modal = this.modalCtrl.create(FilterPage, { filter: this.filter });
    modal.onDidDismiss(data => {
      if (data) {
        this.filter = data;
        this.getSellers();
      }
    });
    modal.present();
  }

  getUserDistance(user: User): string {
    return user.distance && user.distance !== '-999' ? user.distance.toString() : 'unknown';
  }

  viewProfile(user) {
    let modal = this.modalCtrl.create(SellerDetailsPage, { user, locationAccess: this.locationAccess });
    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    });
    modal.present();
  }

  snapshotToArray(snapshot): any[] {
    let returnArr = [];
    snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      if (item.userType.toLowerCase() === USER_TYPE.seller) {
        returnArr.push(item);
      }
    });
    this.isLoading = false;
    return returnArr;
  }

  selectPhotoAndUpload() {
    this.mediaProvider.selectPhoto().then(imageData => {
      const captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(this.oldImages, captureDataUrl);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  takePhotoAndUpload() {
    this.mediaProvider.takePhoto().then(imageData => {
      const captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(this.oldImages, captureDataUrl);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  getProfilePicture(user): string {
    return user && user.profilePic ? user.profilePic : DEFAULT_PIC;
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

  // getUserProfile(user: User) {
  //   const imagesRef = `${COLLECTION.images}/${user.uid}`;
  //   const firebaseDBRef = firebase.database().ref(`${imagesRef}`);
  //   firebaseDBRef.on('value', tasksnap => {
  //     let tmp = [];
  //     tasksnap.forEach(taskData => {
  //       tmp.push({ key: taskData.key, ...taskData.val() })
  //     });
  //     console.log(tmp);
  //     // this.downloadImages(tmp);
  //   });
  // }

  uploadPhotoAndUpdateUserDatabase(oldImages, newImage): any {
    // this.feedbackProvider.presentLoading('Please wait, Uploading...');
    // let storageRef = firebase.storage().ref();
    // const filename = Math.floor(Date.now() / 1000);
    // const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    // imageRef.putString(newImage, firebase.storage.StringFormat.DATA_URL).then(() => {
    //   this.feedbackProvider.dismissLoading();
    //   const newImageObject: Photo = {
    //     url: filename + '.jpg',
    //     dateCreated: this.dataProvider.getDateTime()
    //   }
    //   this.dataProvider.addItemToUserDB(COLLECTION.images, this.profile, newImageObject);
    // }).catch(err => {
    //   this.feedbackProvider.dismissLoading();
    //   this.feedbackProvider.presentToast('Image upload failed');
    // });

  }

}