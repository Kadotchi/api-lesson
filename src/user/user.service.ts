import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
// prismaのgenerateコマンドで生成
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Omit<User, 'hashedPassword'>は第１引数から第２引数のプロパティを除外したオブジェクトを示す
  async updateUser(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    // userIdに該当するユーザーのニックネームを更新
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    // パスワードの部分は除外
    delete user.hashedPassword;
    return user;
  }
}
