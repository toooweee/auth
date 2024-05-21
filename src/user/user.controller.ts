import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserResponse } from '@user/responses';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAllUsers() {
        return this.userService.findAll();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findOneUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.finOne(idOrEmail);

        return new UserResponse(user);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.delete(id);
    }
}
