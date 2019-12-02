import { Injectable} from '@nestjs/common';
import { Diagram } from './interfaces/diagrams.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDiagramDto } from './dto/create-diagram.dto';

const ObjectId = require('mongoose').Types.ObjectId; 

@Injectable()
export class DiagramsService {

    constructor(@InjectModel('diagrams') private readonly diagramModel: Model<Diagram>) {}

    async getAllByOwner(ownerId : string) {
        return await this.diagramModel.find({ownerId : new ObjectId(ownerId)}).exec();
    }

    async createDiagram(createDiagramDto : CreateDiagramDto) {
        createDiagramDto.ownerId = new ObjectId(createDiagramDto.ownerId) ;
        const createdDiagram = new this.diagramModel(createDiagramDto);

        return await createdDiagram.save();
    }

    async getById(id: string) {
        return await this.diagramModel.findById(id).exec();
    }
}
