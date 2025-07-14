"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

interface NoteCardProps {
  id: string
  title: string
  content: string
  onDelete: (id: string) => void
}

export default function NoteCard({ id, title, content, onDelete }: NoteCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {"تاريخ الإنشاء: " + new Date().toLocaleDateString("ar-EG")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button variant="destructive" size="icon" onClick={() => onDelete(id)} aria-label={`حذف الملاحظة ${title}`}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
