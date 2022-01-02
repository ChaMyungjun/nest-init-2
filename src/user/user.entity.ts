import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
