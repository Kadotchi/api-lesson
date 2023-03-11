import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// クラスバリデーターでクライアントが送るデータに対してバリデーションをかけられる
// whiteListは、入力データのバリデーション時に、指定されたプロパティ以外のプロパティを無視するためのオプション
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
