import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@auth/interfaces';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async save(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);
        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: user.roles ?? ['USER'], // Установка роли по умолчанию
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany();
    }

    finOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
        });
    }

    async delete(id: string, user: JwtPayload) {
        const userToDelete = await this.prismaService.user.findUnique({ where: { id } });

        if (!userToDelete) {
            throw new NotFoundException('User not found');
        }

        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException('You are not allowed to delete this user');
        }

        return this.prismaService.user.delete({
            where: { id },
            select: { id: true },
        });
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
}
