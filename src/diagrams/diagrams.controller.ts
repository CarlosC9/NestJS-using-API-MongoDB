import { Controller, Get, UseGuards, Request, Post, Body, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import * as mongoose from 'mongoose';
import { DiagramException } from './diagram.exception';

@Controller('diagrams')
export class DiagramsController {

    constructor(private readonly diagramService: DiagramsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get("/my-diagrams")
    async getAllIdByOwner(@Request() req) {
        let userId: string = req.user.userId;
        let diagrams = await this.diagramService.getAllByOwner(userId);
        let response = new Array();
        for (let i = 0; i < diagrams.length; i++) {
            let diagram = {
                id: "",
                name: "",
            };
            diagram.id = diagrams[i]._id;
            diagram.name = diagrams[i].name;
            response.push(diagram);
        }
        return response;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("my-collaborations")
    async getAllIdByCollaborations(@Request() req) {
        let userId: string = req.user.userId;
        let diagrams = await this.diagramService.getAllByCollaborations(userId);
        let response = new Array();
        for (let i = 0; i < diagrams.length; i++) {
            let diagram = {
                id: "",
                name: "",
            };
            diagram.id = diagrams[i]._id;
            diagram.name = diagrams[i].name;
            response.push(diagram);
        }
        return response;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createDiagram(@Request() req, @Body() createDiagramDto: CreateDiagramDto) {
        let userId: string = req.user.userId;
        createDiagramDto.ownerId = userId;
        let newDiagram = await this.diagramService.createDiagram(createDiagramDto);
        return newDiagram._id;
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

        return diagram.diagram;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async updateDiagram(@Request() req, @Param('id') id, @Body("diagram") diagramReceived) {
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

        await this.diagramService.updateDiagram(id,diagramReceived);
    }
}
