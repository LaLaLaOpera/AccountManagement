import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrpyt } from 'crypto';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { promisify } from 'util';

import { Client } from './entities/client.entity';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrpyt);

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repo: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createClientDto: CreateClientDto) {
    const client = this.repo.create(createClientDto);

    const salt = randomBytes(8).toString('hex'); // => 16 characters long

    // Hash the salt and the password together
    const hash = (await scrypt(client.password, salt, 32)) as Buffer;

    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    client.password = result;

    client.accessKey =
      randomBytes(24).toString('hex') +
      client.email.split('@', 1) +
      randomBytes(24).toString('hex');

    const cleint_ = await this.repo.save(client);
    return cleint_;
  }
  async signin(email: string, password: string) {
    const client = await this.repo.findOne({
      where: {
        email: email,
      },
    });
    if (!client) {
      throw new NotFoundException('user not found!');
    }
    const [salt, storedhash] = client.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedhash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    const access_token = this.jwtService.sign(
      {
        payload: {
          id: client.id,
          role: 'Root',
        },
      },
      {
        secret: 'TEST',
      },
    );
    return access_token;
  }
  async put(updateClientDto, id) {
    const result = await this.repo.update(id, updateClientDto);

    return result.affected;
  }
  async managerSignin(params, id) {
    const client = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    const Managers: Array<any> = client.setting['Managers'];
    // eslint-disable-next-line @typescript-eslint/ban-types
    const Authorization: Map<string, Array<string>> = client.setting[
      'Authorization'
    ];
    for (const manager of Managers) {
      if (manager.id == params.id && manager.password == params.password) {
        const features = Object.keys(Authorization);
        const allow = [];
        features.map(async (value) => {
          const list = Authorization[value];
          if (list.includes(params.id)) allow.push(value);
        });
        return this.jwtService.sign(
          {
            payload: {
              id: params.id,
              role: 'Manager',
              allow,
            },
          },
          {
            secret: 'TEST',
          },
        );
      }
    }
    throw new NotFoundException('user not found || wrong password');
  }
}
