import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from 'account/account.controller';
import { Account } from 'account/models/account.model';
import { AccountService } from 'account/account.service';
import { Transaction } from 'account/models/transaction.model';
import { EventController } from 'event/event.controller';
import { EventService } from 'event/event.service';

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
  controllers: [AccountController, EventController],
  providers: [AccountService, EventService],
})
export class AppModule {}
