import { Module } from '@nestjs/common';
import { DiagramsController } from './diagrams.controller';
import { DiagramsService } from './diagrams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagramSchema } from './schemas/diagram.schema';
import { UsersModule } from '../users/users.module';

@Module({
    controllers: [DiagramsController],
    providers: [DiagramsService],
    imports: [
        MongooseModule.forFeature([{ name: 'diagrams', schema: DiagramSchema }]),
        UsersModule,
    ]
})
export class DiagramsModule {}
