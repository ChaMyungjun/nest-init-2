import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  age: number;
}
