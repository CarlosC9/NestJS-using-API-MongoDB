import { Controller, Post, Body, Get, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserException } from './user.exception';
import { AuthGuard } from '@nestjs/passport';

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

        await this.userService.create(user).catch( (reason) => {
            if (reason instanceof UserException) {
                exception = reason.type;
            }
        });

        switch (exception) {
            case UserException.USERNAME_EXIST_EXCEPTION:
                throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST);
        }

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
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
