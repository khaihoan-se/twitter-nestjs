import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async follow(id: string, req: any) {
    const user = await this.userModel.find({ _id: id, followers: req.user.id });
    console.log(user);
    if (user.length > 0) {
      throw new HttpException(
        'You followed this user.',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }
    const newUser = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $push: { followers: req.user.id },
        },
        { new: true },
      )
      .populate('followers following', '-password');

    await this.userModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: { following: id },
      },
      { new: true },
    );
    return newUser;
  }

  async unfollow(id: string, req: any) {
    const newUser = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $pull: { followers: req.user.id },
        },
        { new: true },
      )
      .populate('followers following', '-password');
    await this.userModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        $pull: { following: id },
      },
      { new: true },
    );

    return newUser;
  }
}
