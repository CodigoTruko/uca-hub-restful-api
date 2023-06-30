import { Module } from "@nestjs/common";
import { EventModule } from "./events/event.module";
import { CommunityModule } from "./communities/community.module";
import { CategoryModule } from "./categories/category.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ProgramModule } from "./programs/program.module";
import { FacultyModule } from "./faculties/faculty.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import Variables from "./config/configuration"
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'), // Loaded from .ENV
      })
    }),
    EventModule,
    CommunityModule,
    CategoryModule,
    ProgramModule,
    FacultyModule,
    AuthModule
  ],
})
export class AppModule {}