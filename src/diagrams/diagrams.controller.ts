import { Controller, Get, UseGuards, Request, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import * as mongoose from 'mongoose';
import { DiagramException } from './diagram.exception';

@Controller('diagrams')
export class DiagramsController {

    constructor(private readonly diagramService: DiagramsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllByOwner(@Request() req) {
        let userId: string = req.user.userId;
        return await this.diagramService.getAllByOwner(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createDiagram(@Request() req, @Body() createDiagramDto: CreateDiagramDto) {
        let userId: string = req.user.userId;
        createDiagramDto.ownerId = userId;
        this.diagramService.createDiagram(createDiagramDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getDiagramById(@Request() req, @Param('id') id) {
        let exception = 0;

        let diagram: any = await this.diagramService.getById(id).catch((reason) => {
            if (reason instanceof mongoose.Error.CastError) {
                exception = DiagramException.CANT_CAST_ID;
            }
        });

        if (diagram == null) {
            throw new HttpException('NOT FOUND:DIAGRAM WITH ID(' + id + ') DOES NOT EXIST'
                , HttpStatus.NOT_FOUND);
        }

        if (exception == DiagramException.CANT_CAST_ID) {
            throw new HttpException('BAD REQUEST: INVALID ID', HttpStatus.BAD_REQUEST); 
        }

        if (diagram.ownerId != req.user.userId) {
            let collaboratorFound = false;
            for (let i = 0; i < diagram.projectsCollaboratorsId.length; i++) {
                if (diagram.projectsCollaboratorsId[i] == req.user.userId) {
                    collaboratorFound = true;
                }
            }
            if (!collaboratorFound) {
                throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
            }
        }

        return diagram;
    }
}
