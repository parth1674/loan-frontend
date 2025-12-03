import API from "./axios";

export const getClientDashboard = (userId: string) =>
  API.get(`/loan/dashboard/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getMyLoans = (userId: string) =>
  API.get(`/loan/my-loans/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getUserProfile = (userId: string) =>
  API.get(`/auth/user/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const payLoan = (loanId: string, amount: number, type: string = "EMI") =>
  API.post(
    `/loan/pay/${loanId}`,
    { amount, type },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );