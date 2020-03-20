import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { USER_TYPE, STORAGE_KEY, COLLECTION } from '../../utils/consts';
import { auth } from 'firebase';

@Injectable()
export class AuthProvider {

  profile: User;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
  ) {

  }


  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  signInWithTwitter() {
    return this.authLogin(new auth.TwitterAuthProvider());
  }

  signInWithFacebook() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signUpWithPhonenumber(phoneNumber, appVerifier) {
    this.afAuth.auth.signInWithPhoneNumber(phoneNumber, appVerifier).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
  updateUser(data: User) {
    const user = this.getStoredUser();
    const userData: User = null;
    return this.afs.collection(COLLECTION.users).doc(user.uid).set(userData);
  }

  getFirebaseUserData(uid): any {
    return this.afs.collection(COLLECTION.users).doc(uid).get();
  }

  storeUser(user) {
    localStorage.setItem(STORAGE_KEY.user, JSON.stringify(user));
  }

  getStoredUser(): User {
    return JSON.parse(localStorage.getItem(STORAGE_KEY.user));
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }


  logout() {
    localStorage.removeItem(STORAGE_KEY.user);
    return this.afAuth.auth.signOut();
  }

  isBuyer(user): boolean {
    return user && user.type === USER_TYPE.buyer;
  }

  isSeller(user): boolean {
    return user && user.type === USER_TYPE.seller;
  }

  isUserVerified(): boolean {
    const auth = this.afAuth.auth;
    return auth && auth.currentUser && auth.currentUser.emailVerified;
  }

  getCurrentUser() {
    return this.afAuth.auth;
  }
}
