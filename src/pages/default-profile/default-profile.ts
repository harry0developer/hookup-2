import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-default-profile',
  templateUrl: 'default-profile.html',
})
export class DefaultProfilePage {
  activeIndex;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.activeIndex = 0;
  }

  selecIcon(index) {
    this.activeIndex = index
  }

  arrayTo(n: number): any[] {
    return Array(n);
  }

  apply() {
    this.viewCtrl.dismiss(this.activeIndex);
  }

}
