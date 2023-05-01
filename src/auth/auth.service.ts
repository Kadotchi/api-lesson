import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * ユーザー登録を行う
   * @param dto リクエスト
   * @returns 成功: 'ok', 失敗: エラー
   */
  async signUp(dto: AuthDto): Promise<Msg> {
    // passwordをハッシュ化
    // 第２引数でラウンズを指定 12で4096回
    const hashed = await bcrypt.hash(dto.password, 12);
    // 登録処理
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if ((error.code = 'P2002')) {
          // クライアントが要求したリソースに対してアクセスが拒否されたことを示すエラーコード
          throw new ForbiddenException('This email is alraady taken');
        }
      }
    }
  }

  /**
   * ログイン処理
   * @param dto
   * @returns Jwtトークン
   */
  async login(dto: AuthDto): Promise<Jwt> {
    // emailを取り出してDBに存在確認
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Email or password incorrect');

    // dtoの平文のpasswordとDBにあるハッシュ化されpasswordを比較
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isValid) throw new ForbiddenException('Email or password incorrect');

    // JWTトークンを生成して返却
    return this.generateJwt(user.id, user.email);
  }

  /**
   * JWTトークンを生成
   * @param userId
   * @param email
   * @returns
   */
  async generateJwt(userId: number, email: string): Promise<Jwt> {
    // トークンの主題（sub）とemail
    const payload = {
      sub: userId,
      email,
    };
    // 秘密鍵
    const secret = this.config.get('JWT_SECRET');
    // トークン生成
    const token = await this.jwt.signAsync(payload, {
      // JWTの有効期限を指定
      expiresIn: '5m',
      secret,
    });

    return { accesseToken: token };
  }
}
