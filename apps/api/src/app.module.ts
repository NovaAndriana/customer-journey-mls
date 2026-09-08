import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { MotorModelsModule } from './modules/motor-models/motor-models.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/dto/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    MotorModelsModule,
    CustomersModule,
    InteractionsModule,
    AnalyticsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}