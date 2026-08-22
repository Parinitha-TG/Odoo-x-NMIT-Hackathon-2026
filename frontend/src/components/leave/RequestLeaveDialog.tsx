import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leaveBalances } from "@/data/employee";

interface Errors {
  type?: string;
  from?: string;
  to?: string;
  reason?: string;
}

export function RequestLeaveDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const reset = () => {
    setType("");
    setFrom("");
    setTo("");
    setReason("");
    setErrors({});
  };

  const validate = () => {
    const e: Errors = {};
    if (!type) e.type = "Select a leave type.";
    if (!from) e.from = "Start date is required.";
    if (!to) e.to = "End date is required.";
    if (from && to && to < from) e.to = "End date must be after the start date.";
    if (reason.trim().length < 10) e.reason = "Please add at least 10 characters of context.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      reset();
      toast.success("Leave request submitted", {
        description: "Your manager will review it shortly. (Demo data — nothing is saved.)",
      });
    }, 900);
  };

  const err = (msg?: string) =>
    msg ? (
      <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
        {msg}
      </p>
    ) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4" /> Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request leave</DialogTitle>
          <DialogDescription>
            Submit a new leave request for manager approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <Label htmlFor="leave-type">Leave type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger
                id="leave-type"
                aria-invalid={!!errors.type}
                className={`mt-1.5 w-full ${errors.type ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveBalances.map((b) => (
                  <SelectItem key={b.type} value={b.type}>
                    {b.type} · {b.total - b.used} left
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err(errors.type)}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="from-date">Start date</Label>
              <Input
                id="from-date"
                type="date"
                value={from}
                aria-invalid={!!errors.from}
                onChange={(e) => setFrom(e.target.value)}
                className={`mt-1.5 ${errors.from ? "border-destructive" : ""}`}
              />
              {err(errors.from)}
            </div>
            <div>
              <Label htmlFor="to-date">End date</Label>
              <Input
                id="to-date"
                type="date"
                value={to}
                aria-invalid={!!errors.to}
                onChange={(e) => setTo(e.target.value)}
                className={`mt-1.5 ${errors.to ? "border-destructive" : ""}`}
              />
              {err(errors.to)}
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              rows={4}
              value={reason}
              aria-invalid={!!errors.reason}
              placeholder="Share a short context for your manager…"
              onChange={(e) => setReason(e.target.value)}
              className={`mt-1.5 resize-none ${errors.reason ? "border-destructive" : ""}`}
            />
            {err(errors.reason)}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
