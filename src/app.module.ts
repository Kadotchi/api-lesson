import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // appモジュールでグローバルをtrueにして
    // インポートすることで個々のモジュールでのインポートが必要なくなる
    // ここでは環境変数を使うためにインポートする。
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TodoModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
