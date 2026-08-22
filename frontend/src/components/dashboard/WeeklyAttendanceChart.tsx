import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyAttendance } from "@/data/employee";

const statusColor: Record<string, string> = {
  present: "var(--chart-1)",
  leave: "var(--chart-3)",
  absent: "var(--chart-4)",
  weekoff: "var(--border)",
  holiday: "var(--chart-5)",
};

const legend = [
  { label: "Present", key: "present" },
  { label: "Leave", key: "leave" },
  { label: "Absent", key: "absent" },
  { label: "Week off", key: "weekoff" },
];

export function WeeklyAttendanceChart() {
  const data = weeklyAttendance.map((d) => ({
    ...d,
    value: d.status === "present" ? d.hours : d.status === "weekoff" ? 0.25 : 0.6,
  }));

  return (
    <div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -24 }} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => `${v}h`}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", radius: 6 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]!.payload as (typeof data)[number];
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-pop">
                    <p className="font-semibold text-popover-foreground">
                      {d.day}, {d.date}
                    </p>
                    <p className="mt-1 capitalize text-muted-foreground">{d.status}</p>
                    {d.status === "present" && (
                      <p className="text-muted-foreground num">
                        {d.checkIn} – {d.checkOut} · {d.hours}h
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 4, 4]}>
              {data.map((d) => (
                <Cell key={d.day} fill={statusColor[d.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {legend.map((l) => (
          <li key={l.key} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: statusColor[l.key] }}
              aria-hidden
            />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
