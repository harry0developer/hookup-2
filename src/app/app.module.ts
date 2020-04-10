import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../config';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Network } from '@ionic-native/network';

import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule } from '@angular/common/http';

import { AuthProvider } from '../providers/auth/auth';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { DataProvider } from '../providers/data/data';
import { SignupPage } from '../pages/signup/signup';

import { RatingModule } from "ngx-rating";
import { ProfilePage } from '../pages/profile/profile';
import { ChatPage } from '../pages/chat/chat';
import { Camera } from '@ionic-native/camera';
import { WindowProvider } from '../providers/window/window';
import { NationalityPage } from '../pages/nationality/nationality';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SellersPage } from '../pages/sellers/sellers';
import { SellerDetailsPage } from '../pages/seller-details/seller-details';
import { IntroPage } from '../pages/intro/intro';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TermsPage } from '../pages/terms/terms';
import { SetupPage } from '../pages/setup/setup';
import { LocationProvider } from '../providers/location/location';

import { Geolocation } from '@ionic-native/geolocation';
import { MediaProvider } from '../providers/media/media';
import { ComponentsModule } from '../components/components.module';
import { FirebaseApiProvider } from '../providers/firebase-api/firebase-api';
import { VisitorPage } from '../pages/visitor/visitor';
import { FilterPage } from '../pages/filter/filter';
import { PreviewPage } from '../pages/preview/preview';
import { NetworkErrorPage } from '../pages/network-error/network-error';
import { ReportBugPage } from '../pages/report-bug/report-bug';
import { ChatsPage } from '../pages/chats/chats';
import { SettingsPage } from '../pages/settings/settings';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AppVersion } from '@ionic-native/app-version';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

@NgModule({
  declarations: [
    MyApp,
    SignupPage,
    ForgotPasswordPage,
    ProfilePage,
    ChatPage,
    ChatsPage,
    NationalityPage,
    DashboardPage,
    SellersPage,
    SellerDetailsPage,
    IntroPage,
    HomePage,
    TermsPage,
    SetupPage,
    VisitorPage,
    FilterPage,
    PreviewPage,
    NetworkErrorPage,
    ReportBugPage,
    LoginPage,
    SettingsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    RatingModule,
    BrMaskerModule,
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignupPage,
    ForgotPasswordPage,
    ProfilePage,
    ChatPage,
    ChatsPage,
    NationalityPage,
    DashboardPage,
    SellersPage,
    SellerDetailsPage,
    IntroPage,
    HomePage,
    TermsPage,
    SetupPage,
    VisitorPage,
    FilterPage,
    PreviewPage,
    NetworkErrorPage,
    ReportBugPage,
    LoginPage,
    SettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFirestore,
    AngularFireAuth,
    AuthProvider,
    FeedbackProvider,
    DataProvider,
    Camera,
    WindowProvider,
    LocationProvider,
    Geolocation,
    MediaProvider,
    FirebaseApiProvider,
    Network,
    OpenNativeSettings,
    AppVersion
  ]
})
export class AppModule { }
