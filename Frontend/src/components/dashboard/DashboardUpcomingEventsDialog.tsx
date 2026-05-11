import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin, Building2 } from "lucide-react"

import { getAPI } from "@/apis/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Loader from "@/components/Loader"

type ApiEnvelope = {
  success?: boolean
  data?: { items?: unknown[] }
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function DashboardUpcomingEventsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    getAPI<ApiEnvelope>(`/notification/upcoming-events?page=1&limit=50`)
      .then((body) => {
        const list = body?.data?.items
        if (!cancelled && Array.isArray(list)) setItems(list as Record<string, unknown>[])
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) setItems([])
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[min(85vh,640px)] flex flex-col gap-0 p-0 overflow-hidden"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 shrink-0">
          <DialogTitle className="text-lg font-black tracking-tight">All upcoming events</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Up to 50 future schedules for your account (same list as your dashboard preview, expanded).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader text="Loading events…" size="sm" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm font-medium">
              <Calendar className="size-10 mx-auto mb-3 opacity-40" />
              No upcoming events found.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((event, idx) => {
                const id = (event.id as number | string | undefined) ?? `ev-${idx}`
                const title = String(event.title ?? "Untitled")
                const company = (event.company as { name?: string } | undefined)?.name
                const venue = String(event.venue ?? "—")
                const startTime = String(event.startTime ?? "")
                return (
                  <li
                    key={id}
                    className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm"
                  >
                    <p className="font-bold text-foreground leading-snug">{title}</p>
                    {company && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Building2 className="size-3.5 shrink-0 opacity-70" />
                        {company}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
                      <span className="inline-flex items-center gap-1 normal-case">
                        <Clock className="size-3.5" />
                        {startTime ? formatEventDate(startTime) : "—"}
                      </span>
                      <span className="inline-flex items-center gap-1 normal-case">
                        <MapPin className="size-3.5" />
                        {venue}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
