import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserException } from './user.exception';
import * as mongoose from 'mongoose';

@Controller('users')
export class UsersController {
 

    constructor(private readonly userService: UsersService) {}

    @Post()
    async create(@Body() user : CreateUserDto) {
        let exception : number = 0;

        await this.userService.create(user).catch( (reason) => {
            if (reason instanceof UserException) {
                exception = reason.type;
            }
        });

        switch (exception) {
            case UserException.NICKNAME_EXIST_EXCEPTION:
                throw new HttpException('Nickname already exist', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get()
    async getAll() {
        return this.userService.findAll();
    }

    // @Get(':id')
    // async getOne(@Param('id') id : string) {
    //     let exception = 0;

    //     let user = await this.userService.findOne(id).catch((reason) => {
    //         if (reason instanceof mongoose.Error.CastError) {
    //             exception = UserException.CANT_CAST_ID;
    //         }
    //         console.log(reason);
    //     });

    //     switch (exception) {
    //         case UserException.CANT_CAST_ID:
    //             throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    //     }

    //     return user;
    // }

}
