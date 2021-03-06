import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const { password, ...result } = user;
                return result;
            }
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user._doc.username, sub: user._doc._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
