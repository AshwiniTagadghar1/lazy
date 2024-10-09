import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  id: string;
  kind: string;
  etag: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  statistics: {
    subscriberCount: string;
  };
}

const videoSchema: Schema = new Schema({
  kind: { type: String, required: true },
  etag: { type: String, required: true },
  id: { type: String, required: true },
  snippet: {
    publishedAt: { type: Date, required: true },
    channelId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnails: {
      default: {
        url: { type: String, required: true },
        width: { type: Number },
        height: { type: Number },
      },
    },
  },
  statistics: {
    subscriberCount: { type: String },
  },
});

export const VideoModel = mongoose.model<IVideo>('Videos', videoSchema);
