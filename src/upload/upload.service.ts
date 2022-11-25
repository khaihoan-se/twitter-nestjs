import { Upload, UploadDocument } from './schemas/upload.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private uploadModal: Model<UploadDocument>,
  ) {}

  async create(file: Express.Multer.File): Promise<UploadDocument> {
    const fileName = file.path;
    const createdUser = new this.uploadModal(fileName);
    return createdUser.save();
  }

  async findById(id: string): Promise<UploadDocument> {
    return this.uploadModal.findById(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUploadDto,
  ): Promise<UploadDocument> {
    return this.uploadModal
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UploadDocument> {
    return this.uploadModal.findByIdAndDelete(id).exec();
  }
}
