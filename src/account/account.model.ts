import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.model';

@Entity()
export class Account {
  @PrimaryColumn()
  id: string;
  @Column()
  balance: number;
  @OneToMany(() => Transaction, (transaction) => transaction.origin)
  originTransactions: Transaction[];
  @OneToMany(() => Transaction, (transaction) => transaction.destination)
  destinationTransactions: Transaction[];
}
