import axios from "axios";

const API = "http://localhost:3000";

export function applyForLoan(data: {
  requestedAmount: number;
  requestedRate: number;
  termDays: number;
  purpose?: string;
}) {
  const token = localStorage.getItem("token");

  return axios.post(`${API}/loan-request`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getMyLoanRequests() {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/loan-request/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
