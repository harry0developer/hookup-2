import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

 
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  data = {
    nickname: '',
    gender: '',
    bodyType: '',
    race: ''
  }
  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    const user = this.navParams.get("user");
    this.data.nickname = user.nickname;
    this.data.gender = user.gender;
    this.data.race = user.race;
    this.data.bodyType = user.bodyType;
    // console.log(this.data);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  apply() {
    // console.log(this.data);
    this.viewCtrl.dismiss(this.data);
  }
}
