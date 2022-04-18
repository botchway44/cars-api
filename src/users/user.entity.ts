import { AfterInsert, AfterLoad, BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logUser() {
    console.log(`User with id ${this.id} has been created`);
  }

  @BeforeInsert()
  logbefore() {
    console.log("Before insert for user", this.email);
  }

  @AfterLoad()
  logAfterLoad() {
    this.data = "Retrieved from database";
  }

  @Column({ default: false, nullable: true })
  data: String
}