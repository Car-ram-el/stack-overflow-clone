import axios from "axios";

const API = axios.create({
  // TODO
  // baseURL: "https://stack-overflow-eight.vercel.app/",
  baseURL: "http://localhost:5001",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
  return req;
});

// auth
export const logIn = (data) => API.post("/user/login", data);
export const signUp = (data) => API.post("/user/signup", data);

// questions
export const postQuestion = (data) =>API.post("/questions/Ask", data);
export const getAllQuestions = () => API.get("/questions/get");
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value, userId) =>API.patch(`/questions/vote/${id}`,{value,userId});

// answers
export const postAnswer = (id, noOfAnswers, answerBody, userAnswered, answerUserId) => API.patch(`/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered, answerUserId });
export const deleteAnswer = (id, answerId, noOfAnswers) => API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

// users
export const getAllUsers = () => API.get("/user/getAllUsers");
export const updateProfile = (id, updateData) => API.patch(`/user/update/${id}`, updateData);