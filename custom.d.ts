// import { User } from '@prisma/client';

// //グローバル名前空間である express-server-static-core モジュールを宣言
// declare module 'express-server-static-core' {
//   // 標準のexpressの型に対してuserフィールドを追加
//   interface Request {
//     // パスワード情報をクライアントに返さないようにするため
//     // hashedPassword フィールドを除外
//     user?: Omit<User, 'hashedPassword'>;
//   }
// }

// 上記のコメントアウトした書き方が本来推奨されるが上手くいかないので下記に変更
import { User as Customer } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user: Customer;
    }
  }
}
