import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Camera } from '@ionic-native/camera';
import { COLLECTION, EVENTS } from '../../utils/consts';
import { User } from '../../models/user';
import { AuthProvider } from '../auth/auth';
import firebase from 'firebase';
import { DataProvider } from '../data/data';
import { linkToSegment } from 'ionic-angular/umd/navigation/nav-util';
import { Events } from 'ionic-angular';
import { FeedbackProvider } from '../feedback/feedback';
import { Photo } from '../../models/photo';

@Injectable()
export class MediaProvider {
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  profile: User;
  img: string;

  constructor(
    private afStorage: AngularFireStorage,
    private dataProvider: DataProvider,
    private feedbackProvider: FeedbackProvider,
    private camera: Camera,
    private authProvider: AuthProvider,
    public ionEvents: Events,
    private db: AngularFireDatabase) {
    this.profile = this.authProvider.getStoredUser();
  }

  takePhoto(): Promise<any> {
    const camOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true
    };
    return this.camera.getPicture(camOptions);
  }

  selectPhoto(): Promise<any> {
    const camOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
    };
    return this.camera.getPicture(camOptions);
  }


  getFiles(userId) {
    const ref = this.db.list(userId + '/');
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: Object = a.payload.val();
          const key = a.payload.key;
          return { key, ...data };
        });
      })
    );
  }

  getImageByFilename(uid: string, url: string): Promise<any> {
    const ref = firebase.storage().ref(`${COLLECTION.images}/${uid}/`).child(url);
    return ref.getDownloadURL();
  }

  removeImageByFilename(uid: string, url: string): Promise<any> {
    const ref = firebase.storage().ref(`${COLLECTION.images}/${uid}/`).child(url);
    return ref.delete();
  }

  downloadImages(uid: string, images: any[]): any[] {
    let imgs = [];
    images.forEach(img => {
      this.getImageByFilename(uid, img.url).then(resImg => {
        imgs.push(resImg);
      }).catch(err => {
        console.log(err);
      });
      console.log(imgs);

    });
    return imgs;
  }

}
