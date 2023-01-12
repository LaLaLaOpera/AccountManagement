import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from 'src/client/client.service';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repo: Repository<Account>,
    private clientService: ClientService,
  ) {}
  async create(createAccountDto: CreateAccountDto, accessKey: string) {
    const client = await this.clientService.findByKey(accessKey);
    console.log(client);
    if (client == null) {
      throw new NotFoundException('Invalid Access Key');
    }
    createAccountDto.client = client;
    return this.repo.save(createAccountDto);
  }
  async signUp(createAccountDto, accessKey) {
    const client = await this.clientService.findByKey(accessKey);
    console.log(client);
    if (client == null) {
      throw new NotFoundException('Invalid Access Key');
    }

    const account = await this.repo.findOne({
      where: {
        email: createAccountDto.email,
      },
    });
    if (createAccountDto.password == account.password) {
      return account;
    }
    throw new NotFoundException('Invalid User Info');
  }

  findAll(accessKey) {
    return accessKey;
  }

  findOne(id: number, accessKey) {
    return accessKey;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
