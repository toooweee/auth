import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@auth/dto';
import { UserService } from '@user/user.service';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {}

    async register(dto: RegisterDto) {
        const user: User = await this.userService.finOne(dto.email).catch((err) => {
            this.logger.error('Error finding user during registration:', err);
            return null;
        });

        if (user) {
            throw new ConflictException('Пользователь с таким email уже зарегистрирован');
        }

        try {
            return await this.userService.save(dto);
        } catch (err) {
            this.logger.error('Error saving user during registration:', err);
            throw new ConflictException('Ошибка регистрации');
        }
    }

    async login(dto: LoginDto): Promise<Tokens> {
        const user: User = await this.userService.finOne(dto.email).catch((err) => {
            this.logger.error('Error finding user during login:', err);
            return null;
        });

        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const accessToken =
            'Bearer ' +
            this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles,
            });

        const refreshToken = await this.getRefreshToken(user.id);

        return { accessToken, refreshToken };
    }

    async getRefreshToken(userId: string): Promise<Token> {
        return this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
            },
        });
    }
}
