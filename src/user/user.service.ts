import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    save(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);
        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: ['USER'],
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

    delete(id: string) {
        return this.prismaService.user.delete({
            where: { id },
        });
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
}
