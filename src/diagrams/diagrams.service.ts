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

    async getAllByCollaborations(ownerId : string) {
        return await this.diagramModel.find({projectsCollaboratorsId : new ObjectId(ownerId)}).exec();
    }

    async createDiagram(createDiagramDto : CreateDiagramDto) {
        createDiagramDto.ownerId = new ObjectId(createDiagramDto.ownerId) ;
        console.log(createDiagramDto);
        createDiagramDto.diagram = JSON.parse('{"mxGraphModel":{"root":{"mxCell":[{"_attributes":{"id":"0"}},{"_attributes":{"id":"1","parent":"0"}}]}}}');
        const createdDiagram = new this.diagramModel(createDiagramDto);

        return await createdDiagram.save();
    }

    async getById(id: string) {
        return await this.diagramModel.findById(id).exec();
    }

    async updateDiagram(id : string, diagram) {
        let res = await this.diagramModel.updateOne({ _id: new ObjectId(id) }, 
        { diagram: diagram });
        return res.n;
    }
}
