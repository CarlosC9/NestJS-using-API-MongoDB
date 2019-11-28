import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserException } from './user.exception';

@Injectable()
export class UsersService {
    constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        let users : [User] = await this.userModel.find({nickname : createUserDto.username});

        if (users.length > 0) {
            throw new UserException(UserException.NICKNAME_EXIST_EXCEPTION);
        }

        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findOneByUsername(username : string) : Promise<User> {
        return await this.userModel.findOne({ username: username }).exec();
    }
}
