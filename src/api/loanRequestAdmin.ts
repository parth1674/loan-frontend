import axios from "axios";
import { buildApiUrl } from "./config";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getAllLoanRequests() {
  return axios.get(buildApiUrl("/loan-request/admin"), {
    headers: authHeader(),
  });
}

export function approveLoanRequest(id: string, adminNote?: string) {
  return axios.post(
    buildApiUrl(`/loan-request/${id}/approve`),
    { adminNote },
    { headers: authHeader() }
  );
}

export function rejectLoanRequest(id: string, adminNote?: string) {
  return axios.post(
    buildApiUrl(`/loan-request/${id}/reject`),
    { adminNote },
    { headers: authHeader() }
  );
}
