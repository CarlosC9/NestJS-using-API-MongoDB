import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly catsService: UsersService) {}

    @Post()
    create(@Body() user : CreateUserDto) {
        
        this.catsService.create(user);
    }

    @Get()
    getAll() {
        return this.catsService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id : string) {
        return this.catsService.findOne(id);
    }

}
