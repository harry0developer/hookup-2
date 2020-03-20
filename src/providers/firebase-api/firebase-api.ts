import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { AngularFireAuth } from '@angular/fire/auth';
import { STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { User } from '../../models/user';
import moment from 'moment';


@Injectable()
export class FirebaseApiProvider {
  firebaseRef = firebase.database();
  chatRef = firebase.database().ref(COLLECTION.chats);
  profile: User;
  users: User[] = [];
  constructor(public afAuth: AngularFireAuth) {
    this.profile = this.getLoggedInUser();
    this.getUserChat();
  }

  getLoggedInUser(): User {
    return this.getItemFromLocalStorage(STORAGE_KEY.user);
  }


  addItem(ref: string, item: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${item.uid}`);
    return dataRef.set(item);
  }

  addItemWithKey(ref: string, key: string, item: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${key}`);
    return dataRef.set(item);
  }

  addImageToRealtimeDB(ref: string, img, imgRef: string): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}/${imgRef}`);
    return dataRef.set(img);
  }

  getItem(ref: string, key: string): Promise<any> {
    return this.firebaseRef.ref(`/${ref}/${key}`).once('value', snap => snap);
  }

  getAllItems(ref: string): Promise<any> {
    return this.firebaseRef.ref(`/${ref}`).once('value', snap => snap);
  }

  updateItem(ref: string, uid: string, itemKeyValue: any): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}`);
    return dataRef.child(uid).update(itemKeyValue);
  }


  removeItem(ref: string, key: string): Promise<any> {
    const dataRef = this.firebaseRef.ref(`/${ref}`);
    return dataRef.child(key).remove()
  }

  deleteTask(ref: string, key: string) {
    const dataRef = this.firebaseRef.ref(`/${ref}`);;
    dataRef.child(key).remove();
  }


  signupWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getItemFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === null || data === undefined) {
      return {};
    } else {
      return JSON.parse(data);
    }
  }

  addItemToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  convertObjectToArray(obj): any[] {
    return Object.keys(obj).map(i => obj[i])
  }

  snapshotToArray(snapshot: any[]): any[] {
    let returnArr = [];
    snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });
    return returnArr;
  }

  getDateTimeMoment(dateTime): string {
    return moment(dateTime).fromNow();
  }

  // getData() {
  //   this.chatRef.child(this.profile.uid).on('value', snap => {
  //     let user;
  //     snap.forEach(s => {
  //       user = Object.entries(s.val())[0][1];
  //       this.getUserById(user.from);
  //     });
  //   });
  // }

  // getUserById(id) {
  //   this.getItem(COLLECTION.users, id).then(user => {
  //     this.users = [];
  //     firebase.database().ref(COLLECTION.users).child(id).once('value', snap => {
  //       this.users.push(snap.val());
  //     });
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  getUserChat() {
    // firebase.database().ref(COLLECTION.chats).child(this.profile.uid).on('value', snap => {
    //   snap.forEach(u => {
    //     firebase.database().ref(COLLECTION.users).child(u.key).on('value', uSnap => {
    //       this.users.push(uSnap.val());
    //     });
    //   });
    // });
  }

  filterItems(searchTerm) {
    return this.users.filter(user => {
      return user.nickname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
