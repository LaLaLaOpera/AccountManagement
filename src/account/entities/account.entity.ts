import { Client } from 'src/client/entities/client.entity';
import { Base } from 'src/utiles/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Account extends Base {
  @Column({
    comment: '사용자가 로그인에 사용할 이메일',
  })
  email: string;

  @Column({
    comment: '비밀번호 암호화 Encryption 필수',
  })
  password: string;

  @Column({
    type: 'simple-json',
  })
  custome: string;

  @ManyToOne(() => Client, (client) => client.accounts)
  client: Client;
}
