import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

@Injectable()
export class FeedbackProvider {

  loadSpinner: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
  }

  presentLoading(message: string = 'Please wait...') {
    this.loadSpinner = this.loadingCtrl.create({
      content: message
    });
    this.loadSpinner.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  presentAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: "btn",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentErrorAlert(title: string, msg: string = 'Something went wrong, please try again') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: "btn",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  dismissLoading() {
    this.loadSpinner.dismiss();
  }

  presentModal(page, data?) {
    const modal = this.modalCtrl.create(page, data);
    modal.present();
  }




}
