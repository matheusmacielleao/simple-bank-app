import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.model';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: 'withdraw' | 'deposit' | 'transfer';
  @Column()
  amount: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
  @Column()
  originBalance?: number;
  @Column({ nullable: true })
  destinationBalance?: number;
  @ManyToOne(() => Account, { nullable: true })
  destination?: Account;
  @ManyToOne(() => Account)
  origin: Account;
}
