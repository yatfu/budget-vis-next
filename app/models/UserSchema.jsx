import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategories: [SubcategorySchema],
});

const UserFinanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  income: [CategorySchema],
  expenses: [CategorySchema],
}, { timestamps: true });

export default mongoose.models.UserFinance || mongoose.model("UserFinance", UserFinanceSchema);