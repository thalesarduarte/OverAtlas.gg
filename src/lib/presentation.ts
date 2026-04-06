import { MatchStatus } from "@prisma/client";

export function formatDate(value?: Date | null) {
  if (!value) {
    return "Data a confirmar";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value);
}

export function formatDateTime(value?: Date | null) {
  if (!value) {
    return "Data a confirmar";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export function formatDateRange(start?: Date | null, end?: Date | null) {
  if (!start && !end) {
    return "Datas a confirmar";
  }

  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  return formatDate(start ?? end);
}

export function getTournamentStatus(
  startDate?: Date | null,
  endDate?: Date | null
): "upcoming" | "ongoing" | "completed" {
  const now = new Date();

  if (startDate && startDate > now) {
    return "upcoming";
  }

  if (endDate && endDate < now) {
    return "completed";
  }

  return "ongoing";
}

export function getStatusLabel(status: MatchStatus | "upcoming" | "ongoing" | "completed") {
  const map: Record<string, string> = {
    SCHEDULED: "Agendada",
    LIVE: "Ao vivo",
    COMPLETED: "Encerrada",
    CANCELED: "Cancelada",
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed"
  };

  return map[status] ?? status;
}

export function getStatusTone(status: MatchStatus | "upcoming" | "ongoing" | "completed") {
  if (status === "LIVE" || status === "ongoing") {
    return "bg-emerald-500/15 text-emerald-200 border-emerald-400/20";
  }

  if (status === "SCHEDULED" || status === "upcoming") {
    return "bg-sky-500/15 text-sky-200 border-sky-400/20";
  }

  if (status === "CANCELED") {
    return "bg-red-500/15 text-red-200 border-red-400/20";
  }

  return "bg-white/10 text-slate-200 border-white/10";
}
