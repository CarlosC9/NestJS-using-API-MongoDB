import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagramsModule } from './diagrams/diagrams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/diagramEditorDB'), DiagramsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
