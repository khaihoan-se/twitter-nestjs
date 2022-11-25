import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop()
  filename: string;
  @Prop()
  path: string;
  @Prop()
  mimetype: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
