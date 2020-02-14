import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserException } from './user.exception';

const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class UsersService {
    constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        let users : [User] = await this.userModel.find({username : createUserDto.username});

        if (users.length > 0) {
            throw new UserException(UserException.USERNAME_EXIST_EXCEPTION);
        }
        createUserDto.colorParentType = "#000000";
        createUserDto.colorScaleChange = "#05FF23";
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findOneByUsername(username : string) : Promise<User> {
        return await this.userModel.findOne({ username: username }).exec();
    }

    async getColors(userId : String) {
        let user : User = await this.userModel.findOne({ _id: new ObjectId(userId) }).exec();
        let colors = {
            parentType : user.colorParentType,
            scaleChange : user.colorScaleChange,
        }
        return colors;
    }

    async updateConfigurate(userId,configurate) {
        let res = await this.userModel.updateOne({ _id: new ObjectId(userId)},
            configurate);
        return res.n;
    }

    async getColorReport() {

        let countBlack = await this.userModel.find({colorParentType : "#000000"}).count();
        let countPink = await this.userModel.find({colorParentType: "#ff00f2"}).count();
        let countOrange = await this.userModel.find({colorParentType: "#ff7b00"}).count();

        let countGreen = await this.userModel.find({colorScaleChange: "#05FF23"}).count();
        let countBlue = await this.userModel.find({colorScaleChange: "#003cff"}).count();
        let countRed = await this.userModel.find({colorScaleChange: "#ff0000"}).count();

        let colorReport = {
            parentType: {
                black: countBlack,
                pink: countPink,
                orange: countOrange,
            },
            scaleChange: {
                green: countGreen,
                blue: countBlue,
                red: countRed,
            }
        }

        return colorReport;
    }
}
