import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  NotFoundException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Response } from 'express';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/reset')
  async reset(@Res() res: Response) {
    await this.accountService.reset();
    res.status(HttpStatus.OK).send('OK');
  }

  @Get('/balance')
  async getBalance(
    @Query('account_id') accountId: string,
    @Res() res: Response,
  ) {
    try {
      const balance = await this.accountService.getBalance(accountId);
      res.status(200).send(balance + '');
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send('0');
      } else {
        throw error;
      }
    }
  }

  @Post('/event')
  async handleEvent(@Body() body: any, @Res() res: Response) {
    const { type, destination, origin, amount } = body;

    if (type === 'deposit') {
      const account = await this.accountService.deposit(destination, amount);
      res.send({
        destination: { id: account.id, balance: account.balance },
      });
      return;
    }

    if (type === 'withdraw') {
      try {
        const account = await this.accountService.withdraw(origin, amount);
        res.send({
          origin: { id: account.id, balance: account.balance },
        });
        return;
      } catch (error) {
        if (error instanceof NotFoundException) {
          res.status(HttpStatus.NOT_FOUND).send('0');
        } else {
          throw error;
        }
      }
    }

    if (type === 'transfer') {
      try {
        const { origin: updatedOrigin, destination: updatedDestination } =
          await this.accountService.transfer(origin, destination, amount);
        res.send({
          origin: { id: updatedOrigin.id, balance: updatedOrigin.balance },
          destination: {
            id: updatedDestination.id,
            balance: updatedDestination.balance,
          },
        });
        return;
      } catch (error) {
        if (error instanceof NotFoundException) {
          res.status(HttpStatus.NOT_FOUND).send('0');
        } else {
          throw error;
        }
      }
    }

    throw new NotFoundException('Invalid event type');
  }
}
