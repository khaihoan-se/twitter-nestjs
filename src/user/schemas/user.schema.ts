import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Post } from '../../post/schemas/post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, maxlength: 25 })
  fullname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  banner: string;

  @Prop()
  link: string;

  @Prop()
  bio: string;

  @Prop()
  birth: Date;

  @Prop()
  location: string;

  @Prop()
  followers: [];

  @Prop()
  following: [];

  @Prop()
  saved: Post[];

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
