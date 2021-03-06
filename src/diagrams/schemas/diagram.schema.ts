import * as mongoose from 'mongoose';

export const DiagramSchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String,
    diagram: mongoose.Mixed,
    projectsCollaboratorsId: [mongoose.Schema.Types.ObjectId],
    ownerId: mongoose.Schema.Types.ObjectId,
});