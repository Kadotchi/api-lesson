import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// クラスバリデーションを有効化するために必要
import { ValidationPipe } from '@nestjs/common';
// Requestのデータ型
import { Request } from 'express';
// クライアントのデータからCookieを取り出すために必要
import * as cookieParser from 'cookie-parser';
// csrf対策用のトークンを生成するのに必要
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // DTOとクラスバリデーションを有効化
  // whiteListは、入力データのバリデーション時に、指定されたプロパティ以外のプロパティを無視するためのオプション
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // フロント側と通信するために必要な設定
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  // フロントエンドから受け取ったCookieを解析できるようにする
  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        // サーバー側で判定するために必要
        return req.header('csrf-token');
      },
    }),
  );

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
