import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import { ChatPage } from '../chat/chat';

import { bounceIn } from '../../utils/animations';
import * as firebase from 'firebase';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
  animations: [bounceIn]

})
export class ChatsPage {
  profile: User;
  searching: boolean;
  isLoading: boolean;
  users: User[] = [];
  chatRef = firebase.database().ref(COLLECTION.chats);
  userRef = firebase.database().ref(COLLECTION.users);

  searchTerm: string = '';
  searchControl: FormControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public firebaseApiProvider: FirebaseApiProvider,
    public zone: NgZone,
    public authProvider: DataProvider) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.isLoading = true;
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    this.setFilteredItems("");
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.setFilteredItems(search);
    });

    this.isLoading = false;
  }


  setFilteredItems(searchTerm) {
    this.users = this.firebaseApiProvider.filterItems(searchTerm);
    this.searching = false;
  }

  onSearchInput() {
    this.searching = true;
  }

  viewUserProfile(user) {
    this.navCtrl.push(ChatPage, { user });
  }

  getProfilePicture(user): string {
    return !!user.profilePic ? user.profilePic : `assets/imgs/users/${user.gender}.svg`;
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

}
