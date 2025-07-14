"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

interface AddTaskFormProps {
  onAddTask: (title: string, content: string) => void
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onAddTask(title, content)
      setTitle("")
      setContent("")
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl bg-white dark:bg-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">إضافة مهمة جديدة</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">اكتب مهمتك أو فكرتك هنا.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="task-title" className="text-base">
              العنوان
            </Label>
            <Input
              id="task-title"
              placeholder="عنوان المهمة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 text-base"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-content" className="text-base">
              المحتوى
            </Label>
            <Textarea
              id="task-content"
              placeholder="اكتب تفاصيل مهمتك هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[120px] p-3 text-base resize-y"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg font-medium rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
          >
            إضافة مهمة
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
