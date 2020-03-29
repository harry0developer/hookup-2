export const COLLECTION = {
    users: 'users',
    ratings: 'ratings',
    views: 'views',
    images: 'images',
    countries: 'countries',
    appInfo: 'appInfo',
    chats: 'chats',
    feedback: 'feedback',
}

export const DATABASE = {
    images: 'images'
}

export const USER_TYPE = {
    buyer: 'buyer',
    seller: 'seller'
}

export const EVENTS = {
    loggedIn: "logged-In",
    imageUploadError: 'imageUploadError',
    imageUploadSuccess: 'imageUploadSuccess'
}

export const MESSAGES = {
    oops: 'Oops, something went wrong. Please try again',
    logoutFailed: 'Logout failed',
    loginFailed: 'Login failed',
    signupFailed: 'Signup failed',
    emailAlreadyRegistered: 'Email address is already registered, please login.',
    emailNotRegistered: 'Username and password does not match',
    phoneNotRegistered: 'Phone number provided is not registered',
    phoneAlreadyRegistered: 'Phone number is already registered, please login.',
    locationAccessError: 'Please allow access to your location'
}

export const STORAGE_KEY = {
    user: 'user',
    location: 'location',
    intro: 'intro',
    verified: 'verified',
    firstTimeLogin: 'firstTimeLogin',
    filter: 'filter'
}

export const ACTION = {
    profile: 'profile',
    delete: 'delete'
}

export const NETWORK = {
    online: 'online',
    offline: 'offline'
}

export const STATUS = {
    active: 'active',
    deactive: 'deactive'
}

export const DEFAULT_PIC_PRIMARY = '/assets/imgs/user-primary.svg'
export const DEFAULT_PIC_WHITE = '/assets/imgs/user-white.svg'
export const EMAIL_EXISTS = 'auth/email-already-in-use';
export const USER_NOT_FOUND = 'auth/user-not-found';
export const INVALID_PASSWORD = 'auth/wrong-password';
export const OBJECT_NOT_FOUND = 'storage/object-not-found';
