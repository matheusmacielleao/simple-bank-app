import {
  Controller,
  Get,
  Post,
  Query,
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
}
