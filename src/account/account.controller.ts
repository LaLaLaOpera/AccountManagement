import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('api')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Query() accessKey: string,
  ) {
    return this.accountService.create(createAccountDto, accessKey);
  }

  @Get()
  findAll(@Query() accessKey: string) {
    return this.accountService.findAll(accessKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() accessKey: string) {
    return this.accountService.findOne(+id, accessKey);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
