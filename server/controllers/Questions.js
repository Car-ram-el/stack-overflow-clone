import Questions from "../models/Questions.js";
import mongoose from "mongoose";

export const AskQuestion = async (req, res) => {
  const input = req.body;
  const postQuestion = new Questions(input);
  try {
    await postQuestion.save();
    res.status(200).json("Question posted successfully.");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post question");
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const list = await Questions.find();
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("question unavailable...");

  try {
    await Questions.findByIdAndDelete(_id);
    res.status(200).json({ message: "Successfully deleted questions." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("Question unavailable.");

  try {
    const question = await Questions.findById(_id);
    const upIndex = question.upVote.findIndex(id => id === userId);
    const downIndex=question.downVote.findIndex(id => id === userId);

    if (value === "upVote") {
      if (downIndex !== -1) question.downVote = question.downVote.filter(id => id !== userId);
      if (upIndex === -1) question.upVote.push(userId);
      else question.upVote = question.upVote.filter(id => id !== userId);
    } else if (value === "downVote") {
      if (upIndex !== -1) question.upVote = question.upVote.filter(id => id !== userId);
      if (downIndex === -1) question.downVote.push(userId);
      else question.downVote = question.downVote.filter(id => id !== userId);
    }

    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "Vote success." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
