import { CalendarClock, Percent, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import type { InterestSummary } from "@/api/interest";

type DailyInterestSummaryProps = {
  summary?: InterestSummary | null;
  fallback?: Partial<InterestSummary> & {
    totalInterest?: number;
    totalInterestPending?: number;
    dailyInterestAccrued?: number;
    lastInterestCalculatedAt?: string | null;
    interestLastCalculatedAt?: string | null;
  } | null;
};

const formatMoney = (value: unknown) => {
  const amount = Number(value ?? 0);

  return `INR ${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Pending first run";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DailyInterestSummary({
  summary,
  fallback,
}: DailyInterestSummaryProps) {
  const totalDailyInterest =
    summary?.totalDailyInterest ??
    fallback?.totalDailyInterest ??
    fallback?.dailyInterestAccrued ??
    0;

  const totalInterestAccrued =
    summary?.totalInterestAccrued ??
    fallback?.totalInterestAccrued ??
    fallback?.totalInterest ??
    0;

  const interestPending =
    summary?.interestPending ??
    fallback?.interestPending ??
    fallback?.totalInterestPending ??
    0;

  const lastCalculatedAt =
    summary?.lastCalculatedAt ??
    fallback?.lastInterestCalculatedAt ??
    fallback?.interestLastCalculatedAt ??
    null;

  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Daily Interest</h2>
          <p className="text-xs text-gray-500">
            Interest is posted by the backend scheduler from the day after loan start.
          </p>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          <span>Last run: {formatDateTime(lastCalculatedAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InterestMetric
          icon={<TrendingUp className="h-4 w-4" />}
          label="Daily estimate"
          value={formatMoney(totalDailyInterest)}
        />
        <InterestMetric
          icon={<Percent className="h-4 w-4" />}
          label="Total accrued"
          value={formatMoney(totalInterestAccrued)}
        />
        <InterestMetric
          icon={<CalendarClock className="h-4 w-4" />}
          label="Pending interest"
          value={formatMoney(interestPending)}
        />
      </div>
    </div>
  );
}

function InterestMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
