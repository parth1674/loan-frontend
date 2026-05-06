import axios from "axios";
import { buildApiUrl } from "./config";

export function applyForLoan(data: {
  requestedAmount: number;
  requestedRate: number;
  termDays: number;
  purpose?: string;
}) {
  const token = localStorage.getItem("token");

  return axios.post(buildApiUrl("/loan-request"), data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getMyLoanRequests() {
  const token = localStorage.getItem("token");

  return axios.get(buildApiUrl("/loan-request/my"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
