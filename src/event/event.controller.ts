import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EventService } from './event.service';
import { EventRequest } from './dto/event.dtos';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/event')
  async handleEvent(@Body() body: EventRequest, @Res() res: Response) {
    try {
      const response = await this.eventService.handleEvent(body);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send('0');
      }
      throw error;
    }
  }
}
