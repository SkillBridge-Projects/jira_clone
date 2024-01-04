import mongoose, { Document, Schema } from 'mongoose';
import striptags from 'striptags';

import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IIssue extends Document {
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description?: string;
  descriptionText?: string;
  estimate?: number;
  timeSpent?: number;
  timeRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
  reporterId: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  authorId: mongoose.Types.ObjectId;
}

const IssueSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: Object.values(IssueType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(IssuePriority),
      required: true,
    },
    listPosition: {
      type: Number,
      required: true,
    },
    description: String,
    descriptionText: String,
    estimate: Number,
    timeSpent: Number,
    timeRemaining: Number,
    reporterId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

// Automatically update the `updatedAt` field on save
// eslint-disable-next-line func-names
IssueSchema.pre<IIssue>('save', function(next) {
  if (this.description) {
    this.descriptionText = striptags(this.description);
  }
  next();
});

const Issue = mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue;
