import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async SignUp(email: string, password: string) {
    //see if email is in use
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //hash the users password
    //generate a salt
    const salt = randomBytes(8).toString('hex');
    //hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');
    //create a new user and save it
    const user = await this.userService.create(email, result);
    return user;
  }

  async SignIn(email: string, password: string) {
    {
      const [user] = await this.userService.find(email);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      const [salt, storedhash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      //   if (storedhash == hash.toString('hex')) {
      //     return user;
      //   }
      //   throw new BadRequestException('bad password');
      // or

      if (storedhash !== hash.toString('hex')) {
        throw new BadRequestException('bad password');
      }
      return user;
    }
  }
}
