import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION, STORAGE_KEY } from '../../utils/consts';
import { ChatPage } from '../chat/chat';
import { bounceIn } from '../../utils/animations';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { MediaProvider } from '../../providers/media/media';
import firebase from 'firebase';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { DefaultProfilePage } from '../default-profile/default-profile';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  animations: [bounceIn]

})
export class DashboardPage {
  profile: User = null;
  isLoading: boolean;
  messages: any[] = [];
  users: any[] = [];
  firstTimeLogin;
  chatRef = firebase.database().ref(COLLECTION.chats);
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public dataProvider: DataProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public mediaProvider: MediaProvider,
    public feedbackProvider: FeedbackProvider,
    public modalCtrl: ModalController,
    public zone: NgZone
  ) { }

  ionViewDidLoad() {
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    // this.firstTimeLogin = this.firebaseApiProvider.getItemFromLocalStorage(STORAGE_KEY.firstTimeLogin);
    this.isLoading = true;
    this.chooseProfilePictureModal();

    // if (this.firstTimeLogin) {
    //   this.chooseProfilePictureModal();
    // }
    this.chatRef.child(this.profile.uid).on('value', snap => {
      this.zone.run(() => {
        let user;
        snap.forEach(s => {
          user = Object.entries(s.val())[0][1];
          this.getUserById(user.from);
        });
      });
    });

  }

  chooseProfilePictureModal() {
    console.log('chooseProfilePictureModal');

    let profileModal = this.modalCtrl.create(DefaultProfilePage);
    profileModal.onDidDismiss(data => {
      console.log(data);
      this.firebaseApiProvider.addItemToLocalStorage(STORAGE_KEY.firstTimeLogin, false);
    });
    profileModal.present();
  }

  getUserById(id) {
    this.firebaseApiProvider.getItem(COLLECTION.users, id).then(user => {
      this.zone.run(() => {
        this.users = [];
        firebase.database().ref(COLLECTION.users).child(id).once('value', snap => {
          this.users.push(snap.val());
          this.isLoading = false;
        });
      });
    }).catch(err => {
      this.isLoading = false;
      console.log(err);
    });
  }

  viewUserProfile(user) {
    this.navCtrl.push(ChatPage, { user });
  }

  getDefaultProfilePic(): string {
    return '/assets/imgs/user.svg';
  }

  getProfilePicture(): string {
    return 'assets/imgs/user.svg';
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

}
