import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";

@IonicPage()
@Component({
  selector: 'page-nationality',
  templateUrl: 'nationality.html',
})
export class NationalityPage {
  countries: any = [];

  searchTerm: string = '';
  searchControl: FormControl;
  filteredCountries: any = [];
  searching: any = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private viewCtrl: ViewController) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.getCountries();
    this.setFilteredItems('');
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });
  }


  getCountries() {
    this.feedbackProvider.presentLoading();
    this.dataProvider.getCountries().then(res => {
      this.countries = res;
      this.filteredCountries = res;
      this.feedbackProvider.dismissLoading();
    }, err => {
      this.feedbackProvider.dismissLoading();
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems(searchTerm) {
    this.filteredCountries = this.filterItems(searchTerm);
  }

  filterItems(searchTerm) {
    return this.countries.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  selectCountry(country) {
    this.viewCtrl.dismiss(country);
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}