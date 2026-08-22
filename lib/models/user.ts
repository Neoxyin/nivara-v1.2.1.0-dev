import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  role: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';
  passwordHash: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['STUDENT', 'COUNSELLOR', 'ADMIN'] },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
