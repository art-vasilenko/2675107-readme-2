import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'files',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class FileVaultModel extends Document {
  @Prop({ required: true })
  public originalName: string;

  @Prop({ required: true })
  public filename: string;

  @Prop({ required: true })
  public path: string;

  @Prop({ required: true })
  public mimetype: string;

  @Prop({ required: true })
  public size: number;

  @Prop({ required: false })
  public uploadedBy?: string;

  public id?: string;
}

export const FileVaultSchema = SchemaFactory.createForClass(FileVaultModel);

FileVaultSchema.virtual('id').get(function () {
  return this._id.toString();
});
