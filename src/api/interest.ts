import API from "./axios";

export type InterestHistoryPoint = {
  id?: string;
  loanId?: string;
  calculationDate: string;
  interestAmount: number;
  outstandingBefore?: number;
  outstandingAfter?: number;
};

export type LoanInterestSummary = {
  loanId?: string;
  principal?: number;
  outstanding?: number;
  annualRate?: number;
  dailyRate?: number;
  dailyInterest?: number;
  interestAccrued?: number;
  interestPending?: number;
  lastCalculatedAt?: string | null;
};

export type InterestSummary = {
  totalDailyInterest?: number;
  totalInterestAccrued?: number;
  interestPending?: number;
  lastCalculatedAt?: string | null;
  loans?: LoanInterestSummary[];
};

export const getInterestSummary = (userId: string) =>
  API.get<InterestSummary>(`/loan/interest/summary/${userId}`);

export const getLoanInterestHistory = (loanId: string) =>
  API.get<{ history: InterestHistoryPoint[] }>(`/loan/${loanId}/interest-history`);
