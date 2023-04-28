import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Client } from './entities/client.entity';
import { JwtService } from '@nestjs/jwt';
import { passwordEncryption } from 'src/utiles/password.encryption';
import { randomBytes } from 'crypto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private repo: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createClientDto: CreateClientDto) {
    const client = this.repo.create(createClientDto);

    client.password = await passwordEncryption.encryption(client.password);

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
    if (!(await passwordEncryption.validation(password, client))) {
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
    for (const user of updateClientDto.setting.Managers) {
      user.password = await passwordEncryption.encryption(user.password);
    }
    const result = await this.repo.update(id, updateClientDto);

    return result.affected;
  }
  async managerSignin(params, id) {
    console.log(id);
    const client = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (client?.id !== id) {
      throw new NotFoundException();
    }
    const Managers: Array<any> = client.setting['Managers'];
    // eslint-disable-next-line @typescript-eslint/ban-types
    const Authorization: Map<string, Array<string>> = client.setting[
      'Authorization'
    ];
    for (const manager of Managers) {
      if (
        manager.id == params.id &&
        (await passwordEncryption.validation(params.password, manager))
      ) {
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
  async findByKey(accessKey: string) {
    console.log(accessKey);
    return await this.repo.findOne({
      where: { accessKey: accessKey },
    });
  }
  async ga4() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const credentials = require('../../ga4-feature-test-a537eaf9bae5.json');

    const test = new BetaAnalyticsDataClient({
      credentials: credentials,
    });
    const report = await test.runReport({
      property: 'properties/326007266',
      dateRanges: [
        {
          startDate: '2022-03-31',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });
    return report;
  }
}
