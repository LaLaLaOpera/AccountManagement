import { Client } from 'src/client/entities/client.entity';

export class CreateAccountDto {
  email: string;

  password: string;

  custom: string;

  client: Client;
}
