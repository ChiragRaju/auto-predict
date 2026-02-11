import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  email?: string;
  @Column()
  password?: string;

  //these are lifecycle hooks that will be called after the corresponding events occur on the entity. They are useful for logging, auditing, or performing additional actions when an entity is inserted, updated, or removed from the database.
  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id:', this.id);
  }
}
