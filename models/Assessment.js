// models/Assessment.js
import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema(
  {
    clo: { type: String, required: true }, 
    assessmentType: { type: String, required: true }, 
    assessmentMethod: { type: String, required: true }, 
    assessmentDescription: { type: String, required: true },
    weight: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);