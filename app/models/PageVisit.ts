import mongoose, { Schema, Document } from "mongoose";

export interface PageVisitDoc extends Document {
  page: string;
  referrer: string;
  userAgent: string;
  country: string;
  timestamp: Date;
}

const PageVisitSchema = new Schema<PageVisitDoc>({
  page:      { type: String, required: true, index: true },
  referrer:  { type: String, default: "" },
  userAgent: { type: String, default: "" },
  country:   { type: String, default: "" },
  timestamp: { type: Date, default: Date.now, index: true },
});

PageVisitSchema.index({ page: 1, timestamp: -1 });

export default mongoose.models.PageVisit ||
  mongoose.model("PageVisit", PageVisitSchema);
