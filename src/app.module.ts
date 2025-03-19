import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from 'account/account.controller';
import { Account } from 'account/account.model';
import { AccountService } from 'account/account.service';
import { Transaction } from 'account/transaction.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite3',
      entities: [Account, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Account, Transaction]),
  ],
  exports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AppModule {}
