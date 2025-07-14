"use client"

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { Trash2, Pin, PinOff, Folder } from "lucide-react" // Added Folder icon
import { useMemo } from "react"

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

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onToggleCompletion: (id: string) => void
  onTogglePin: (id: string) => void
  onEdit: (task: Task) => void
  onChecklistItemToggle?: (taskId: string, itemId: string) => void
  fontFamilyClass: string
  fontSizeClass: string
  folders: FolderType[] // Pass folders to TaskCard
  cardSize: string // New prop for card size
}

// Helper function to determine if a hex color is light or dark
function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace(/^#/, "")
  if (hex.length !== 6) return false // Not a valid hex color
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 // A common threshold for light vs. dark
}

export default function TaskCard({
  task,
  onDelete,
  onToggleCompletion,
  onTogglePin,
  onEdit,
  onChecklistItemToggle,
  fontFamilyClass,
  fontSizeClass,
  folders,
  cardSize, // Destructure new prop
}: TaskCardProps) {
  // Determine if the card's background is light or dark
  // If no custom background or it's white, we rely on the global theme (which is dark by default)
  const useGlobalThemeColors = !task.backgroundColor || task.backgroundColor === "#FFFFFF"
  const isCardBgLight = useGlobalThemeColors ? false : isLightColor(task.backgroundColor!)

  // Text colors based on card background
  const dynamicTextColor = useGlobalThemeColors
    ? "text-lightText dark:text-darkText" // Use global theme colors
    : isCardBgLight
      ? "text-gray-900" // Dark text for light custom background
      : "text-gray-50" // Light text for dark custom background

  const dynamicMutedTextColor = useGlobalThemeColors
    ? "text-gray-600 dark:text-gray-300" // Use global theme muted colors
    : isCardBgLight
      ? "text-gray-700" // Darker muted for light custom background
      : "text-gray-300" // Lighter muted for dark custom background

  // Checkbox colors based on card background
  const checkboxCheckedBg = useGlobalThemeColors
    ? "data-[state=checked]:bg-primary"
    : isCardBgLight
      ? "data-[state=checked]:bg-gray-800"
      : "data-[state=checked]:bg-gray-50"
  const checkboxCheckedText = useGlobalThemeColors
    ? "data-[state=checked]:text-primary-foreground"
    : isCardBgLight
      ? "data-[state=checked]:text-gray-50"
      : "data-[state=checked]:text-gray-800"
  const checkboxBorderColor = useGlobalThemeColors
    ? "border-input"
    : isCardBgLight
      ? "border-gray-400"
      : "border-gray-600"

  // Icon colors based on card background
  const dynamicIconColor = useGlobalThemeColors
    ? "text-muted-foreground dark:text-gray-400"
    : isCardBgLight
      ? "text-gray-700"
      : "text-gray-300"

  const dynamicPinFillColor = useGlobalThemeColors
    ? "fill-purple-500"
    : isCardBgLight
      ? "fill-purple-700"
      : "fill-purple-400"

  // Removed dynamicTrashColor as it will be replaced by specific classes
  // const dynamicTrashColor = useGlobalThemeColors
  //   ? "text-destructive dark:text-red-400"
  //   : isCardBgLight
  //     ? "text-red-600"
  //     : "text-red-400"

  const folderName = task.folderId ? folders.find((f) => f.id === task.folderId)?.name : null

  // Dynamic classes based on cardSize
  const cardSizeClasses = useMemo(() => {
    switch (cardSize) {
      case "sm":
        return {
          cardPadding: "p-3",
          titleSize: "text-lg",
          contentSize: "text-sm",
          iconSize: "h-4 w-4",
          checkboxSize: "w-4 h-4",
          emojiSize: "text-xl",
          folderTextSize: "text-xs",
          trashButtonSize: "h-7 w-7", // Smaller trash button
          trashIconSize: "h-4 w-4", // Smaller trash icon
        }
      case "lg":
        return {
          cardPadding: "p-5",
          titleSize: "text-2xl",
          contentSize: "text-lg",
          iconSize: "h-6 w-6",
          checkboxSize: "w-6 h-6",
          emojiSize: "text-3xl",
          folderTextSize: "text-sm",
          trashButtonSize: "h-9 w-9", // Larger trash button
          trashIconSize: "h-6 w-6", // Larger trash icon
        }
      case "md":
      default:
        return {
          cardPadding: "p-4",
          titleSize: "text-xl",
          contentSize: "text-base",
          iconSize: "h-5 w-5",
          checkboxSize: "w-5 h-5",
          emojiSize: "text-2xl",
          folderTextSize: "text-xs",
          trashButtonSize: "h-8 w-8", // Default trash button size
          trashIconSize: "h-5 w-5", // Default trash icon size
        }
    }
  }, [cardSize])

  return (
    <Card
      onClick={() => onEdit(task)}
      style={{
        backgroundColor: task.backgroundColor && task.backgroundColor !== "#FFFFFF" ? task.backgroundColor : undefined,
      }}
      className={`relative w-full max-w-md rounded-xl shadow-lg transition-all duration-300 cursor-pointer
        ${fontFamilyClass} ${fontSizeClass}
        ${task.isCompleted ? "opacity-70 border-green-400 dark:border-green-600" : "hover:shadow-xl"}
        ${
          task.isPinned ? "border-2 border-purple-500 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/30" : ""
        }
        ${!task.backgroundColor || task.backgroundColor === "#FFFFFF" ? "bg-lightCard dark:bg-darkCard" : ""}
        ${cardSizeClasses.cardPadding}
        `}
    >
      {/* Pinned label (top-right) */}
      {task.isPinned && (
        <div className="absolute top-0 right-0 bg-purple-500 dark:bg-purple-400 text-white px-3 py-1 rounded-bl-lg text-xs font-bold z-10">
          مثبتة
        </div>
      )}

      {/* Pin/Unpin Button (top-left) */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={task.isPinned ? "إلغاء تثبيت المهمة" : "تثبيت المهمة"}
        className={`absolute top-2 left-2 z-20 ${dynamicIconColor} hover:text-purple-600 dark:hover:text-purple-400`}
        onClick={(e) => {
          e.stopPropagation()
          onTogglePin(task.id)
        }}
      >
        {task.isPinned ? (
          <PinOff className={`${cardSizeClasses.iconSize} ${dynamicPinFillColor}`} />
        ) : (
          <Pin className={cardSizeClasses.iconSize} />
        )}
      </Button>

      <CardHeader className={`pb-2 flex items-center justify-between ${cardSizeClasses.cardPadding}`}>
        <div className="flex items-center gap-3">
          {task.type === "text" && (
            <Checkbox
              id={`task-${task.id}`}
              checked={task.isCompleted}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={() => onToggleCompletion(task.id)}
              aria-label={`تحديد المهمة ${task.title} كمكتملة`}
              className={`${cardSizeClasses.checkboxSize} ${checkboxBorderColor} ${checkboxCheckedBg} ${checkboxCheckedText}`}
            />
          )}

          <CardTitle
            className={`${dynamicTextColor} ${cardSizeClasses.titleSize} font-semibold ${
              task.isCompleted && task.type === "text" ? "line-through text-gray-500 dark:text-gray-400" : ""
            }`}
          >
            {task.emoji && <span className={`mr-2 ${cardSizeClasses.emojiSize}`}>{task.emoji}</span>}
            {task.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className={`pt-2 ${cardSizeClasses.cardPadding}`}>
        {task.type === "text" ? (
          <p
            className={`leading-relaxed select-none ${dynamicMutedTextColor} ${task.isCompleted ? "line-through" : ""} ${cardSizeClasses.contentSize}`}
          >
            {task.content}
          </p>
        ) : (
          <div className="grid gap-1">
            {task.checklistItems
              ?.filter((i) => !i.isCompleted)
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  {" "}
                  {/* Changed items-center to items-start for better alignment with multiline text */}
                  <Checkbox
                    id={`chk-${task.id}-${item.id}`}
                    checked={item.isCompleted}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => onChecklistItemToggle?.(task.id, item.id)}
                    className={`${cardSizeClasses.checkboxSize} ${checkboxBorderColor} ${checkboxCheckedBg} ${checkboxCheckedText} mt-1`}
                  />{" "}
                  {/* mt-1 aligns the checkbox with multiline text */}
                  {item.emoji && <span className={`${cardSizeClasses.contentSize} mt-1`}>{item.emoji}</span>}{" "}
                  {/* Added mt-1 */}
                  <span className={`${cardSizeClasses.contentSize} ${dynamicMutedTextColor} flex-1`}>{item.text}</span>{" "}
                  {/* Added flex-1 to allow text to take full width */}
                </div>
              ))}

            {task.checklistItems && task.checklistItems.filter((i) => !i.isCompleted).length > 3 && (
              <p className={`${cardSizeClasses.folderTextSize} ${dynamicMutedTextColor} mt-1`}>
                و {task.checklistItems.filter((i) => !i.isCompleted).length - 3} المزيد...
              </p>
            )}

            {task.checklistItems?.some((i) => i.isCompleted) && (
              <p className={`${cardSizeClasses.folderTextSize} ${dynamicMutedTextColor} mt-1`}>
                ({task.checklistItems.filter((i) => i.isCompleted).length} مكتملة)
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className={`flex justify-between items-center pt-4 ${cardSizeClasses.cardPadding}`}>
        {folderName && (
          <div className={`flex items-center gap-1 ${cardSizeClasses.folderTextSize} ${dynamicMutedTextColor}`}>
            <Folder className={cardSizeClasses.iconSize} />
            <span>{folderName}</span>
          </div>
        )}
        <Button
          variant="ghost" // Changed variant to ghost to allow custom background
          size="icon"
          aria-label={`حذف المهمة ${task.title}`}
          className={`bg-gray-800 hover:bg-gray-900 text-gray-50 dark:bg-gray-900 dark:hover:bg-black dark:text-gray-200 rounded-full ${cardSizeClasses.trashButtonSize}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          <Trash2 className={cardSizeClasses.trashIconSize} />
        </Button>
      </CardFooter>
    </Card>
  )
}
