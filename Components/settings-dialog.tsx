"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  autoSaveEnabled: boolean
  onToggleAutoSave: (enabled: boolean) => void
  fontFamily: string
  onSelectFontFamily: (font: string) => void
  fontSize: string
  onSelectFontSize: (size: string) => void
  columns: string
  onSelectColumns: (cols: string) => void
  folderSize: string // New prop for folder size
  onSelectFolderSize: (size: string) => void // New prop for folder size handler
  cardSize: string // New prop for card size
  onSelectCardSize: (size: string) => void // New prop for card size handler
}

const fontOptions = [
  { value: "sans", label: "افتراضي (Sans-serif)" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
]

const fontSizeOptions = [
  { value: "sm", label: "صغير" },
  { value: "base", label: "متوسط" },
  { value: "lg", label: "كبير" },
]

const columnOptions = [
  { value: "1", label: "عمود واحد" },
  { value: "2", label: "عمودين" },
  { value: "3", label: "ثلاثة أعمدة" },
]

const folderSizeOptions = [
  { value: "sm", label: "صغير" },
  { value: "md", label: "متوسط" },
  { value: "lg", label: "كبير" },
]

const cardSizeOptions = [
  { value: "sm", label: "صغير" },
  { value: "md", label: "متوسط" },
  { value: "lg", label: "كبير" },
]

export default function SettingsDialog({
  isOpen,
  onClose,
  autoSaveEnabled,
  onToggleAutoSave,
  fontFamily,
  onSelectFontFamily,
  fontSize,
  onSelectFontSize,
  columns,
  onSelectColumns,
  folderSize, // Destructure new prop
  onSelectFolderSize, // Destructure new prop
  cardSize, // Destructure new prop
  onSelectCardSize, // Destructure new prop
}: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-lightCard dark:bg-darkCard">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-lightText dark:text-darkText">الإعدادات</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            قم بتخصيص تجربتك في VesperNotes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-save" className="text-base text-lightText dark:text-darkText">
              تمكين الحفظ التلقائي
            </Label>
            <Switch
              id="auto-save"
              checked={autoSaveEnabled}
              onCheckedChange={onToggleAutoSave}
              aria-label="تبديل الحفظ التلقائي"
            />
          </div>
          <p className="text-sm text-muted-foreground -mt-4">
            عند تمكين الحفظ التلقائي، سيتم حفظ ملاحظاتك تلقائياً عند إغلاق نافذة التعديل. وإلا، ستحتاج إلى النقر على زر
            "حفظ".
          </p>

          <div className="grid gap-2">
            <Label htmlFor="font-family" className="text-base text-lightText dark:text-darkText">
              خط النص
            </Label>
            <Select value={fontFamily} onValueChange={onSelectFontFamily}>
              <SelectTrigger className="w-full bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر الخط" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {fontOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="font-size" className="text-base text-lightText dark:text-darkText">
              حجم الخط
            </Label>
            <Select value={fontSize} onValueChange={onSelectFontSize}>
              <SelectTrigger className="w-full bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر الحجم" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {fontSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="columns" className="text-base text-lightText dark:text-darkText">
              عدد الأعمدة
            </Label>
            <Select value={columns} onValueChange={onSelectColumns}>
              <SelectTrigger className="w-full bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر عدد الأعمدة" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {columnOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Folder Size Setting */}
          <div className="grid gap-2">
            <Label htmlFor="folder-size" className="text-base text-lightText dark:text-darkText">
              حجم المجلدات
            </Label>
            <Select value={folderSize} onValueChange={onSelectFolderSize}>
              <SelectTrigger className="w-full bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر الحجم" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {folderSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* New Card Size Setting */}
          <div className="grid gap-2">
            <Label htmlFor="card-size" className="text-base text-lightText dark:text-darkText">
              حجم البطاقات
            </Label>
            <Select value={cardSize} onValueChange={onSelectCardSize}>
              <SelectTrigger className="w-full bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                <SelectValue placeholder="اختر الحجم" />
              </SelectTrigger>
              <SelectContent className="bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText">
                {cardSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
