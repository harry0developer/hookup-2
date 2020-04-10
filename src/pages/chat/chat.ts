import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController } from 'ionic-angular';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { FirebaseApiProvider } from '../../providers/firebase-api/firebase-api';
import * as firebase from 'firebase';
import { COLLECTION, DEFAULT_PIC_WHITE, DEFAULT_PIC_PRIMARY } from '../../utils/consts';
import { Message } from '../../models/message';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  person: User;
  profile: User;
  chatRef = firebase.database().ref(COLLECTION.chats);
  messageList: Message[] = [];

  isLoading: boolean;
  inputMessage: string = '';

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public firebaseApiProvider: FirebaseApiProvider,
    public feedbackProvider: FeedbackProvider,
    public zone: NgZone,
    public dataProvider: DataProvider) { }

  ionViewDidLoad() {
    this.isLoading = true;
    this.feedbackProvider.presentLoading();
    this.profile = this.firebaseApiProvider.getLoggedInUser();
    this.person = this.navParams.get('user');
    if (this.person.uid) {
      this.messageList = [];
      this.chatRef.child(this.profile.uid).child(this.person.uid).on('child_added', snap => {
        this.zone.run(() => {
          let msg: Message = snap.val();
          this.messageList.push(msg);
          this.isLoading = false;
          this.scrollToEnd();
        });
      });
      this.feedbackProvider.dismissLoading();
    }
  }

  sendMessage() {
    if (this.inputMessage.length > 0) {
      let msgId = this.chatRef.child(this.profile.uid).child(this.person.uid).push().key;
      const msg: Message = {
        text: this.inputMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        from: this.profile.uid,
        id: msgId
      };
      this.chatRef.child(this.profile.uid).child(this.person.uid).child(msgId).set(msg);
      this.chatRef.child(this.person.uid).child(this.profile.uid).child(msgId).set(msg);
      this.inputMessage = '';
      this.scrollToEnd();
    }
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }


  getProfilePicture(user: User): string {
    return user && user.profilePic ? user.profilePic : DEFAULT_PIC_PRIMARY;
  }


  getMomentFromNow(timestamp: string) {
    return this.firebaseApiProvider.getDateTimeMoment(timestamp);
  }

  scrollToEnd() {
    setTimeout(() => {
      if (this.content && this.content.scrollToBottom && typeof this.content.scrollToBottom !== 'undefined') {
        this.content.scrollToBottom();
      }
    }, 100);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
