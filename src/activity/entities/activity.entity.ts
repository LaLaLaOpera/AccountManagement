import { Base } from 'src/utiles/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Activity extends Base {
  @Column()
  who: string;

  @Column()
  what: string;
}
