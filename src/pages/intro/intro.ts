  
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { STORAGE_KEY } from '../../utils/consts';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public viewCtrl: ViewController, public dataProvider: DataProvider) {
  }

  gotIt() {
    this.dataProvider.addItemToLocalStorage(STORAGE_KEY.intro, { show: false });
    this.viewCtrl.dismiss();
  }
}