import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { EventRequest, EventResponse } from './dto/event.dtos';

@Injectable()
export class EventService {
  constructor(private readonly accountService: AccountService) {}

  async handleEvent(body: EventRequest): Promise<EventResponse> {
    const { type, amount } = body;

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (type === 'deposit') {
      const { destination } = body;
      if (!destination) {
        throw new Error('Destination account is required for deposit evebt');
      }
      const updatedDestination = await this.accountService.deposit(
        destination,
        amount,
      );

      return { destination: updatedDestination };
    }

    if (type === 'withdraw') {
      const { origin } = body;
      if (!origin) {
        throw new Error('Origin account is required for withdraw event');
      }

      const updatedOrigin = await this.accountService.withdraw(origin, amount);
      return { origin: updatedOrigin };
    }

    if (type === 'transfer') {
      const { origin, destination } = body;
      if (!origin || !destination) {
        throw new Error(
          'Origin and destination accounts are required for transfer event',
        );
      }
      return this.accountService.transfer(origin, destination, amount);
    }

    throw new Error(`Invalid event type: ${type}`);
  }
}
