import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, Events, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY, COLLECTION, OBJECT_NOT_FOUND, ACTION } from '../../utils/consts';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';
import { MediaProvider } from '../../providers/media/media';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import firebase from 'firebase';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { AngularFireDatabase } from '@angular/fire/database';
import { PreviewPage } from '../preview/preview';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  profile: User;
  userRating = 0;
  allRatings: any = [];

  images: string[] = [];
  imagesRef: string;
  isLoading: boolean;
  active: any;
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public mediaProvider: MediaProvider,
    public feedbackProvider: FeedbackProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public afDB: AngularFireDatabase,
    public modalCtrl: ModalController,
    public ionEvents: Events, public zone: NgZone) {
  }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    console.log(this.profile);

    this.imagesRef = `${COLLECTION.images}/${this.profile.uid}`;
    this.getAllImages();

    this.dataProvider.getAllFromCollection(COLLECTION.images).subscribe(r => {
      console.log(r);
    });
  }


  updateDate() {
    this.updateUserProp(COLLECTION.users, this.profile.uid, { dateCreated: this.dataProvider.getDateTime() });
  }

  updateUserProp(ref: string, uid: string, keyValue) {
    console.log(ref, uid, keyValue);

    this.firebaseApiProvider.updateItem(ref, uid, keyValue).then(() => {
      console.log('Updated ', uid);
    }).catch(err => {
      console.log(err);
    })
  }

  previewImage(img) {
    let profileModal = this.modalCtrl.create(PreviewPage, { images: this.images, active: img });
    profileModal.onDidDismiss((action) => {
      if (action === ACTION.delete) {
        this.profile.profilePic = '';
      }
      this.profile = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.user);
    });
    profileModal.present();
  }

  getAllImages() {
    this.isLoading = true;
    const firebaseDBRef = firebase.database().ref(`${this.imagesRef}`);
    firebaseDBRef.on('value', tasksnap => {
      let tmp = [];
      tasksnap.forEach(taskData => {
        tmp.push({ key: taskData.key, ...taskData.val() })
      });
      this.downloadImages(tmp);
    });
  }

  downloadImages(images: any[]) {
    this.images = [];
    this.zone.run(() => {
      if (images && images.length > 0) {
        images.forEach(img => {
          this.mediaProvider.getImageByFilename(this.profile.uid, img.url).then(resImg => {
            const myImg = { ...img, path: resImg };
            this.images.push(myImg);
            this.isLoading = false;
          }).catch(err => {
            console.log(err);
            if (err.code === OBJECT_NOT_FOUND) {
              console.log(err);

              // this.removeImageKeyFromDB(err.message);
            }
          });
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  removeImageKeyFromDB(errorMessage: string) {
    const imgPath = errorMessage.split("\'")[1].split(".")[0].split("/")[2];
    const ref = `${COLLECTION.images}/${this.profile.uid}`;
    this.firebaseApiProvider.removeItem(ref, imgPath).then(() => {
      console.log('Cleaned ...');
    }).catch(err => {
      console.log('Oops something went wrong');

    });
  }

  selectPhoto() {
    this.mediaProvider.selectPhoto().then(imageData => {
      const selectedPhoto = 'data:image/jpeg;base64,' + imageData;
      this.uploadPhotoAndUpdateUserDatabase(selectedPhoto);
    }, error => {
      this.feedbackProvider.presentToast('An error occured uploading the photo');
    });
  }

  private uploadPhotoAndUpdateUserDatabase(image): any {
    this.feedbackProvider.presentLoading('Updating photo...');
    let storageRef = firebase.storage().ref(COLLECTION.images);
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${this.profile.uid}/${filename}.jpg`);

    imageRef.putString(image, firebase.storage.StringFormat.DATA_URL).then(() => {
      const newImage: Photo = {
        url: filename + '.jpg',
        dateCreated: this.dataProvider.getDateTime()
      };
      this.firebaseApiProvider.addImageToRealtimeDB(this.imagesRef, newImage, filename.toString()).then(() => {
        this.feedbackProvider.dismissLoading();
        this.feedbackProvider.presentToast('Photo uploaded successfully');
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        console.log(err);
        this.feedbackProvider.presentToast('An error occured uploading the photo');
      });
    }).catch(err => {
      console.log(err);
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentToast('An error occured uploading the photo');
    });

  }

  getDefaultProfilePic(): string {
    return `assets/imgs/users/${this.profile.gender}.svg`;
  }

  getProfilePicture(): string {
    return !!this.profile.profilePic ? this.profile.profilePic : `assets/imgs/users/${this.profile.gender}.svg`;
  }

  capitalizeFirstLetter(str): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

}
