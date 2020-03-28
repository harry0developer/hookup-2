import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, Events, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { SellersPage } from '../pages/sellers/sellers';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { User } from '../models/user';
import { DataProvider } from '../providers/data/data';
import { NETWORK, STORAGE_KEY, USER_TYPE, EVENTS } from '../utils/consts';
import { IntroPage } from '../pages/intro/intro';
import { AuthProvider } from '../providers/auth/auth';
import { ChatsPage } from '../pages/chats/chats';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: any
  networkModal;
  profile: User;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private network: Network,
    private dataProvider: DataProvider,
    private authProvider: AuthProvider,
    public modalCtrl: ModalController,
    public ionEvents: Events,
    public actionSheetCtrl: ActionSheetController,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = {
      sellersPage: SellersPage,
      dashboardPage: DashboardPage,
      profilePage: ProfilePage,
      chatsPage: ChatsPage,
      settingsPage: SettingsPage
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleLightContent();
      this.statusBar.styleBlackTranslucent();
      const intro = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.intro);
      const a = Object.getOwnPropertyNames(intro).length;
      if (a === 0) {
        this.openIntroPage();
      }
      this.profile = this.dataProvider.getItemFromLocalStorage(STORAGE_KEY.user);
      this.ionEvents.subscribe(EVENTS.loggedIn, (user) => {
        this.profile = user;
        console.log(user);
      });
      this.network.onchange().subscribe(connection => {
        if (connection.type.toLowerCase() === NETWORK.offline) {
          this.handleNetworkError();
        }
        else {
          this.dissmissNetworkErrorPage();
        }
      });

    });
  }

  openIntroPage() {
    const modal = this.modalCtrl.create(IntroPage);
    modal.onDidDismiss(() => {
    });
    modal.present();
  }

  dissmissNetworkErrorPage() {
    this.networkModal.dismiss();
  }

  handleNetworkError() {
    this.networkModal.onDidDismiss((data) => {
      console.log(data);
    });
    this.networkModal.present();
  }

  getProfilePicture(): string {
    return this.profile && this.profile.profilePic ? this.profile.profilePic : 'assets/imgs/user.svg';
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  isSeller(): boolean {
    return this.profile.userType === USER_TYPE.seller;
  }

  logout() {
    this.authProvider.logout().then(() => {
      this.nav.setRoot(HomePage);
    });
  }


  presentLogoutActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'You are about to Logout',
      buttons: [
        {
          text: 'Logout',
          icon: 'log-out',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}
