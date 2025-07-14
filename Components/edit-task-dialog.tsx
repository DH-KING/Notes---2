"use client"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

interface Task {
  id: string
  title: string
  content: string
  isCompleted: boolean
  isPinned: boolean
  createdAt: number
}

interface EditTaskDialogProps {
  task: Task | null
  onSave: (id: string, newTitle: string, newContent: string) => void
  onClose: () => void
}

export default function EditTaskDialog({ task, onSave, onClose }: EditTaskDialogProps) {
  const [editedTitle, setEditedTitle] = useState(task?.title || "")
  const [editedContent, setEditedContent] = useState(task?.content || "")

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title)
      setEditedContent(task.content)
    }
  }, [task])

  const handleSave = () => {
    if (task && editedTitle.trim() && editedContent.trim()) {
      onSave(task.id, editedTitle, editedContent)
      onClose()
    }
  }

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">تعديل المهمة</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            قم بإجراء التغييرات على مهمتك هنا. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-base">
              العنوان
            </Label>
            <Input
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="col-span-3 p-2 text-base"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right text-base pt-2">
              المحتوى
            </Label>
            <Textarea
              id="content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="col-span-3 min-h-[100px] p-2 text-base resize-y select-text" // Added select-text here
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
          >
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
