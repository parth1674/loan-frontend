import API from "./axios";

export const createLoan = (userId: string, data: any) =>
  API.post(`/loan/create/${userId}`, data);

export const getUserLoans = (userId: string) =>
  API.get(`/loan/user/${userId}`);

export const payLoan = (loanId: string, data: any) =>
  API.post(`/loan/pay/${loanId}`, data);

export const getDashboard = (userId: string) =>
  API.get(`/loan/dashboard/${userId}`);
