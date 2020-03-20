import { User } from "./user";

export class UserData {
    users: User[];

    constructor(userData?: any) {
        if (userData) {
            this.users = userData.users;
        }
    }

    setUsers(users: User[]) {
        this.users = users;
    }


}
