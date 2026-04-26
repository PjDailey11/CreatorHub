"use client"

import * as React from "react"
import {
  Sparkles,
  Plus,
  Paperclip,
  ArrowUp,
  ChevronDown,
  Check,
  Wrench,
  MessageSquare,
  PanelLeft,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type ToolCall = {
  name: string
  status: "completed" | "running" | "error"
  parameters: Record<string, unknown>
  result: Record<string, unknown>
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: React.ReactNode
  toolCall?: ToolCall
}

type Conversation = {
  id: string
  title: string
  preview: string
  timestamp: string
  unread: boolean
  messages: Message[]
}

const SUGGESTIONS = [
  "Why did churn spike this week?",
  "Draft a re-engagement DM for VIP fans",
  "Suggest PPV prices for inactive fans",
  "Plan this week's content schedule",
]

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Subscriber churn analysis",
    preview: "Looks like the spike on Tuesday came from expired card payments…",
    timestamp: "2m",
    unread: true,
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Why did churn spike this week? Break it down by tier.",
      },
      {
        id: "m2",
        role: "assistant",
        toolCall: {
          name: "getSubscriberStats",
          status: "completed",
          parameters: {
            range: "last_7_days",
            group_by: "tier",
            include_churn_reasons: true,
          },
          result: {
            standard: { active: 1842, churned: 47, churn_rate: "2.5%" },
            premium: { active: 612, churned: 9, churn_rate: "1.5%" },
            vip: { active: 184, churned: 11, churn_rate: "5.6%" },
            top_reason: "expired_payment_method",
          },
        },
        content: (
          <div className="space-y-3 text-sm leading-relaxed text-zinc-200">
            <p>
              Churn jumped <strong className="font-semibold text-zinc-50">3.1x</strong> over the
              prior week, concentrated in your <strong className="font-semibold text-zinc-50">VIP</strong>{" "}
              tier. Here&apos;s what stood out:
            </p>
            <h3 className="pt-1 text-base font-semibold text-zinc-50">Top drivers</h3>
            <ul className="list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                <strong className="font-semibold text-zinc-100">62%</strong> of churn was{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-pink-300">
                  expired_payment_method
                </code>{" "}
                — mostly cards issued in 2022.
              </li>
              <li>VIP renewal email open-rate dropped to 18% (down from 41% last month).</li>
              <li>11 VIPs churned within 48h of a price test on the upgrade flow.</li>
            </ul>
            <h3 className="pt-1 text-base font-semibold text-zinc-50">Recommended next steps</h3>
            <ol className="list-decimal space-y-1 pl-5 text-zinc-300">
              <li>Trigger a card-update reminder to all VIPs with expiring cards in 30 days.</li>
              <li>Roll back the upgrade-flow price test for VIP cohort.</li>
              <li>Send a personalized re-engagement DM to the 11 recent churners.</li>
            </ol>
            <p className="text-zinc-400">
              Want me to draft the re-engagement DM, or pull the list of at-risk VIPs?
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "c2",
    title: "VIP re-engagement DM",
    preview: "Here are three variants tuned for warm/cold/dormant cohorts…",
    timestamp: "1h",
    unread: false,
    messages: [],
  },
  {
    id: "c3",
    title: "PPV pricing for dormant fans",
    preview: "I&apos;d suggest a $9 unlock for the 30–60 day inactive segment.",
    timestamp: "Yesterday",
    unread: false,
    messages: [],
  },
  {
    id: "c4",
    title: "Content calendar — week of Apr 27",
    preview: "Three pillar posts, two PPV drops, one live stream on Friday.",
    timestamp: "3d",
    unread: false,
    messages: [],
  },
]

function formatJsonValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`
  if (value === null) return "null"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function ToolCallCard({ toolCall }: { toolCall: ToolCall }) {
  const [open, setOpen] = React.useState(false)
  const statusStyles: Record<ToolCall["status"], string> = {
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    running: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    error: "bg-red-500/15 text-red-300 border-red-500/30",
  }
  const statusLabel: Record<ToolCall["status"], string> = {
    completed: "Completed",
    running: "Running",
    error: "Error",
  }

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/60 py-0 gap-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/40"
        aria-expanded={open}
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-pink-500/20 to-purple-500/20 ring-1 ring-inset ring-pink-500/30">
          <Wrench className="size-4 text-pink-300" />
        </span>
        <div className="flex flex-1 items-center gap-2">
          <span className="font-mono text-sm font-medium text-zinc-100">{toolCall.name}</span>
          <Badge
            variant="outline"
            className={cn("gap-1 border", statusStyles[toolCall.status])}
          >
            <Check className="size-3" />
            {statusLabel[toolCall.status]}
          </Badge>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-zinc-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950/40">
          <div className="px-4 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Parameters
            </p>
            <div className="space-y-1 font-mono text-xs">
              {Object.entries(toolCall.parameters).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-purple-300">{k}</span>
                  <span className="text-zinc-500">:</span>
                  <span className="text-pink-300">{formatJsonValue(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-zinc-800" />
          <div className="px-4 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Result preview
            </p>
            <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300 ring-1 ring-inset ring-zinc-800">
              {JSON.stringify(toolCall.result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  )
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-pink-500 to-purple-600 px-4 py-2.5 text-sm text-white shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 ring-1 ring-inset ring-pink-500/30">
        <Sparkles className="size-4 text-pink-300" />
      </span>
      <div className="flex-1 space-y-3 overflow-hidden">
        {message.toolCall && <ToolCallCard toolCall={message.toolCall} />}
        <div className="text-sm">{message.content}</div>
      </div>
    </div>
  )
}

function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 ring-1 ring-inset ring-pink-500/30">
        <Sparkles className="size-8 text-pink-300" />
      </div>
      <h1 className="mt-6 text-balance text-center text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        Ask your CreatorHub agent anything
      </h1>
      <p className="mt-2 max-w-md text-pretty text-center text-sm text-zinc-400">
        I can analyze subscribers, draft DMs, optimize PPV pricing, and plan content.
      </p>
      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick(s)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left text-sm text-zinc-300 transition-all hover:border-pink-500/40 hover:bg-zinc-900/80 hover:text-zinc-50"
          >
            <MessageSquare className="size-4 shrink-0 text-zinc-500 group-hover:text-pink-300" />
            <span className="flex-1 text-pretty">{s}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Composer({
  onSend,
}: {
  onSend: (text: string) => void
}) {
  const [value, setValue] = React.useState("")
  const taRef = React.useRef<HTMLTextAreaElement>(null)
  const hasText = value.trim().length > 0

  React.useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
  }, [value])

  function submit() {
    if (!hasText) return
    onSend(value.trim())
    setValue("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-sm focus-within:border-pink-500/40 focus-within:ring-2 focus-within:ring-pink-500/20">
          <Textarea
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Message your CreatorHub agent…"
            className="max-h-[200px] min-h-[52px] resize-none border-0 bg-transparent px-4 py-3.5 pr-24 text-sm text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Attach file"
            >
              <Paperclip className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={submit}
              disabled={!hasText}
              aria-label="Send message"
              className={cn(
                "size-9 rounded-lg transition-all",
                hasText
                  ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm hover:from-pink-600 hover:to-purple-700"
                  : "bg-zinc-800 text-zinc-500 hover:bg-zinc-800"
              )}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 px-1 text-center text-xs text-zinc-500">
          Claude can analyze your data and take actions. Verify important changes.
        </p>
      </div>
    </div>
  )
}

function ConversationListItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors",
        active
          ? "bg-zinc-800/80 text-zinc-50"
          : "text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 truncate text-sm font-medium">
          {conversation.title}
        </span>
        <span className="shrink-0 text-[11px] text-zinc-500">
          {conversation.timestamp}
        </span>
        {conversation.unread && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-500"
            aria-label="Unread"
          />
        )}
      </div>
      <p className="line-clamp-1 text-xs text-zinc-500 group-hover:text-zinc-400">
        {conversation.preview}
      </p>
    </button>
  )
}

function LeftRail({
  conversations,
  activeId,
  onSelect,
  onNew,
}: {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 md:flex">
      <div className="p-3">
        <Button
          type="button"
          onClick={onNew}
          className="w-full justify-start gap-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="size-4" />
          New conversation
        </Button>
      </div>
      <Separator className="bg-zinc-800" />
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Recent
          </p>
          {conversations.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              active={c.id === activeId}
              onClick={() => onSelect(c.id)}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="p-3">
        <Card className="border-zinc-800 bg-gradient-to-br from-pink-500/5 to-purple-500/10 py-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-pink-500/20 to-purple-500/20 ring-1 ring-inset ring-pink-500/30">
              <Sparkles className="size-3.5 text-pink-300" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-200">
                Powered by Claude
              </p>
              <p className="truncate text-[11px] text-zinc-500">
                Sonnet 4.5 • CreatorHub tools
              </p>
            </div>
          </div>
        </Card>
      </div>
    </aside>
  )
}

function ChatHeader({
  title,
  onToggleSidebar,
}: {
  title: string
  onToggleSidebar?: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
        onClick={onToggleSidebar}
        aria-label="Toggle conversations"
      >
        <PanelLeft className="size-4" />
      </Button>
      <h2 className="truncate text-sm font-medium text-zinc-200">{title}</h2>
    </header>
  )
}

export default function AgentPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(
    INITIAL_CONVERSATIONS
  )
  const [activeId, setActiveId] = React.useState<string | null>("c1")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId) ?? null
  const messages = active?.messages ?? []
  const showEmpty = messages.length === 0

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [activeId, messages.length])

  function appendUserMessage(text: string) {
    if (!activeId) {
      const id = `c-${Date.now()}`
      const newConv: Conversation = {
        id,
        title: text.slice(0, 40) || "New conversation",
        preview: text,
        timestamp: "now",
        unread: false,
        messages: [
          { id: `m-${Date.now()}`, role: "user", content: text },
        ],
      }
      setConversations((prev) => [newConv, ...prev])
      setActiveId(id)
      return
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              preview: text,
              timestamp: "now",
              messages: [
                ...c.messages,
                { id: `m-${Date.now()}`, role: "user", content: text },
              ],
            }
          : c
      )
    )
  }

  function handleNewConversation() {
    const id = `c-${Date.now()}`
    const newConv: Conversation = {
      id,
      title: "New conversation",
      preview: "Start a new chat",
      timestamp: "now",
      unread: false,
      messages: [],
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveId(id)
  }

  return (
    <div className="dark">
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-100">
        <LeftRail
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNewConversation}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          <ChatHeader title={active?.title ?? "New conversation"} />
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {showEmpty ? (
              <EmptyState onSuggestionClick={appendUserMessage} />
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </div>
            )}
          </div>
          <Composer onSend={appendUserMessage} />
        </main>
      </div>
    </div>
  )
}
