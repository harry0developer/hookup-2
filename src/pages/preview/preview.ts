import { Component, ViewChild, ContentChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, Slide } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { COLLECTION, STORAGE_KEY, ACTION } from '../../utils/consts';
import { User } from '../../models/user';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  // images = [
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458804.jpg?alt=media&token=db5f87d5-9024-4182-9e31-2d2e88342f97',
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458784.jpg?alt=media&token=06ad2ef2-f400-4e00-a7ce-a047e7e82354',
  //   'https://firebasestorage.googleapis.com/v0/b/hooker-6ca60.appspot.com/o/images%2FHfkpiBaaBxh4Wala65cMDWa5gtq2%2F1581458816.jpg?alt=media&token=78fa09b3-1924-458b-a3fc-2c0d54d69272'
  // ];

  images = [];
  profile: User;
  @ViewChild(Slides) slides: Slides;
  active: number = 0;
  activeImgSlide: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    public mediaProvider: MediaProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public feedbackProvider: FeedbackProvider
  ) { }

  ionViewDidLoad() {
    this.images = this.navParams.get('images');
    const activeImg = this.navParams.get('active');
    this.active = this.images.indexOf(activeImg);
    this.profile = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.user);
  }

  removeImage(img) {
    this.feedbackProvider.presentLoading('Deleting photo...');
    this.mediaProvider.removeImageByFilename(this.profile.uid, img.url).then(r => {
      this.feedbackProvider.dismissLoading();
      this.feedbackProvider.presentLoading('Updating profile...');
      this.firebaseApiProvider.removeItem(`${COLLECTION.images}/${this.profile.uid}`, img.key).then(() => {
        this.feedbackProvider.dismissLoading();
        if (this.profile.profilePic === img.path) {
          this.profile.profilePic = "";
        }
        this.viewCtrl.dismiss(ACTION.delete);
        this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.user, this.profile);
        this.firebaseApiProvider.updateItem(`${COLLECTION.users}`, `${this.profile.uid}`, { profilePic: '' }).then(() => {
          console.log('User profile pic update');
        }).catch(err => {
          console.log('user profile pic failed');
        });
      }).catch(err => {
        this.feedbackProvider.dismissLoading();
        console.log(err);
      })
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log(err);
    })
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  slideChanged() {
    this.activeImgSlide = this.images[this.slides.realIndex];
  }

  updateProfilePicture(img) {
    this.feedbackProvider.presentLoading('Updating profile photo...');
    const ref = `${COLLECTION.users}`;
    const key = `${this.profile.uid}`;
    this.firebaseApiProvider.updateItem(ref, key, { profilePic: img.path }).then(() => {
      this.feedbackProvider.dismissLoading();
      this.profile.profilePic = img.path;
      this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.user, this.profile);
      this.feedbackProvider.presentToast('Profile photo updated');
    }).catch(err => {
      this.feedbackProvider.dismissLoading();
      console.log('Ooops theres an error', err);
    });
  }

  makeProfilePicture() {
    this.presentActionSheet('Make profile photo', 'profile', this.activeImgSlide);
  }

  deleteImage() {
    this.presentActionSheet('Delete photo', 'delete', this.activeImgSlide);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet(title: string, action: string, data) {
    let actionSheet = this.actionSheetCtrl.create({
      title,
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            if (action === 'delete') {
              this.removeImage(data);
            } else {
              this.updateProfilePicture(data);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



}
