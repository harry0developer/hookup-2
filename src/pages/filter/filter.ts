import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Filter } from '../../models/filter';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  filter: Filter = {
    age: 0,
    distance: 0,
    race: 'all'
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewProvider: ViewController,
    public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.filter = this.navParams.get('filter');
    console.log(this.filter);
  }

  dismiss() {
    this.viewProvider.dismiss()
  }

  applyFilter() {
    console.log(this.filter);
    this.viewProvider.dismiss(this.filter);
  }

  capitalizeFirstLetter(str: string): string {
    return this.dataProvider.capitalizeFirstLetter(str);
  }

}
