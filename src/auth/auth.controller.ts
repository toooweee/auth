import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from '@auth/auth.service';
import { Tokens } from '@auth/interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

const REFRESH_TOKEN = 'refreshtoken';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);

        if (!user) throw new BadRequestException(`Ошибка регистрации ${JSON.stringify(dto)}`);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const tokens = await this.authService.login(dto);

        if (!tokens) {
            throw new NotFoundException(`Ошибка входа входа ${JSON.stringify(dto)}`);
        }

        this.setRefreshTokenToCookies(tokens, res);

        // return { accessToken: tokens.accessToken };
    }

    @Get('refresh')
    refreshTokens() {}

    private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }

        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });

        res.status(HttpStatus.CREATED).json(tokens);
    }
}
