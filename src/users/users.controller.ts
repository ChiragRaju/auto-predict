import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  UseInterceptors,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoAmI(@Session() session: any) {
    console.log(session);
    return this.usersService.findOne(session.userId);
  }
  //@UseInterceptors(new SerializeInterceptor(UserDto))
  //@Serialize(UserDto)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('I am Running before Handler', id);
    const user = this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removerUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.SignUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async SignIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.SignIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async Signout(@Session() session: any) {
    session.userId = null;
  }
}
