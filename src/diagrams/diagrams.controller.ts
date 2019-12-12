import { Controller, Get, UseGuards, Request, Post, Body, Param, HttpException, HttpStatus, Put, Delete } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import * as mongoose from 'mongoose';
import { DiagramException } from './diagram.exception';
import { UsersService } from '../users/users.service';

@Controller('diagrams')
export class DiagramsController {

    constructor(
        private readonly diagramService: DiagramsService,
        private readonly userService : UsersService,
        ) { }

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
    @Put(":id/add-collaboration")
    async addCollaboration(@Request() req, @Param('id') id, @Body("username") username) {
        let exception = 0;
        let userId: string = req.user.userId;

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
        
        if (diagram.ownerId != userId) {
            let collaboratorFound = false;
            for (let i = 0; i < diagram.projectsCollaboratorsId.length; i++) {
                if (diagram.projectsCollaboratorsId[i] == userId) {
                    collaboratorFound = true;
                }
            }
            if (!collaboratorFound) {
                throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
            }
        }

        let user : any = await this.userService.findOneByUsername(username);


        if (user == null) {
            throw new HttpException('User with username(' + username + ') does not exists'
                , HttpStatus.NOT_FOUND);
        }

        this.diagramService.addCollaborator(id,user._id);
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
        let userId: string = req.user.userId;

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

        if (diagram.ownerId != userId) {
            let collaboratorFound = false;
            for (let i = 0; i < diagram.projectsCollaboratorsId.length; i++) {
                if (diagram.projectsCollaboratorsId[i] == userId) {
                    collaboratorFound = true;
                }
            }
            if (!collaboratorFound) {
                throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
            }
        }

        let colors = await this.userService.getColors(userId);

        return {
            diagram : diagram.diagram,
            colorParentType : colors.parentType,
            colorScaleChage : colors.scaleChange,
        };
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

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteDiagram(@Request() req, @Param('id') id) {
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

        await this.diagramService.deleteDiagram(id);
    }

}
