import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { AccessKeyMiddleware } from './middleware/accesskey.middleware';
import { ActivityModule } from './activity/activity.module';
@Module({
  imports: [
    JwtModule.register({
      secret: 'TEST',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [Account, Client],
      synchronize: true, // false가 안전함
    }),
    ClientModule,
    AccountModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('client/signup', 'client/signin', 'client/signin/sub/:id')
      .forRoutes('client'),
      consumer.apply(AccessKeyMiddleware).forRoutes('api');
  }
}
