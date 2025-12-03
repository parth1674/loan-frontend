import API from "./axios";

// REGISTER user
export const registerUser = (fullname: string, email: string, password: string) =>
  API.post("/auth/register", {
    fullname,
    email,
    password,
  });

// LOGIN user
export const loginUser = (email: string, password: string) =>
  API.post("/auth/login", {
    email,
    password,
  });

// GET user by ID
export const getUser = (id: string) =>
  API.get(`/auth/user/${id}`);
