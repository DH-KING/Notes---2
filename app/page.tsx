"use client"

import { useState, useMemo, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import TaskCard from "../components/task-card"
import TaskEditorDialog from "../components/task-editor-dialog"
import { ModeToggle } from "../components/mode-toggle"
import SettingsDialog from "../components/settings-dialog"
import { Button } from "../components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Settings, NotebookText, Search, Folder, FolderOpen, Edit, Trash2 } from "lucide-react"
import { Input } from "../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"

interface ChecklistItem {
  id: string
  text: string
  isCompleted: boolean
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

type FilterType = "all" | "active" | "completed" | "pinned"

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<FolderType[]>([]) // New state for folders
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)
  const [fontFamily, setFontFamily] = useState("sans")
  const [fontSize, setFontSize] = useState("base")
  const [columns, setColumns] = useState("3")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null) // New state for selected folder
  const [folderSize, setFolderSize] = useState("md") // New state for folder size
  const [cardSize, setCardSize] = useState("md") // New state for card size

  // Folder dialog states
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null)

  // Load initial tasks and settings from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("memoira_tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      setTasks([
        {
          id: uuidv4(),
          title: "مهمة ترحيبية",
          content: "هذه أول مهمة لك! يمكنك إدارتها وتثبيتها أو إكمالها.",
          isCompleted: false,
          isPinned: true,
          createdAt: Date.now() - 10000,
          type: "text",
          backgroundColor: "#FFFDE7",
          emoji: "👋",
          folderId: "default", // Assign to default folder
        },
        {
          id: uuidv4(),
          title: "قائمة التسوق",
          content: "",
          isCompleted: false,
          isPinned: false,
          createdAt: Date.now() - 5000,
          type: "checklist",
          backgroundColor: "#E6F4EA",
          emoji: "🛒",
          checklistItems: [
            { id: uuidv4(), text: "حليب", isCompleted: false },
            { id: uuidv4(), text: "بيض", isCompleted: true },
            { id: uuidv4(), text: "خبز", isCompleted: false },
          ],
          folderId: "shopping", // Assign to shopping folder
        },
        {
          id: uuidv4(),
          title: "الانتهاء من تقرير المشروع",
          content: "مراجعة البيانات النهائية وكتابة الخلاصة.",
          isCompleted: true,
          isPinned: false,
          createdAt: Date.now() - 15000,
          type: "text",
          backgroundColor: "#E8F0FE",
          emoji: "📊",
          folderId: "work", // Assign to work folder
        },
      ])
    }

    const storedFolders = localStorage.getItem("memoira_folders")
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders))
    } else {
      setFolders([
        { id: "default", name: "عام" },
        { id: "shopping", name: "تسوق" },
        { id: "work", name: "عمل" },
      ])
    }

    const storedAutoSave = localStorage.getItem("memoira_autoSave")
    if (storedAutoSave !== null) {
      setAutoSaveEnabled(JSON.parse(storedAutoSave))
    }
    const storedFontFamily = localStorage.getItem("memoira_fontFamily")
    if (storedFontFamily) {
      setFontFamily(storedFontFamily)
    }
    const storedFontSize = localStorage.getItem("memoira_fontSize")
    if (storedFontSize) {
      setFontSize(storedFontSize)
    }
    const storedColumns = localStorage.getItem("memoira_columns")
    if (storedColumns) {
      setColumns(storedColumns)
    }
    const storedFolderSize = localStorage.getItem("memoira_folderSize")
    if (storedFolderSize) {
      setFolderSize(storedFolderSize)
    }
    const storedCardSize = localStorage.getItem("memoira_cardSize")
    if (storedCardSize) {
      setCardSize(storedCardSize)
    }
  }, [])

  // Save tasks and settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("memoira_tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("memoira_folders", JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    localStorage.setItem("memoira_autoSave", JSON.stringify(autoSaveEnabled))
  }, [autoSaveEnabled])

  useEffect(() => {
    localStorage.setItem("memoira_fontFamily", fontFamily)
  }, [fontFamily])

  useEffect(() => {
    localStorage.setItem("memoira_fontSize", fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem("memoira_columns", columns)
  }, [columns])

  useEffect(() => {
    localStorage.setItem("memoira_folderSize", folderSize)
  }, [folderSize])

  useEffect(() => {
    localStorage.setItem("memoira_cardSize", cardSize)
  }, [cardSize])

  const handleSaveTask = (updatedTask: Task, isAutoSave = false) => {
    if (tasks.some((t) => t.id === updatedTask.id)) {
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    } else {
      setTasks((prevTasks) => [updatedTask, ...prevTasks])
    }

    if (!isAutoSave) {
      setEditingTask(null)
      setIsNewTaskDialogOpen(false)
    }
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)),
    )
  }

  const toggleTaskPin = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isPinned: !task.isPinned } : task)))
  }

  const toggleChecklistItemCompletion = (taskId: string, itemId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId && task.checklistItems
          ? {
              ...task,
              checklistItems: task.checklistItems.map((item) =>
                item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
              ),
            }
          : task,
      ),
    )
  }

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isCompleted))
  }

  // Folder management functions
  const handleAddFolder = () => {
    if (newFolderName.trim() && !folders.some((f) => f.name === newFolderName.trim())) {
      setFolders((prev) => [...prev, { id: uuidv4(), name: newFolderName.trim() }])
      setNewFolderName("")
      setIsAddFolderDialogOpen(false)
    }
  }

  const handleEditFolder = () => {
    if (
      editingFolder &&
      newFolderName.trim() &&
      !folders.some((f) => f.id !== editingFolder.id && f.name === newFolderName.trim())
    ) {
      setFolders((prev) => prev.map((f) => (f.id === editingFolder.id ? { ...f, name: newFolderName.trim() } : f)))
      setNewFolderName("")
      setEditingFolder(null)
      setIsAddFolderDialogOpen(false)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المجلد؟ سيتم نقل جميع المهام الموجودة فيه إلى المجلد العام.")) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId))
      setTasks((prev) => prev.map((task) => (task.folderId === folderId ? { ...task, folderId: "default" } : task)))
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null) // Deselect if current folder is deleted
      }
    }
  }

  const { pinnedTasks, regularTasks } = useMemo(() => {
    let currentTasks = tasks

    // Apply folder filter first
    if (selectedFolderId) {
      currentTasks = currentTasks.filter((task) => task.folderId === selectedFolderId)
    }

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      currentTasks = currentTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.content.toLowerCase().includes(lowerCaseSearchTerm) ||
          (task.type === "checklist" &&
            task.checklistItems?.some((item) => item.text.toLowerCase().includes(lowerCaseSearchTerm))),
      )
    }

    // Then apply filter type
    if (filter === "active") {
      currentTasks = currentTasks.filter((task) => !task.isCompleted)
    } else if (filter === "completed") {
      currentTasks = currentTasks.filter((task) => task.isCompleted)
    } else if (filter === "pinned") {
      currentTasks = currentTasks.filter((task) => task.isPinned)
    }

    const pinned = currentTasks.filter((task) => task.isPinned).sort((a, b) => b.createdAt - a.createdAt)
    const regular = currentTasks.filter((task) => !task.isPinned).sort((a, b) => b.createdAt - a.createdAt)

    return { pinnedTasks: pinned, regularTasks: regular }
  }, [tasks, filter, searchTerm, selectedFolderId]) // Added selectedFolderId to dependencies

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Prevent dragging between pinned and regular sections
    if (source.droppableId !== destination.droppableId) {
      return
    }

    // Reorder within the same section
    if (source.droppableId === "pinned-tasks") {
      const newPinnedOrder = Array.from(pinnedTasks)
      const [removed] = newPinnedOrder.splice(source.index, 1)
      newPinnedOrder.splice(destination.index, 0, removed)

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks]
        const draggedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId)
        if (draggedTaskIndex !== -1) {
          const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1)
          const targetTask = newPinnedOrder[destination.index]
          const targetIndex = updatedTasks.findIndex((task) => task.id === targetTask.id)
          if (targetIndex !== -1) {
            updatedTasks.splice(targetIndex, 0, draggedTask)
          } else {
            updatedTasks.push(draggedTask)
          }
        }
        return updatedTasks.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          const aInNewPinned = newPinnedOrder.findIndex((item) => item.id === a.id)
          const bInNewPinned = newPinnedOrder.findIndex((item) => item.id === b.id)
          if (aInNewPinned !== -1 && bInNewPinned !== -1) return aInNewPinned - bInNewPinned

          const aInNewRegular = regularTasks.findIndex((item) => item.id === a.id)
          const bInNewRegular = regularTasks.findIndex((item) => item.id === b.id)
          if (aInNewRegular !== -1 && bInNewRegular !== -1) return aInNewRegular - bInNewRegular
          return 0
        })
      })
    } else if (source.droppableId === "regular-tasks") {
      const newRegularOrder = Array.from(regularTasks)
      const [removed] = newRegularOrder.splice(source.index, 1)
      newRegularOrder.splice(destination.index, 0, removed)

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks]
        const draggedTaskIndex = updatedTasks.findIndex((task) => task.id === draggableId)
        if (draggedTaskIndex !== -1) {
          const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1)
          const targetTask = newRegularOrder[destination.index]
          const targetIndex = updatedTasks.findIndex((task) => task.id === targetTask.id)
          if (targetIndex !== -1) {
            updatedTasks.splice(targetIndex, 0, draggedTask)
          } else {
            updatedTasks.push(draggedTask)
          }
        }
        return updatedTasks.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          const aInNewPinned = pinnedTasks.findIndex((item) => item.id === a.id)
          const bInNewPinned = pinnedTasks.findIndex((item) => item.id === b.id)
          if (aInNewPinned !== -1 && bInNewPinned !== -1) return aInNewPinned - bInNewPinned

          const aInNewRegular = newRegularOrder.findIndex((item) => item.id === a.id)
          const bInNewRegular = newRegularOrder.findIndex((item) => item.id === b.id)
          if (aInNewRegular !== -1 && bInNewRegular !== -1) return aInNewRegular - bInNewRegular
          return 0
        })
      })
    }
  }

  const getEmptyMessage = (currentFilter: FilterType, hasSearchTerm: boolean) => {
    if (hasSearchTerm) {
      return "لا توجد مهام مطابقة لبحثك."
    }
    switch (currentFilter) {
      case "active":
        return "لا توجد مهام نشطة حالياً. أضف مهمة جديدة!"
      case "completed":
        return "لا توجد مهام مكتملة بعد. أكمل بعض المهام!"
      case "pinned":
        return "لا توجد مهام مثبتة. قم بتثبيت مهمة مهمة!"
      case "all":
      default:
        return "لا توجد مهام بعد. أضف مهمة جديدة!"
    }
  }

  const columnClass = useMemo(() => {
    switch (columns) {
      case "1":
        return "grid-cols-1"
      case "2":
        return "grid-cols-1 md:grid-cols-2"
      case "3":
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }
  }, [columns])

  const fontFamilyClass = useMemo(() => {
    switch (fontFamily) {
      case "serif":
        return "font-serif"
      case "mono":
        return "font-mono"
      case "sans":
      default:
        return "font-sans"
    }
  }, [fontFamily])

  const fontSizeClass = useMemo(() => {
    switch (fontSize) {
      case "sm":
        return "text-sm"
      case "lg":
        return "text-lg"
      case "base":
      default:
        return "text-base"
    }
  }, [fontSize])

  const folderSizeClasses = useMemo(() => {
    switch (folderSize) {
      case "sm":
        return {
          button: "text-xs px-2 py-0.5",
          icon: "h-3 w-3",
          editTrashIcon: "h-4 w-4",
          plusIcon: "h-2.5 w-2.5",
        }
      case "lg":
        return {
          button: "text-base px-4 py-2",
          icon: "h-5 w-5",
          editTrashIcon: "h-7 w-7",
          plusIcon: "h-4 w-4",
        }
      case "md":
      default:
        return {
          button: "text-sm px-3 py-1.5",
          icon: "h-4 w-4",
          editTrashIcon: "h-6 w-6",
          plusIcon: "h-3.5 w-3.5",
        }
    }
  }, [folderSize])

  return (
    <main
      className={`flex flex-col items-center p-6 md:p-10 gap-10 min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText ${fontFamilyClass} relative overflow-hidden`}
    >
      {/* Subtle background animation/pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM15 12v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
          animation: "moveBackground 60s linear infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes moveBackground {
          from { background-position: 0 0; }
          to { background-position: 600px 600px; }
        }
      `}</style>

      <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accentPrimaryLight dark:text-accentPrimaryDark drop-shadow-md text-center sm:text-left flex items-center gap-3">
          <NotebookText className="w-8 h-8 md:w-10 md:h-10 fill-accentPrimaryLight dark:fill-accentPrimaryDark" />
          VesperNotes
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} aria-label="الإعدادات">
            <Settings className="h-6 w-6" />
          </Button>
          <ModeToggle />
        </div>
      </header>

      {/* Search Bar and Filters/Folders Section */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 z-10">
        {" "}
        {/* Adjusted max-w */}
        {/* Search Bar */}
        <div className="w-full relative">
          <Input
            type="text"
            placeholder="البحث عن المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full shadow-md bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accentPrimaryDark focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        {/* Folder Navigation */}
        <div className="w-full flex flex-wrap justify-center gap-1 p-1 bg-lightCard dark:bg-darkCard rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <Button
            variant={selectedFolderId === null ? "default" : "ghost"}
            onClick={() => setSelectedFolderId(null)}
            className={`${folderSizeClasses.button} rounded-lg ${selectedFolderId === null ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            جميع المجلدات
          </Button>
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center group">
              <Button
                variant={selectedFolderId === folder.id ? "default" : "ghost"}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`${folderSizeClasses.button} rounded-lg flex items-center gap-1.5 ${selectedFolderId === folder.id ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                {selectedFolderId === folder.id ? (
                  <FolderOpen className={folderSizeClasses.icon} />
                ) : (
                  <Folder className={folderSizeClasses.icon} />
                )}
                {folder.name}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`${folderSizeClasses.editTrashIcon} opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-400 hover:text-accentPrimaryDark dark:hover:text-accentPrimaryLight`}
                onClick={() => {
                  setEditingFolder(folder)
                  setNewFolderName(folder.name)
                  setIsAddFolderDialogOpen(true)
                }}
                aria-label={`تعديل المجلد ${folder.name}`}
              >
                <Edit className={folderSizeClasses.icon} />
              </Button>
              {folder.id !== "default" && ( // Prevent deleting default folder
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${folderSizeClasses.editTrashIcon} opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700`}
                  onClick={() => handleDeleteFolder(folder.id)}
                  aria-label={`حذف المجلد ${folder.name}`}
                >
                  <Trash2 className={folderSizeClasses.icon} />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setEditingFolder(null)
              setNewFolderName("")
              setIsAddFolderDialogOpen(true)
            }}
            className={`${folderSizeClasses.button} rounded-lg border-dashed border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <Plus className={`${folderSizeClasses.plusIcon} mr-1`} /> إضافة مجلد
          </Button>
        </div>
        {/* Task Filters */}
        <div className="w-full flex flex-wrap justify-center gap-2 p-2 bg-lightCard dark:bg-darkCard rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => setFilter("all")}
            className={`text-sm px-3 py-1.5 rounded-lg ${filter === "all" ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            جميع المهام
          </Button>
          <Button
            variant={filter === "active" ? "default" : "ghost"}
            onClick={() => setFilter("active")}
            className={`text-sm px-3 py-1.5 rounded-lg ${filter === "active" ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            المهام النشطة
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "ghost"}
            onClick={() => setFilter("completed")}
            className={`text-sm px-3 py-1.5 rounded-lg ${filter === "completed" ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            المهام المكتملة
          </Button>
          <Button
            variant={filter === "pinned" ? "default" : "ghost"}
            onClick={() => setFilter("pinned")}
            className={`text-sm px-3 py-1.5 rounded-lg ${filter === "pinned" ? "bg-accentPrimaryDark text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            المهام المثبتة
          </Button>
          {tasks.some((task) => task.isCompleted) && (
            <Button
              variant="destructive"
              onClick={clearCompletedTasks}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md"
            >
              مسح المكتملة
            </Button>
          )}
        </div>
      </div>

      {/* Floating Add Task Button */}
      <Button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg bg-accentPrimaryDark hover:bg-blue-600 text-white z-20 flex items-center justify-center text-3xl"
        onClick={() => setIsNewTaskDialogOpen(true)}
        aria-label="إضافة مهمة جديدة"
      >
        <Plus className="w-8 h-8" />
      </Button>

      <section className="w-full max-w-6xl flex flex-col items-center gap-6 z-10">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Pinned Tasks Section */}
          {pinnedTasks.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 self-start mb-4">المهام المثبتة</h2>
              <Droppable droppableId="pinned-tasks" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`grid ${columnClass} gap-8 w-full`}
                  >
                    {pinnedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            <TaskCard
                              task={task}
                              onDelete={deleteTask}
                              onToggleCompletion={toggleTaskCompletion}
                              onTogglePin={toggleTaskPin}
                              onEdit={setEditingTask}
                              onChecklistItemToggle={toggleChecklistItemCompletion}
                              fontFamilyClass={fontFamilyClass}
                              fontSizeClass={fontSizeClass}
                              folders={folders} // Pass folders to TaskCard
                              cardSize={cardSize} // Pass cardSize
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <hr className="w-full max-w-6xl border-t-2 border-gray-300 dark:border-gray-700 my-8" />
            </>
          )}

          {/* Regular Tasks Section */}
          {regularTasks.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 self-start mb-4">جميع المهام</h2>
              <Droppable droppableId="regular-tasks" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`grid ${columnClass} gap-8 w-full`}
                  >
                    {regularTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            <TaskCard
                              task={task}
                              onDelete={deleteTask}
                              onToggleCompletion={toggleTaskCompletion}
                              onTogglePin={toggleTaskPin}
                              onEdit={setEditingTask}
                              onChecklistItemToggle={toggleChecklistItemCompletion}
                              fontFamilyClass={fontFamilyClass}
                              fontSizeClass={fontSizeClass}
                              folders={folders} // Pass folders to TaskCard
                              cardSize={cardSize} // Pass cardSize
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </>
          )}

          {pinnedTasks.length === 0 && regularTasks.length === 0 && (
            <p className="col-span-full text-center text-lg text-gray-600 dark:text-gray-400 py-10">
              {getEmptyMessage(filter, !!searchTerm)}
            </p>
          )}
        </DragDropContext>
      </section>

      {/* Task Editor Dialog for editing existing tasks */}
      {editingTask && (
        <TaskEditorDialog
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
          autoSaveEnabled={autoSaveEnabled}
          fontSizeClass={fontSizeClass}
          folders={folders} // Pass folders to editor
        />
      )}

      {/* Task Editor Dialog for adding new tasks */}
      {isNewTaskDialogOpen && (
        <TaskEditorDialog
          task={null}
          onSave={handleSaveTask}
          onClose={() => setIsNewTaskDialogOpen(false)}
          autoSaveEnabled={autoSaveEnabled}
          fontSizeClass={fontSizeClass}
          folders={folders} // Pass folders to editor
        />
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={setAutoSaveEnabled}
        fontFamily={fontFamily}
        onSelectFontFamily={setFontFamily}
        fontSize={fontSize}
        onSelectFontSize={setFontSize}
        columns={columns}
        onSelectColumns={setColumns}
        folderSize={folderSize} // Pass folderSize
        onSelectFolderSize={setFolderSize} // Pass onSelectFolderSize
        cardSize={cardSize} // Pass cardSize
        onSelectCardSize={setCardSize} // Pass onSelectCardSize
      />

      {/* Add/Edit Folder Dialog */}
      <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl bg-lightCard dark:bg-darkCard">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-lightText dark:text-darkText">
              {editingFolder ? "تعديل المجلد" : "إضافة مجلد جديد"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editingFolder ? "قم بتعديل اسم المجلد." : "أدخل اسمًا للمجلد الجديد."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-name" className="text-right text-lightText dark:text-darkText">
                الاسم
              </Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3 bg-lightCard dark:bg-darkCard text-lightText dark:text-darkText"
                placeholder="اسم المجلد"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFolderDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={editingFolder ? handleEditFolder : handleAddFolder}>
              {editingFolder ? "حفظ التغييرات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="w-full max-w-6xl text-center text-sm text-gray-600 dark:text-gray-400 mt-10 z-10">
        <p>{"VesperNotes — Developed with passion by Haider Al-Saadi 🇮🇶"}</p>
      </footer>
    </main>
  )
}
