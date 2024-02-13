import { User } from "./user.model";

export default interface UserStorageInfo extends User 
{
    token: string;
}