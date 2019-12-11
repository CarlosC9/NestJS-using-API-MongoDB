import { Controller, Post, Body, Get, HttpException, HttpStatus, UseGuards, Request, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserException } from './user.exception';
import { AuthGuard } from '@nestjs/passport';

const bcrypt = require('bcryptjs');

@Controller('users')
export class UsersController {
 

    constructor(private readonly userService: UsersService) {}

    @Post()
    async create(@Body() user : CreateUserDto) {
        let exception : number = 0;

        user.username = user.username.toLocaleLowerCase();

        if (user.username == "" || user.password == "") {
            throw new HttpException('Username or password is empty' , HttpStatus.BAD_REQUEST);
        }

        let funHash =  async (err,hash) => {
            user.password = hash;
            await this.userService.create(user).catch( (reason) => {
                if (reason instanceof UserException) {
                    exception = reason.type;
                }
            });
        }

        await bcrypt.hash(user.password, 10, funHash.bind(this));

        switch (exception) {
            case UserException.USERNAME_EXIST_EXCEPTION:
                throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST);
        }

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user-configuration')
    async getUserConfiguration(@Request() req) {
        let userId: string = req.user.userId;
        let colors = await this.userService.getColors(userId);

        return {
            colorParentType: colors.parentType,
            colorScaleChange: colors.scaleChange,
        }
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Put('user-configuration')
    async updateUserConfiguration(@Request() req, @Body() configurate) {
        let userId: string = req.user.userId;
        this.userService.updateConfigurate(userId,configurate);
    }

}
