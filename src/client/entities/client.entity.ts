import { Account } from 'src/account/entities/account.entity';
import { Base } from 'src/utiles/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
/**
 * 회원을 관리할 관리자들을 위한 테이블, 회원은 이 관리자와 관계를 맺게 된다.
 */
@Entity()
export class Client extends Base {
  @Column({
    comment: '관리자가 로그인에 사용할 이메일',
  })
  email: string;

  @Column({
    comment: '비밀번호 암호화 Encryption 필수',
  })
  password: string;

  @Column({
    comment: '회원이 API 요청에 담아올 자신을 증명하는 요청 키',
  })
  accessKey: string;

  @OneToMany(() => Account, (account) => account.client)
  accounts: Account[];

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  setting: string;
}
