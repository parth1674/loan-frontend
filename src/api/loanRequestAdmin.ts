import axios from "axios";

const API = "http://localhost:3000"; // abhi hardcoded, baad me env

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getAllLoanRequests() {
  return axios.get(`${API}/loan-request/admin`, {
    headers: authHeader(),
  });
}

export function approveLoanRequest(id: string, adminNote?: string) {
  return axios.post(
    `${API}/loan-request/${id}/approve`,
    { adminNote },
    { headers: authHeader() }
  );
}

export function rejectLoanRequest(id: string, adminNote?: string) {
  return axios.post(
    `${API}/loan-request/${id}/reject`,
    { adminNote },
    { headers: authHeader() }
  );
}
