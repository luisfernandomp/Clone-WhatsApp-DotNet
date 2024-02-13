import { User } from "./user.model";

export interface UserImageModel extends User {
    user: User,
    imageUrl: string | null;
}