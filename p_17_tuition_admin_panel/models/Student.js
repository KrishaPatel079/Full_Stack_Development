import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  fees: { type: Number, required: true },
  contact: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
