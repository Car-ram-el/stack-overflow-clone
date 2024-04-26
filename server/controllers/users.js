import mongoose from "mongoose";
import users from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    const userDetails = [];
    allUsers.forEach(u => {
      userDetails.push({
        _id: u._id,
        name: u.name,
        about: u.about,
        tags: u.tags,
        joinedOn: u.joinedOn,
      });
    });
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json("user unavailable...");

  try {
    const updatedProfile = await users.findByIdAndUpdate(_id,{ $set: { name: name, about: about, tags: tags } },{ new: true });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};
