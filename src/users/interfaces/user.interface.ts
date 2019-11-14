import { Document } from 'mongoose';


export interface User extends Document {
    nickname: string;
    password: string
}