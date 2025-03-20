import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './models/transaction.model';
import { Account } from './models/account.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async reset() {
    await this.transactionRepository.clear();
    await this.accountRepository.clear();
  }

  async getBalance(accountId: string): Promise<number> {
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) throw new NotFoundException('Account not found');
    return account.balance;
  }

  async deposit(accountId: string, amount: number): Promise<Account> {
    const accountExists = await this.accountRepository.findOneBy({
      id: accountId,
    });

    const account = accountExists
      ? { id: accountId, balance: accountExists.balance + amount }
      : { id: accountId, balance: amount };

    return this.accountRepository.save(account);
  }

  async withdraw(accountId: string, amount: number): Promise<Account> {
    return this.dataSource.transaction(async (manager) => {
      const account = await manager.findOne(Account, {
        where: { id: accountId },
      });

      if (!account || account.balance < amount) {
        throw new NotFoundException(
          'Insufficient balance or account not found',
        );
      }
      const transaction = manager.create(Transaction, {
        type: 'withdraw',
        amount,
        origin: account,
        originBalance: account.balance - amount,
      });

      account.balance -= amount;

      await manager.save(transaction);
      await manager.save(account);

      return account;
    });
  }

  async transfer(
    originId: string,
    destinationId: string,
    amount: number,
  ): Promise<{ origin: Account; destination: Account }> {
    return this.dataSource.transaction(async (manager) => {
      let [origin, destination] = await Promise.all([
        manager.findOne(Account, {
          where: { id: originId },
        }),
        manager.findOne(Account, {
          where: { id: destinationId },
        }),
      ]);

      if (!origin || origin.balance < amount) {
        throw new NotFoundException(
          'Insufficient balance or account not found',
        );
      }

      if (!destination) {
        destination = manager.create(Account, {
          id: destinationId,
          balance: 0,
        });
      }

      const transaction = manager.create(Transaction, {
        type: 'transfer',
        amount,
        origin,
        destination,
        originBalance: origin.balance + amount,
        destinationBalance: destination.balance - amount,
      });

      origin.balance -= amount;
      destination.balance += amount;

      await Promise.all([manager.save(origin), manager.save(destination)]);
      await manager.save(transaction);

      return { origin, destination };
    });
  }
}
