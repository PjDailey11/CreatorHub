'use client'

import { useState, useCallback, useMemo, type DragEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
  X,
  AlertTriangle,
  Users,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Types & constants                                                  */
/* ------------------------------------------------------------------ */

type FieldKey =
  | 'subscriber_name'
  | 'subscriber_tier'
  | 'subscription_price'
  | 'total_spent'
  | 'last_engaged_at'
  | 'status'
  | '__skip__'

const FIELD_OPTIONS: { value: FieldKey; label: string }[] = [
  { value: 'subscriber_name', label: 'Subscriber name' },
  { value: 'subscriber_tier', label: 'Subscriber tier (standard|premium|vip)' },
  { value: 'subscription_price', label: 'Subscription price' },
  { value: 'total_spent', label: 'Total spent' },
  { value: 'last_engaged_at', label: 'Last engaged at' },
  { value: 'status', label: 'Status' },
  { value: '__skip__', label: 'Skip this column' },
]

/* ------------------------------------------------------------------ */
/* Mock parsed CSV                                                    */
/* ------------------------------------------------------------------ */

const MOCK_HEADERS = [
  'Name',
  'Tier',
  'Price',
  'Total Spent',
  'Last Active',
  'Status',
  'Notes',
]

const MOCK_ROWS: string[][] = [
  ['Sophia Martinez', 'premium', '24.99', '312.40', '2026-04-22', 'active', 'VIP since 2024'],
  ['Liam Chen', 'standard', '9.99', '89.91', '2026-04-19', 'active', ''],
  ['Olivia Patel', 'vip', '49.99', '1499.70', '2026-04-25', 'active', 'Top spender'],
  ['Noah Williams', 'premium', 'twenty', '210.00', '2026-03-01', 'paused', 'Bad price'],
  ['Emma Johnson', 'gold', '14.99', '149.90', '2026-02-14', 'active', 'Bad tier value'],
  ['Mason Davis', 'standard', '9.99', '49.95', 'not-a-date', 'churned', 'Bad date'],
  ['Ava Garcia', 'premium', '24.99', '524.79', '2026-04-10', 'active', ''],
  ['Lucas Rodriguez', 'standard', '9.99', '29.97', '2026-01-08', 'pending', 'Bad status'],
  ['Mia Hernandez', 'vip', '49.99', '999.80', '2026-04-21', 'active', ''],
  ['Ethan Brown', 'premium', '24.99', '', '2026-04-12', 'active', 'Missing total'],
  ['Isabella Lee', 'standard', '9.99', '119.88', '2026-04-18', 'active', ''],
  ['', 'premium', '24.99', '74.97', '2026-04-15', 'active', 'Missing name'],
]

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function autoDetectField(header: string): FieldKey {
  const h = header.toLowerCase().trim()
  if (/(^|\W)(name|subscriber)(\W|$)/.test(h)) return 'subscriber_name'
  if (h.includes('tier') || h.includes('plan') || h.includes('level')) return 'subscriber_tier'
  if (h.includes('total') || h.includes('spent') || h.includes('lifetime') || h.includes('ltv'))
    return 'total_spent'
  if (h.includes('price') || h.includes('amount') || h.includes('cost')) return 'subscription_price'
  if (h.includes('last') || h.includes('engaged') || h.includes('active') || h.includes('seen'))
    return 'last_engaged_at'
  if (h.includes('status') || h.includes('state')) return 'status'
  return '__skip__'
}

type RowIssue = {
  rowIndex: number // 0-based index into MOCK_ROWS
  rowNumber: number // human-friendly (1-based, accounting for header)
  severity: 'warning' | 'skip'
  messages: string[]
}

function validateRows(
  rows: string[][],
  mapping: Record<number, FieldKey>,
): { valid: number; warnings: RowIssue[]; skipped: RowIssue[] } {
  const warnings: RowIssue[] = []
  const skipped: RowIssue[] = []
  let valid = 0

  rows.forEach((row, idx) => {
    const messages: string[] = []
    let hasCritical = false

    // Check required: subscriber_name
    const nameColIndex = Object.entries(mapping).find(([, v]) => v === 'subscriber_name')?.[0]
    if (nameColIndex !== undefined) {
      if (!row[Number(nameColIndex)]?.trim()) {
        messages.push('subscriber_name is required')
        hasCritical = true
      }
    } else {
      // No mapping at all for name -> skipped at row level (per row)
      messages.push('No column mapped to subscriber_name')
      hasCritical = true
    }

    Object.entries(mapping).forEach(([colIdxStr, field]) => {
      const colIdx = Number(colIdxStr)
      const value = row[colIdx]?.trim() ?? ''
      if (!value || field === '__skip__') return

      switch (field) {
        case 'subscription_price':
        case 'total_spent': {
          const num = Number(value)
          if (Number.isNaN(num)) {
            messages.push(`${field} must be numeric (got "${value}")`)
          }
          break
        }
        case 'subscriber_tier': {
          if (!['standard', 'premium', 'vip'].includes(value.toLowerCase())) {
            messages.push(`subscriber_tier must be standard, premium, or vip (got "${value}")`)
          }
          break
        }
        case 'status': {
          if (!['active', 'paused', 'churned'].includes(value.toLowerCase())) {
            messages.push(`status must be active, paused, or churned (got "${value}")`)
          }
          break
        }
        case 'last_engaged_at': {
          const ts = Date.parse(value)
          if (Number.isNaN(ts)) {
            messages.push(`last_engaged_at must be a valid date (got "${value}")`)
          }
          break
        }
        default:
          break
      }
    })

    const issue: RowIssue = {
      rowIndex: idx,
      rowNumber: idx + 2, // +1 for 1-based, +1 for header row
      severity: hasCritical ? 'skip' : 'warning',
      messages,
    }

    if (hasCritical) {
      skipped.push(issue)
    } else if (messages.length > 0) {
      warnings.push(issue)
    } else {
      valid += 1
    }
  })

  return { valid, warnings, skipped }
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function ImportSubscribersPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Mapping: column index -> field key
  const [mapping, setMapping] = useState<Record<number, FieldKey>>(() =>
    MOCK_HEADERS.reduce((acc, header, idx) => {
      acc[idx] = autoDetectField(header)
      return acc
    }, {} as Record<number, FieldKey>),
  )

  /* ------------------------------ File ------------------------------ */

  const handleFile = useCallback((f: File) => {
    setFileError(null)
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setFileError('Please upload a .csv file')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError('File too large (max 10MB)')
      return
    }
    setFile(f)
  }, [])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const removeFile = () => {
    setFile(null)
    setFileError(null)
  }

  /* ----------------------------- Mapping ---------------------------- */

  const updateMapping = (colIdx: number, value: FieldKey) => {
    setMapping((prev) => ({ ...prev, [colIdx]: value }))
  }

  // Per-column inline validation hint (from preview rows)
  const columnHints = useMemo(() => {
    const hints: Record<number, string | null> = {}
    MOCK_HEADERS.forEach((_, colIdx) => {
      const field = mapping[colIdx]
      if (!field || field === '__skip__') {
        hints[colIdx] = null
        return
      }
      const sample = MOCK_ROWS.slice(0, 5)
        .map((r) => r[colIdx])
        .filter((v) => v && v.trim() !== '')

      switch (field) {
        case 'subscription_price':
        case 'total_spent':
          if (sample.some((v) => Number.isNaN(Number(v)))) {
            hints[colIdx] = `${field} must be numeric`
          } else hints[colIdx] = null
          break
        case 'subscriber_tier':
          if (sample.some((v) => !['standard', 'premium', 'vip'].includes(v.toLowerCase()))) {
            hints[colIdx] = 'must be standard, premium, or vip'
          } else hints[colIdx] = null
          break
        case 'status':
          if (sample.some((v) => !['active', 'paused', 'churned'].includes(v.toLowerCase()))) {
            hints[colIdx] = 'must be active, paused, or churned'
          } else hints[colIdx] = null
          break
        case 'last_engaged_at':
          if (sample.some((v) => Number.isNaN(Date.parse(v)))) {
            hints[colIdx] = 'must be a valid date'
          } else hints[colIdx] = null
          break
        default:
          hints[colIdx] = null
      }
    })
    return hints
  }, [mapping])

  // Detect duplicate field mappings (same field used for >1 column)
  const duplicateFields = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.values(mapping).forEach((f) => {
      if (f !== '__skip__') counts[f] = (counts[f] ?? 0) + 1
    })
    return new Set(Object.keys(counts).filter((k) => counts[k] > 1))
  }, [mapping])

  /* ----------------------------- Review ----------------------------- */

  const stats = useMemo(() => validateRows(MOCK_ROWS, mapping), [mapping])

  const canContinueFromStep2 = useMemo(() => {
    return Object.values(mapping).some((f) => f === 'subscriber_name')
  }, [mapping])

  /* ----------------------------- Render ----------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/subscribers"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to subscribers
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Import subscribers</h1>
          <p className="text-muted-foreground">
            Upload a CSV, map your columns, and bring your audience into CreatorHub.
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <StepProgress current={step} />

      {/* Step content */}
      {step === 1 && (
        <UploadStep
          file={file}
          fileError={fileError}
          isDragging={isDragging}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onFileInput={onFileInput}
          onRemove={removeFile}
        />
      )}

      {step === 2 && (
        <MapStep
          headers={MOCK_HEADERS}
          rows={MOCK_ROWS.slice(0, 5)}
          mapping={mapping}
          onChangeMapping={updateMapping}
          columnHints={columnHints}
          duplicateFields={duplicateFields}
          canContinue={canContinueFromStep2}
        />
      )}

      {step === 3 && (
        <ReviewStep
          totalRows={MOCK_ROWS.length}
          stats={stats}
          headers={MOCK_HEADERS}
        />
      )}

      {/* Footer nav */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/subscribers')}
        >
          Cancel
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {step < 3 && (
            <Button
              disabled={
                (step === 1 && !file) || (step === 2 && !canContinueFromStep2)
              }
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 3 && (
            <Button
              onClick={() => {
                // Mock import — just navigate back.
                router.push('/subscribers')
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Import {stats.valid + stats.warnings.length} subscribers
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Step progress indicator                                            */
/* ------------------------------------------------------------------ */

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Upload' },
    { n: 2, label: 'Map columns' },
    { n: 3, label: 'Review & confirm' },
  ]

  return (
    <Card className="border-border/60 bg-card/40">
      <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Step {current} of 3</span>
          <span className="text-foreground">·</span>
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-semibold">
            {steps[current - 1].label}
          </span>
        </div>

        <ol className="flex items-center gap-2 sm:gap-4">
          {steps.map((s, i) => {
            const isActive = s.n === current
            const isComplete = s.n < current
            return (
              <li key={s.n} className="flex items-center gap-2 sm:gap-4">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                    isActive &&
                      'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm shadow-pink-500/20',
                    isComplete && 'bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/40',
                    !isActive && !isComplete && 'bg-muted text-muted-foreground',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:inline',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      'hidden h-px w-8 sm:inline-block',
                      isComplete ? 'bg-pink-500/40' : 'bg-border',
                    )}
                    aria-hidden
                  />
                )}
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Step 1: Upload                                                     */
/* ------------------------------------------------------------------ */

function UploadStep({
  file,
  fileError,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileInput,
  onRemove,
}: {
  file: File | null
  fileError: string | null
  isDragging: boolean
  onDragEnter: () => void
  onDragLeave: () => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload your CSV</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag & drop a CSV file, or click to browse. Max file size 10MB.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <label
          htmlFor="csv-upload"
          onDragEnter={(e) => {
            e.preventDefault()
            onDragEnter()
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            e.preventDefault()
            onDragLeave()
          }}
          onDrop={onDrop}
          className={cn(
            'relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all',
            'border-border bg-muted/20 hover:border-pink-500/50 hover:bg-muted/40',
            isDragging && 'border-pink-500 bg-pink-500/5',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 ring-1 ring-pink-500/30">
            <Upload className="h-5 w-5 text-pink-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">CSV up to 10MB</p>
          </div>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={onFileInput}
          />
        </label>

        {fileError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>{fileError}</span>
          </div>
        )}

        {file && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-pink-500/20 to-purple-600/20">
                <FileText className="h-4 w-4 text-pink-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Step 2: Map columns                                                */
/* ------------------------------------------------------------------ */

function MapStep({
  headers,
  rows,
  mapping,
  onChangeMapping,
  columnHints,
  duplicateFields,
  canContinue,
}: {
  headers: string[]
  rows: string[][]
  mapping: Record<number, FieldKey>
  onChangeMapping: (colIdx: number, value: FieldKey) => void
  columnHints: Record<number, string | null>
  duplicateFields: Set<string>
  canContinue: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map your columns</CardTitle>
        <p className="text-sm text-muted-foreground">
          We auto-matched columns by header name. Review each mapping below.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canContinue && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>
              Map one column to <strong>subscriber_name</strong> to continue.
            </span>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border">
                {headers.map((header, idx) => {
                  const field = mapping[idx] ?? '__skip__'
                  const hint = columnHints[idx]
                  const isDuplicate =
                    field !== '__skip__' && duplicateFields.has(field)
                  return (
                    <th
                      key={`${header}-${idx}`}
                      className="min-w-[220px] p-3 text-left align-top"
                    >
                      <div className="space-y-2">
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {header}
                        </div>
                        <Select
                          value={field}
                          onValueChange={(v) => onChangeMapping(idx, v as FieldKey)}
                        >
                          <SelectTrigger
                            size="sm"
                            className={cn(
                              'w-full',
                              (hint || isDuplicate) &&
                                'border-amber-500/60 ring-1 ring-amber-500/30',
                              field === '__skip__' && 'text-muted-foreground',
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hint && (
                          <p className="flex items-start gap-1 text-xs text-amber-300">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{hint}</span>
                          </p>
                        )}
                        {isDuplicate && !hint && (
                          <p className="flex items-start gap-1 text-xs text-amber-300">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>Duplicate mapping — only one will be used.</span>
                          </p>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  {headers.map((_, idx) => (
                    <td
                      key={idx}
                      className="max-w-[260px] truncate p-3 align-top text-sm text-muted-foreground"
                      title={row[idx]}
                    >
                      {row[idx] || <span className="opacity-40">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing the first {rows.length} rows of your file as a preview.
        </p>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Step 3: Review                                                     */
/* ------------------------------------------------------------------ */

function ReviewStep({
  totalRows,
  stats,
  headers,
}: {
  totalRows: number
  stats: { valid: number; warnings: RowIssue[]; skipped: RowIssue[] }
  headers: string[]
}) {
  const [warningsOpen, setWarningsOpen] = useState(true)
  const [skippedOpen, setSkippedOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="h-4 w-4 text-white" />}
          label="Valid rows"
          value={stats.valid}
          gradient="from-pink-500 to-purple-600"
          subtitle="Ready to import"
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4 text-white" />}
          label="Rows with warnings"
          value={stats.warnings.length}
          gradient="from-amber-500 to-orange-500"
          subtitle="Will import with notes"
        />
        <StatCard
          icon={<XCircle className="h-4 w-4 text-white" />}
          label="Rows skipped"
          value={stats.skipped.length}
          gradient="from-zinc-500 to-zinc-700"
          subtitle="Will not be imported"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review &amp; confirm</CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalRows} total rows parsed from your CSV. Headers detected:{' '}
            <span className="font-mono text-xs text-foreground/80">{headers.join(', ')}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <IssueList
            title={`Warnings (${stats.warnings.length})`}
            tone="warning"
            issues={stats.warnings}
            open={warningsOpen}
            onToggle={() => setWarningsOpen((o) => !o)}
            emptyText="No warnings — all mapped rows look clean."
          />
          <IssueList
            title={`Skipped rows (${stats.skipped.length})`}
            tone="skip"
            issues={stats.skipped}
            open={skippedOpen}
            onToggle={() => setSkippedOpen((o) => !o)}
            emptyText="No rows will be skipped."
          />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  gradient,
  subtitle,
}: {
  icon: React.ReactNode
  label: string
  value: number
  gradient: string
  subtitle: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
            gradient,
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function IssueList({
  title,
  tone,
  issues,
  open,
  onToggle,
  emptyText,
}: {
  title: string
  tone: 'warning' | 'skip'
  issues: RowIssue[]
  open: boolean
  onToggle: () => void
  emptyText: string
}) {
  const Icon = tone === 'warning' ? AlertTriangle : XCircle
  const accent =
    tone === 'warning'
      ? 'text-amber-400'
      : 'text-zinc-400'

  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        {emptyText}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 bg-muted/30 px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', accent)} />
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <ul className="divide-y divide-border bg-card/30">
          {issues.map((issue) => (
            <li key={issue.rowIndex} className="px-3 py-2.5 text-sm">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-xs font-medium',
                    tone === 'warning'
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-zinc-500/15 text-zinc-300',
                  )}
                >
                  Row {issue.rowNumber}
                </span>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {issue.messages.map((m, i) => (
                    <li key={i}>· {m}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
