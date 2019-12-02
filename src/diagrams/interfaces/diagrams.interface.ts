import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Diagram extends Document {
    name: String,
    diagram: mongoose.Mixed,
    projectsCollaboratorsId: [mongoose.Schema.Types.ObjectId],
    ownerId: mongoose.Schema.Types.ObjectId,
}