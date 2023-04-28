import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/signup')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Post('/signin')
  clientSignIn(@Body() body: CreateClientDto) {
    return this.clientService.signin(body.email, body.password);
  }

  @Post('/:id/subsignin')
  subClintSignIn(@Body() body, @Param('id') id: string) {
    return this.clientService.managerSignin(body, id);
  }

  @Put('/:id')
  addManager(
    @Req() req,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    if (id != req['user'].payload.id) {
      return 'unahtorized access';
    }
    console.log('so far?');
    return this.clientService.put(updateClientDto, id);
  }
  @Get('/report/:id')
  ga4test(@Param('id') id: string) {
    return this.clientService.ga4();
  }
}
