import { UserLocation, Geo } from "./location";

export interface User {
    nickname: string;
    gender: string;
    age: number
    race: string;
    bodyType: string;
    height: number
    email: string;
    phone: string;
    profilePic?: string;
    password: string;
    uid: string;
    dateCreated: string;
    userType: string;
    verified?: boolean;
    distance?: string;
    location: Geo;
    status: string;
};
