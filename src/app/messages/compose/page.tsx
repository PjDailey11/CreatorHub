"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  ImagePlus,
  Paperclip,
  Save,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

// ---------- Mock data ----------

type Tier = "standard" | "premium" | "vip"
type Status = "active" | "paused" | "churned"

interface Fan {
  id: string
  firstName: string
  fullName: string
  tier: Tier
  status: Status
  lastActiveDays: number
  totalSpent: number
}

const FIRST_NAMES = [
  "Sarah",
  "Emma",
  "Olivia",
  "Mia",
  "Ava",
  "Liam",
  "Noah",
  "Ethan",
  "Lucas",
  "Jack",
  "Chloe",
  "Zoe",
  "Maya",
  "Ruby",
  "Lily",
  "Owen",
  "Leo",
  "Finn",
  "Hugo",
  "Mason",
]
const LAST_NAMES = [
  "Carter",
  "Reed",
  "Brooks",
  "Hayes",
  "Quinn",
  "Wells",
  "Foster",
  "Knox",
  "Lane",
  "Page",
]

function generateFans(): Fan[] {
  const fans: Fan[] = []
  // Deterministic pseudo-random so the live count is stable across renders
  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < 500; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const tierRoll = rand()
    const tier: Tier =
      tierRoll < 0.55 ? "standard" : tierRoll < 0.85 ? "premium" : "vip"
    const statusRoll = rand()
    const status: Status =
      statusRoll < 0.7 ? "active" : statusRoll < 0.9 ? "paused" : "churned"
    fans.push({
      id: `fan-${i}`,
      firstName: first,
      fullName: `${first} ${last}`,
      tier,
      status,
      lastActiveDays: Math.floor(rand() * 90),
      totalSpent: Math.floor(rand() * 5000),
    })
  }
  return fans
}

const ALL_FANS = generateFans()

// ---------- Helpers ----------

const TIER_LABELS: Record<Tier, string> = {
  standard: "Standard",
  premium: "Premium",
  vip: "VIP",
}

const STATUS_LABELS: Record<Status, string> = {
  active: "Active",
  paused: "Paused",
  churned: "Churned",
}

const VARIABLES = [
  { token: "{{name}}", label: "Name" },
  { token: "{{first_name}}", label: "First name" },
  { token: "{{tier}}", label: "Tier" },
  { token: "{{last_active}}", label: "Last active" },
] as const

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US")}`
}

function lastActiveLabel(days: number) {
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 14) return "last week"
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function resolveVariables(
  body: string,
  fan: Pick<Fan, "fullName" | "firstName" | "tier" | "lastActiveDays">
) {
  return body
    .replaceAll("{{name}}", fan.fullName)
    .replaceAll("{{first_name}}", fan.firstName)
    .replaceAll("{{tier}}", TIER_LABELS[fan.tier])
    .replaceAll("{{last_active}}", lastActiveLabel(fan.lastActiveDays))
}

// ---------- Page ----------

export default function ComposePage() {
  // Audience filters
  const [selectedTiers, setSelectedTiers] = React.useState<Tier[]>([
    "standard",
    "premium",
    "vip",
  ])
  const [lastActiveRange, setLastActiveRange] = React.useState<[number, number]>([
    0, 90,
  ])
  const [spendRange, setSpendRange] = React.useState<[number, number]>([0, 5000])
  const [selectedStatuses, setSelectedStatuses] = React.useState<Status[]>([
    "active",
  ])

  // Compose state
  const [body, setBody] = React.useState(
    "Hey {{first_name}}, I just dropped something exclusive for my {{tier}} fans — wanted to make sure you saw it first."
  )
  const [ppvEnabled, setPpvEnabled] = React.useState(false)
  const [ppvPrice, setPpvPrice] = React.useState(15)
  const [timing, setTiming] = React.useState<"now" | "schedule">("now")
  const [scheduleDate, setScheduleDate] = React.useState("")
  const [scheduleTime, setScheduleTime] = React.useState("")
  const [attachment, setAttachment] = React.useState<{
    name: string
    type: string
  } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Derived: matched fan count
  const matchedCount = React.useMemo(() => {
    return ALL_FANS.filter((fan) => {
      if (!selectedTiers.includes(fan.tier)) return false
      if (!selectedStatuses.includes(fan.status)) return false
      if (
        fan.lastActiveDays < lastActiveRange[0] ||
        fan.lastActiveDays > lastActiveRange[1]
      )
        return false
      if (fan.totalSpent < spendRange[0] || fan.totalSpent > spendRange[1])
        return false
      return true
    }).length
  }, [selectedTiers, lastActiveRange, spendRange, selectedStatuses])

  // Sample fan for preview (first one matching filters, fall back to a default)
  const previewFan = React.useMemo<Fan>(() => {
    const match = ALL_FANS.find(
      (f) =>
        selectedTiers.includes(f.tier) && selectedStatuses.includes(f.status)
    )
    return (
      match ?? {
        id: "preview",
        firstName: "Sarah",
        fullName: "Sarah Carter",
        tier: "premium",
        status: "active",
        lastActiveDays: 2,
        totalSpent: 480,
      }
    )
  }, [selectedTiers, selectedStatuses])

  const toggleTier = (tier: Tier, checked: boolean) => {
    setSelectedTiers((prev) =>
      checked ? [...prev, tier] : prev.filter((t) => t !== tier)
    )
  }

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const insertVariable = (token: string) => {
    const ta = textareaRef.current
    if (!ta) {
      setBody((b) => b + token)
      return
    }
    const start = ta.selectionStart ?? body.length
    const end = ta.selectionEnd ?? body.length
    const next = body.slice(0, start) + token + body.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + token.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachment({ name: file.name, type: file.type })
  }

  const resolvedBody = resolveVariables(body, previewFan)

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div>
              <div className="text-sm font-semibold">Compose message</div>
              <div className="text-xs text-muted-foreground">
                Mass DM to filtered fans
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 bg-pink-500/10 text-pink-300 hover:bg-pink-500/15 border-pink-500/20"
            >
              <Users className="size-3.5" />
              {matchedCount.toLocaleString()} matched
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* LEFT: Audience */}
        <aside className="lg:w-[320px] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-border/60">
          <div className="sticky top-14">
            <ScrollArea className="lg:h-[calc(100vh-3.5rem)]">
              <div className="p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Audience</h2>
                    <p className="text-xs text-muted-foreground">
                      Filter who receives this message
                    </p>
                  </div>
                </div>

                {/* Live count */}
                <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                  <CardContent className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-sm shadow-pink-500/30">
                        <Users className="size-4" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Matched
                        </div>
                        <div className="text-xl font-semibold leading-none">
                          {matchedCount.toLocaleString()}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            fans
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tier */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Subscription tier
                  </Label>
                  <div className="space-y-2.5">
                    {(Object.keys(TIER_LABELS) as Tier[]).map((tier) => (
                      <label
                        key={tier}
                        className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm hover:border-border cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTiers.includes(tier)}
                          onCheckedChange={(c) =>
                            toggleTier(tier, c === true)
                          }
                        />
                        <span className="flex-1">{TIER_LABELS[tier]}</span>
                        <span className="text-xs text-muted-foreground">
                          {
                            ALL_FANS.filter((f) => f.tier === tier).length
                          }
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Last active */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Last active
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {lastActiveRange[0]}–{lastActiveRange[1]} days
                    </span>
                  </div>
                  <Slider
                    value={lastActiveRange}
                    onValueChange={(v) =>
                      setLastActiveRange([v[0], v[1]] as [number, number])
                    }
                    min={0}
                    max={90}
                    step={1}
                    minStepsBetweenThumbs={1}
                  />
                </div>

                {/* Total spent */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total spent
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(spendRange[0])}–
                      {formatCurrency(spendRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={spendRange}
                    onValueChange={(v) =>
                      setSpendRange([v[0], v[1]] as [number, number])
                    }
                    min={0}
                    max={5000}
                    step={25}
                    minStepsBetweenThumbs={1}
                  />
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Status
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS_LABELS) as Status[]).map((status) => {
                      const active = selectedStatuses.includes(status)
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(status)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                            active
                              ? "border-pink-500/40 bg-pink-500/15 text-pink-200"
                              : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border"
                          )}
                        >
                          {active && <Check className="size-3" />}
                          {STATUS_LABELS[status]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setSelectedTiers(["standard", "premium", "vip"])
                    setLastActiveRange([0, 90])
                    setSpendRange([0, 5000])
                    setSelectedStatuses(["active"])
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* CENTER: Compose */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-3xl p-5 space-y-5">
            {/* From */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                From
              </Label>
              <Select defaultValue="creator-1">
                <SelectTrigger className="h-12 bg-card/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator-1">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarImage src="/placeholder-user.jpg" alt="" />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-xs text-white">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium leading-none">
                          @ashleystar
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          Main profile
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="creator-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-purple-500/30 text-xs">
                          VL
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium leading-none">
                          @ashley.vip
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          VIP-only profile
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Variables */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Insert variable
              </Label>
              <div className="flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => insertVariable(v.token)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-pink-500/40 hover:text-pink-200"
                  >
                    <span className="text-pink-400">{"{{"}</span>
                    {v.token.replace(/[{}]/g, "")}
                    <span className="text-pink-400">{"}}"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Message
                </Label>
                <span className="text-xs text-muted-foreground">
                  {body.length} characters
                </span>
              </div>
              <Textarea
                ref={textareaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message…"
                className="min-h-[180px] resize-y bg-card/40 leading-relaxed"
              />
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Attachment
              </Label>
              {attachment ? (
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-gradient-to-br from-pink-500/30 to-purple-500/30">
                    <ImagePlus className="size-4 text-pink-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {attachment.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {attachment.type || "media"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttachment(null)}
                    aria-label="Remove attachment"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border/60 bg-card/20 px-4 py-5 text-left transition hover:border-pink-500/40 hover:bg-card/40"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-300">
                    <Paperclip className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Attach media</div>
                    <div className="text-xs text-muted-foreground">
                      Image or video. PPV pricing locks paid content.
                    </div>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleAttachment}
              />
            </div>

            {/* PPV */}
            <Card className="bg-card/40">
              <CardContent className="px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-md transition",
                        ppvEnabled
                          ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <DollarSign className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">PPV price</div>
                      <div className="text-xs text-muted-foreground">
                        Lock content behind a one-time payment
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={ppvEnabled}
                      onClick={() => setPpvEnabled((v) => !v)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition",
                        ppvEnabled
                          ? "bg-gradient-to-r from-pink-500 to-purple-500"
                          : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-5 translate-x-0.5 rounded-full bg-white shadow transition",
                          ppvEnabled && "translate-x-[22px]"
                        )}
                      />
                    </button>
                  </div>
                </div>
                {ppvEnabled && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min={0}
                        max={500}
                        value={ppvPrice}
                        onChange={(e) =>
                          setPpvPrice(
                            Math.min(
                              500,
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          )
                        }
                        className="h-7 border-0 bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0"
                      />
                      <span className="text-xs text-muted-foreground">USD</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Estimated take if 10% buy:{" "}
                      <span className="font-medium text-foreground">
                        {formatCurrency(
                          Math.round(matchedCount * 0.1 * ppvPrice)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Send timing */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Send timing
              </Label>
              <RadioGroup
                value={timing}
                onValueChange={(v) => setTiming(v as "now" | "schedule")}
                className="grid gap-2 sm:grid-cols-2"
              >
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-card/40 px-4 py-3 text-sm transition",
                    timing === "now"
                      ? "border-pink-500/40 bg-pink-500/5"
                      : "border-border/60 hover:border-border"
                  )}
                >
                  <RadioGroupItem value="now" />
                  <Send className="size-4 text-muted-foreground" />
                  <span>Send now</span>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-card/40 px-4 py-3 text-sm transition",
                    timing === "schedule"
                      ? "border-pink-500/40 bg-pink-500/5"
                      : "border-border/60 hover:border-border"
                  )}
                >
                  <RadioGroupItem value="schedule" />
                  <Clock className="size-4 text-muted-foreground" />
                  <span>Schedule</span>
                </label>
              </RadioGroup>
              {timing === "schedule" && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="bg-card/40"
                  />
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="bg-card/40"
                  />
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="sticky bottom-0 -mx-5 mt-6 border-t border-border/60 bg-background/90 px-5 py-3 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" size="lg" className="gap-2">
                  <Save className="size-4" />
                  Save draft
                </Button>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20 hover:from-pink-400 hover:to-purple-400"
                >
                  <Send className="size-4" />
                  {timing === "schedule" ? "Schedule" : "Send"} to{" "}
                  {matchedCount.toLocaleString()} fans
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: Preview */}
        <aside className="lg:w-[380px] lg:shrink-0 border-t lg:border-t-0 lg:border-l border-border/60">
          <div className="sticky top-14">
            <ScrollArea className="lg:h-[calc(100vh-3.5rem)]">
              <div className="p-5 space-y-5">
                <div>
                  <h2 className="text-sm font-semibold">Preview</h2>
                  <p className="text-xs text-muted-foreground">
                    How {previewFan.firstName} will see this message
                  </p>
                </div>

                {/* Phone frame */}
                <div className="relative mx-auto w-full max-w-[320px]">
                  <div className="rounded-[2.25rem] border border-border/60 bg-zinc-950 p-2 shadow-2xl shadow-pink-500/10">
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-zinc-900">
                      {/* Notch */}
                      <div className="flex h-7 items-center justify-center">
                        <div className="h-1.5 w-16 rounded-full bg-zinc-800" />
                      </div>
                      {/* Conversation header */}
                      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                        <Avatar className="size-9">
                          <AvatarImage src="/placeholder-user.jpg" alt="" />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-xs text-white">
                            AS
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            @ashleystar
                          </div>
                          <div className="text-[11px] text-emerald-400">
                            Active now
                          </div>
                        </div>
                        <ChevronDown className="ml-auto size-4 text-zinc-500" />
                      </div>
                      {/* Body */}
                      <div className="space-y-3 px-4 py-5">
                        <div className="flex justify-start">
                          <div className="max-w-[85%] space-y-2 rounded-2xl rounded-bl-md bg-zinc-800 px-3.5 py-2.5">
                            {attachment && (
                              <div
                                className={cn(
                                  "flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br",
                                  ppvEnabled
                                    ? "from-pink-500/30 to-purple-500/30"
                                    : "from-zinc-700 to-zinc-800"
                                )}
                              >
                                {ppvEnabled ? (
                                  <div className="text-center">
                                    <DollarSign className="mx-auto size-6 text-pink-300" />
                                    <div className="mt-1 text-xs font-semibold text-pink-100">
                                      Unlock for {formatCurrency(ppvPrice)}
                                    </div>
                                  </div>
                                ) : (
                                  <ImagePlus className="size-6 text-zinc-500" />
                                )}
                              </div>
                            )}
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100">
                              {resolvedBody || (
                                <span className="text-zinc-500">
                                  Your message will appear here…
                                </span>
                              )}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                              <Clock className="size-3" />
                              just now
                            </div>
                          </div>
                        </div>
                        {ppvEnabled && (
                          <div className="flex justify-start">
                            <button
                              type="button"
                              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow"
                            >
                              Unlock {formatCurrency(ppvPrice)}
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Reply box */}
                      <div className="flex items-center gap-2 border-t border-zinc-800 px-3 py-2.5">
                        <div className="flex-1 rounded-full bg-zinc-800 px-3 py-1.5 text-[11px] text-zinc-500">
                          Send a message…
                        </div>
                        <div className="size-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resolved variable summary */}
                <div className="rounded-lg border border-border/60 bg-card/40 p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Sample values
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <dt className="text-muted-foreground">{"{{first_name}}"}</dt>
                    <dd className="text-right font-medium">
                      {previewFan.firstName}
                    </dd>
                    <dt className="text-muted-foreground">{"{{name}}"}</dt>
                    <dd className="text-right font-medium">
                      {previewFan.fullName}
                    </dd>
                    <dt className="text-muted-foreground">{"{{tier}}"}</dt>
                    <dd className="text-right font-medium">
                      {TIER_LABELS[previewFan.tier]}
                    </dd>
                    <dt className="text-muted-foreground">
                      {"{{last_active}}"}
                    </dt>
                    <dd className="text-right font-medium">
                      {lastActiveLabel(previewFan.lastActiveDays)}
                    </dd>
                  </dl>
                </div>

                {/* AI variations */}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-100 hover:from-pink-500/20 hover:to-purple-500/20 hover:text-white"
                >
                  <Sparkles className="size-4 text-pink-300" />
                  Generate variations with AI
                </Button>
              </div>
            </ScrollArea>
          </div>
        </aside>
      </div>
    </div>
  )
}
