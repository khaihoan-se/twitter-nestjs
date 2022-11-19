import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Post } from '../../post/schemas/post.schema';
import * as mongoose from 'mongoose';

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

  @Prop({
    default:
      'https://res.cloudinary.com/devstylea/image/upload/v1664359082/fallback_profile_sgxnrc.png',
  })
  avatar: string;

  @Prop({ default: '' })
  banner: string;

  @Prop({ default: '' })
  link: string;

  @Prop({ default: '' })
  bio: string;

  @Prop()
  birth: Date;

  @Prop({ default: '' })
  location: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  following: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  saved: Post[];

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
