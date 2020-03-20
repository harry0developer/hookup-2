import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserData } from '../../models/userData';
import { AuthProvider } from '../auth/auth';
import { COLLECTION, EVENTS, STORAGE_KEY } from '../../utils/consts';
import * as moment from 'moment'
import { HttpClient } from '@angular/common/http';
import { Ratings } from '../../models/ratings';
import { Events } from 'ionic-angular';
import { Geo } from '../../models/location';

@Injectable()
export class DataProvider {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<User>;
  data$: Observable<User[]>;

  profile: User;
  KM: number = 1.60934;

  private userDataSubject = new BehaviorSubject<UserData>(null);
  userData$ = this.userDataSubject.asObservable();
  userData: UserData = new UserData();

  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFirestore,
    public http: HttpClient,
    public ionEvents: Events,
    private authProvider: AuthProvider) {
    // this.profile = this.authProvider.getStoredUser();

    if (this.profile) {
      this.getUsers().subscribe(users => {
        this.userData.setUsers(users);
        this.updateUserData(this.userData);
      });
    }
  }

  getStoredUser(): User {
    return JSON.parse(localStorage.getItem(STORAGE_KEY.user));
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  updateUserData(userData: UserData) {
    this.userData = new UserData(userData);
    this.userDataSubject.next(userData);
  }


  getMappedCandidates(users, toBeMappedUsers): User[] {
    const candidates: User[] = [];
    users.map(user => {
      toBeMappedUsers.map(mUser => {
        if (user.uid === mUser.uid) {
          candidates.push(user);
        }
      });
    });
    return candidates;
  }

  getMappedRecruiters(users, toBeMappedUsers): User[] {
    const recruiters: User[] = [];
    users.map(user => {
      toBeMappedUsers.map(mUser => {
        if (user.uid === mUser.rid) {
          recruiters.push(user);
        }
      });
    });
    return recruiters;
  }


  removeDuplicates(array, key: string) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
    });
  }

  getUsers(): Observable<User[]> {
    return this.getAllFromCollection(COLLECTION.users);
  }
  getUserById(id): Observable<User> {
    return this.getItemById(COLLECTION.users, id);
  }

  getMyCollection(collectionName: string, uid: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getItemById(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).valueChanges();
  }

  updateItem(collectionName: string, data: User, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).set(data, { merge: true });
  }

  addNewItem(collectionName: string, data: User) {
    return this.afStore.collection(collectionName).add(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).delete();
  }

  findItemById(id: string) {
    return this.getItemById(COLLECTION.users, id);
  }


  getProfilePicture(profile): string {
    return `assets/imgs/users/${profile.gender}.svg`;
  }

  getSettings() {
    return {};
  }

  getItemFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === null || data === undefined) {
      return {};
    } else {
      return JSON.parse(data);
    }
  }

  addItemToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  addItemToUserDB(collection: string, id: string, newItem: any) {
    const key = new Date().getTime().toString();
    this.getDocumentFromCollectionById(collection, id).subscribe(items => {
      if (!!items) {
        const data: Object = items;
        const newItems = { ...data, [key]: newItem };
        this.updateCollection(collection, newItems, id).then(res => {
          this.ionEvents.publish(EVENTS.imageUploadSuccess, res);
        }).catch(err => {
          this.ionEvents.publish(EVENTS.imageUploadError, err);
        })
      } else { //Job is NOT root document eg /viewed-jobs/otherjobIdNotThisOne
        const newItems = { [key]: newItem };
        this.updateCollection(collection, newItems, id).then(res => {
          this.ionEvents.publish(EVENTS.imageUploadSuccess, res);
        }).catch(err => {
          this.ionEvents.publish(EVENTS.imageUploadError, err);
        });
      }
    });
  }

  updateCollection(collection, newItems, id): Promise<any> {
    return this.addNewItemWithId(collection, newItems, id);
  }

  addNewItemWithId(collectionName: string, data: any, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).set(data);
  }

  getArrayFromObjectList(obj): any[] {
    return obj ? Object.keys(obj).map((k) => obj[k]) : [];
  }

  isUserIdInCollection(jobs: any[], job): any[] {
    return jobs.find(res => {
      return res.uid === job.uid && res.jid === job.jid;
    });
  }


  getAllFromCollection(collectionName: string): Observable<any> {
    return this.afStore.collection<any>(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollection(collectionName: string, docId: string): Observable<any> {
    return this.afStore.collection<any>(collectionName).doc(docId).get();
  }

  getCollectionById(collectionName: string, uid: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentFromCollectionById(collectionName, id) {
    return this.afStore.collection<any>(collectionName).doc(id).valueChanges();
  }

  getCollectionByKeyValuePair(collectionName: string, key: string, value: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, ref => ref.where(key, '==', value)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addUserImage(collection: string, images, newImage: any, rootKey: string): Promise<any> {
    const key = new Date().getTime().toString();
    if (!!images) {
      const newImages = { ...images, [key]: newImage };
      return this.updateCollection(collection, newImages, rootKey);
    } else { //Job is NOT root document eg /viewed-services/otherjobIdNotThisOne
      const newImageObject = { [key]: newImage }; // team = {[var]: '', id: 1}
      return this.updateCollection(collection, newImageObject, rootKey);
    }
  }

  isUserInJobDocumentArray(services, service): any[] {
    return services.find(res => {
      return res.id === service.id && res.rid === service.rid;
    });
  }

  updateRating(ratings: any[], newRating): any {
    let updated = false;
    ratings.forEach(r => {
      if (r.id === newRating.id && newRating.rid === r.rid) {
        updated = true;
        r.rating = newRating.rating;
        return { ratings, updated };
      }
    });
    return { ratings, updated };
  }

  getUserByIdPromise(id) {
    return this.getItemById(COLLECTION.users, id).toPromise();
  }

  getDateTime(): string {
    return moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
  }

  getDateTimeMoment(dateTime): string {
    return moment(dateTime).fromNow();
  }

  capitalizeFirstLetter(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.substring(1) : str;
  }

  applyHaversine(users: User[], myProfile: User, units: string = 'miles'): User[] {
    if (users && myProfile.location && myProfile.location.lat && myProfile.location.lng) {
      let myGeo: Geo = {
        lat: myProfile.location.lat,
        lng: myProfile.location.lng
      };
      users.map(user => {
        if (user.location && user.location.lat && user.location.lng) {
          let otherUserGeo: Geo = {
            lat: user.location.lat,
            lng: user.location.lng
          };
          user.distance = this.getDistanceBetweenPoints(
            myGeo,
            otherUserGeo,
            units
          ).toFixed(0);

        }
      });
      return users;
    } else {
      return users;
    }
  }

  private getDistanceBetweenPoints(start: Geo, end: Geo, units: string): number {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d >= 0 ? d * this.KM : -999; //convert miles to km
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  getAgeFromDate(date: string): string {
    return moment(date, "YYYY/MM/DD").month(0).from(moment().month(0)).split(" ")[0];
  }

  getLocationFromGeo(users: User[], myProfile: User): User[] {
    return this.applyHaversine(users, myProfile);
  }

  getCountries() {
    return this.http.get('assets/countries.json').toPromise();
  }

}
