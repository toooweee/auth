import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.save(createUserDto);
    }

    @Get()
    findAllUsers() {
        return this.userService.findAll();
    }

    @Get(':idOrEmail')
    findOneUser(@Param('idOrEmail') idOrEmail: string) {
        return this.userService.finOne(idOrEmail);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.delete(id);
    }
}
