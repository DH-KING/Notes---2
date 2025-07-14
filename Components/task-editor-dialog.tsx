"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { v4 as uuidv4 } from "uuid"
import { XCircle } from "lucide-react"

/* ---------- types ---------- */
interface ChecklistItem {
  id: string
  text: string
  isCompleted: boolean
  emoji?: string
}

interface Task {
  id: string
  title: string
  content: string
  isCompleted: boolean
  isPinned: boolean
  createdAt: number
  backgroundColor?: string
  type: "text" | "checklist"
  checklistItems?: ChecklistItem[]
  emoji?: string
  folderId?: string // New property for folder association
}

interface FolderType {
  id: string
  name: string
}

interface TaskEditorDialogProps {
  task: Task | null
  onSave: (task: Task, isAutoSave?: boolean) => void
  onClose: () => void
  autoSaveEnabled: boolean
  fontSizeClass: string
  folders: FolderType[] // Pass folders to editor
}

/* ---------- helpers ---------- */
const solidColors = [
  { name: "أصفر", hex: "#FFFDE7" },
  { name: "أزرق", hex: "#E8F0FE" },
  { name: "أخضر", hex: "#E6F4EA" },
  { name: "وردي", hex: "#FCE8F6" },
  { name: "بنفسجي", hex: "#F3E8FD" },
  { name: "رمادي", hex: "#E8EAED" },
  { name: "أبيض", hex: "#FFFFFF" },
  { name: "أخضر فاتح", hex: "#DCE8D8" },
  { name: "أزرق فاتح", hex: "#D8E8F8" },
  { name: "بنفسجي فاتح", hex: "#E8D8F8" },
  { name: "خوخي", hex: "#FFEDD5" },
  { name: "تركوازي", hex: "#D8F8F8" },
  { name: "لافندر", hex: "#E8D8F8" },
  { name: "وردي فاتح", hex: "#F8D8E8" },
  { name: "نعناعي", hex: "#D8F8E8" },
  { name: "كريمي", hex: "#FFF8D8" },
  { name: "سماء", hex: "#D8E8FF" },
  { name: "مرجاني", hex: "#FFD8D8" },
  { name: "رملي", hex: "#F8F8D8" },
]

const getSuggestedEmoji = (text: string): string | undefined => {
  const t = text.toLowerCase()
  if (t.includes("حليب")) return "🥛"
  if (t.includes("بيض")) return "🥚"
  if (t.includes("خبز")) return "🍞"
  if (t.includes("عمل")) return "💼"
  if (t.includes("دراسة") || t.includes("كتاب")) return "📚"
  if (t.includes("شمس")) return "☀️"
  if (t.includes("قمر")) return "🌙"
  if (t.includes("تسوق") || t.includes("سوق")) return "🛒"
  if (t.includes("فكرة")) return "💡"
  if (t.includes("طعام") || t.includes("أكل")) return "🍽️"
  return undefined
}

/* ---------- component ---------- */
export default function TaskEditorDialog({
  task,
  onSave,
  onClose,
  autoSaveEnabled,
  fontSizeClass,
  folders,
}: TaskEditorDialogProps) {
  /* base fields */
  const [title, setTitle] = useState(task?.title ?? "")
  const [content, setContent] = useState(task?.content ?? "")
  const [type, setType] = useState<"text" | "checklist">(task?.type ?? "text")
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(task?.checklistItems ?? [])
  const [backgroundColor, setBackgroundColor] = useState(task?.backgroundColor ?? "#FFFFFF")
  const [folderId, setFolderId] = useState(task?.folderId ?? "default") // New state for folderId
  const [suggestedEmoji, setSuggestedEmoji] = useState<string | undefined>(undefined)

  /* recalc emoji for whole task */
  useEffect(() => {
    setSuggestedEmoji(getSuggestedEmoji(`${title} ${content}`) ?? task?.emoji)
  }, [title, content]) // eslint-disable-line react-hooks/exhaustive-deps

  /* update form when switching task */
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setContent(task.content)
      setType(task.type)
      setChecklistItems(task.checklistItems ?? [])
      setBackgroundColor(task.backgroundColor ?? "#FFFFFF")
      setFolderId(task.folderId ?? "default")
    } else {
      // reset for new task
      setTitle("")
      setContent("")
      setType("text")
      setChecklistItems([])
      setBackgroundColor("#FFFFFF")
      setFolderId("default") // Default to 'General' folder for new tasks
    }
  }, [task])

  /* ---------- checklist helpers ---------- */
  const addChecklistItem = () =>
    setChecklistItems((prev) => [...prev, { id: uuidv4(), text: "", isCompleted: false, emoji: undefined }])

  const updateChecklistItem = (id: string, text: string) =>
    setChecklistItems((prev) =>
      prev.map((itm) => (itm.id === id ? { ...itm, text, emoji: getSuggestedEmoji(text) } : itm)),
    )

  const toggleChecklistItem = (id: string) =>
    setChecklistItems((prev) => prev.map((itm) => (itm.id === id ? { ...itm, isCompleted: !itm.isCompleted } : itm)))

  const deleteChecklistItem = (id: string) => setChecklistItems((prev) => prev.filter((itm) => itm.id !== id))

  /* ---------- save logic ---------- */
  const performSave = (isAuto = false) => {
    // reject empty
    if (type === "text" && !title.trim() && !content.trim()) {
      return
    }
    const payload: Task = {
      id: task?.id ?? uuidv4(),
      title,
      content,
      isCompleted: task?.isCompleted ?? false,
      isPinned: task?.isPinned ?? false,
      createdAt: task?.createdAt ?? Date.now(),
      backgroundColor,
      type,
      checklistItems,
      emoji: suggestedEmoji,
      folderId, // Include folderId in payload
    }
    onSave(payload, isAuto)
  }

  /* auto-save */
  useEffect(() => {
    if (!autoSaveEnabled) return
    const tid = setTimeout(() => performSave(true), 1000)
    return () => clearTimeout(tid)
  }) /* dependencies intentionally omitted to save whenever state updates */

  /* ---------- render ---------- */
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-lg shadow-xl bg-lightCard dark:bg-darkCard">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-lightText dark:text-darkText">
            {" "}
            {task ? "تعديل المهمة" : "إضافة مهمة"}{" "}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {task ? "قم بتعديل بيانات المهمة ثم احفظ." : "أضف مهمة جديدة إلى قائمتك."}
          </DialogDescription>
        </DialogHeader>

        {/* title */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-lightText dark:text-darkText">
              العنوان
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText"
            />
          </div>

          {/* type switch */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-lightText dark:text-darkText">النوع</Label>
            <Select value={type} onValueChange={(val) => setType(val as "text" | "checklist")}>
              <SelectTrigger className="col-span-3 bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectItem value="text">نص</SelectItem>
                <SelectItem value="checklist">قائمة مرجعية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* text body */}
          {type === "text" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="pt-2 text-lightText dark:text-darkText">
                المحتوى
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 min-h-[100px] resize-y bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText"
              />
            </div>
          )}

          {/* checklist body */}
          {type === "checklist" && (
            <div className="space-y-3">
              {checklistItems.map((itm) => (
                <div key={itm.id} className="flex items-center gap-2">
                  <Checkbox checked={itm.isCompleted} onCheckedChange={() => toggleChecklistItem(itm.id)} />
                  {itm.emoji && <span className="text-xl">{itm.emoji}</span>}
                  <Input
                    value={itm.text}
                    onChange={(e) => updateChecklistItem(itm.id, e.target.value)}
                    placeholder="عنصر جديد"
                    className="flex-1 bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText"
                  />
                  <Button variant="ghost" size="sm" onClick={() => deleteChecklistItem(itm.id)}>
                    حذف
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addChecklistItem}>
                إضافة عنصر
              </Button>
            </div>
          )}

          {/* Folder selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-lightText dark:text-darkText">المجلد</Label>
            <Select value={folderId} onValueChange={setFolderId}>
              <SelectTrigger className="col-span-3 bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر مجلدًا" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* color picker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-lightText dark:text-darkText">اللون</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {solidColors.map((c) => (
                <button
                  key={c.hex}
                  aria-label={`لون ${c.name}`}
                  className={`w-7 h-7 rounded-full border-2 relative ${
                    backgroundColor === c.hex ? "border-gray-600 dark:border-gray-300" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => {
                    setBackgroundColor(c.hex)
                  }}
                >
                  {backgroundColor === c.hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-800 dark:text-gray-100">
                      ✓
                    </span>
                  )}
                </button>
              ))}
              {/* Clear color button */}
              {backgroundColor !== "#FFFFFF" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center"
                  onClick={() => setBackgroundColor("#FFFFFF")}
                  aria-label="مسح اللون"
                >
                  <XCircle className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={() => {
              performSave(false)
              onClose()
            }}
          >
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
