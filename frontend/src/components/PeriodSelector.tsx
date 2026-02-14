import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export type PeriodType = "month" | "week" | "custom";

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  type: PeriodType;
  label: string;
}

interface PeriodSelectorProps {
  onPeriodChange: (period: PeriodRange) => void;
  currentPeriod: PeriodRange;
}

export default function PeriodSelector({ onPeriodChange, currentPeriod }: PeriodSelectorProps) {
  const [periodType, setPeriodType] = useState<PeriodType>(currentPeriod.type);
  const [selectedDate, setSelectedDate] = useState<Date>(currentPeriod.startDate);

  const handlePeriodTypeChange = (type: PeriodType) => {
    setPeriodType(type);
    const today = new Date();

    let newPeriod: PeriodRange;

    if (type === "month") {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "month",
        label: format(today, "MMMM yyyy", { locale: ptBR }),
      };
    } else if (type === "week") {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "week",
        label: `Semana de ${format(start, "dd/MM", { locale: ptBR })} a ${format(end, "dd/MM", { locale: ptBR })}`,
      };
    } else {
      newPeriod = {
        startDate: today,
        endDate: today,
        type: "custom",
        label: format(today, "dd/MM/yyyy", { locale: ptBR }),
      };
    }

    setSelectedDate(newPeriod.startDate);
    onPeriodChange(newPeriod);
  };

  const handlePrevious = () => {
    let newDate: Date;
    let newPeriod: PeriodRange;

    if (periodType === "month") {
      newDate = subMonths(selectedDate, 1);
      const start = startOfMonth(newDate);
      const end = endOfMonth(newDate);
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "month",
        label: format(newDate, "MMMM yyyy", { locale: ptBR }),
      };
    } else if (periodType === "week") {
      newDate = subWeeks(selectedDate, 1);
      const start = startOfWeek(newDate, { weekStartsOn: 1 });
      const end = endOfWeek(newDate, { weekStartsOn: 1 });
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "week",
        label: `Semana de ${format(start, "dd/MM", { locale: ptBR })} a ${format(end, "dd/MM", { locale: ptBR })}`,
      };
    } else {
      newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      newPeriod = {
        startDate: newDate,
        endDate: newDate,
        type: "custom",
        label: format(newDate, "dd/MM/yyyy", { locale: ptBR }),
      };
    }

    setSelectedDate(newDate);
    onPeriodChange(newPeriod);
  };

  const handleNext = () => {
    let newDate: Date;
    let newPeriod: PeriodRange;
    const today = new Date();

    if (periodType === "month") {
      newDate = subMonths(selectedDate, -1);
      const start = startOfMonth(newDate);
      const end = endOfMonth(newDate);
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "month",
        label: format(newDate, "MMMM yyyy", { locale: ptBR }),
      };
    } else if (periodType === "week") {
      newDate = subWeeks(selectedDate, -1);
      const start = startOfWeek(newDate, { weekStartsOn: 1 });
      const end = endOfWeek(newDate, { weekStartsOn: 1 });
      newPeriod = {
        startDate: start,
        endDate: end,
        type: "week",
        label: `Semana de ${format(start, "dd/MM", { locale: ptBR })} a ${format(end, "dd/MM", { locale: ptBR })}`,
      };
    } else {
      newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      newPeriod = {
        startDate: newDate,
        endDate: newDate,
        type: "custom",
        label: format(newDate, "dd/MM/yyyy", { locale: ptBR }),
      };
    }

    if (newDate <= today) {
      setSelectedDate(newDate);
      onPeriodChange(newPeriod);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 p-6">
      <div className="flex flex-col gap-4">
        {/* Tipo de Período */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Período de Análise</h3>
        </div>

        {/* Botões de Seleção */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={periodType === "month" ? "default" : "outline"}
            onClick={() => handlePeriodTypeChange("month")}
            className={periodType === "month" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            Por Mês
          </Button>
          <Button
            variant={periodType === "week" ? "default" : "outline"}
            onClick={() => handlePeriodTypeChange("week")}
            className={periodType === "week" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            Por Semana
          </Button>
          <Button
            variant={periodType === "custom" ? "default" : "outline"}
            onClick={() => handlePeriodTypeChange("custom")}
            className={periodType === "custom" ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}
          >
            Por Dia
          </Button>
        </div>

        {/* Navegação de Período */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 text-center">
            <p className="text-sm text-slate-400">Período Selecionado</p>
            <p className="text-lg font-bold text-amber-500">{currentPeriod.label}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Informações do Período */}
        <div className="grid grid-cols-2 gap-2 pt-4 bg-slate-800/50 rounded p-3">
          <div>
            <p className="text-xs text-slate-500">Data Inicial</p>
            <p className="text-sm font-bold text-white">{format(currentPeriod.startDate, "dd/MM/yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Data Final</p>
            <p className="text-sm font-bold text-white">{format(currentPeriod.endDate, "dd/MM/yyyy")}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
