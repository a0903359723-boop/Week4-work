import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Calendar as CalendarIcon,
  LayoutList,
  Kanban,
  FolderHeart,
  Clock,
  Flag,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  RotateCcw,
  FileCode2,
  CheckSquare,
  Square,
  X,
  Filter,
  SlidersHorizontal,
  Sun,
  Coffee,
  Check,
  Copy,
  FolderPlus,
  AlertCircle,
  ArrowUpDown,
  Layers,
  Terminal,
  Rocket
} from 'lucide-react';

// ==========================================
// 溫暖色系與預設資料定義 (Constants & Mock Data)
// ==========================================

const CATEGORY_COLORS = [
  { id: 'terracotta', name: '赤陶暖橘', hex: '#E07A5F', bg: '#FCEEE9', border: '#F5D0C5', text: '#B85439' },
  { id: 'sage', name: '鼠尾草綠', hex: '#81B29A', bg: '#ECF4F0', border: '#C9E2D6', text: '#4E7D66' },
  { id: 'amber', name: '暖陽琥珀', hex: '#E5A93C', bg: '#FDF6E7', border: '#F7E2B8', text: '#A67114' },
  { id: 'rose', name: '乾燥玫瑰', hex: '#D48C8C', bg: '#FBF0F0', border: '#EED2D2', text: '#9E5858' },
  { id: 'chestnut', name: '焦糖栗棕', hex: '#A67B5B', bg: '#F6EFEA', border: '#E3D0C1', text: '#755136' },
  { id: 'lavender', name: '薰衣草灰紫', hex: '#9A8C98', bg: '#F4F1F4', border: '#DFD8DE', text: '#695B67' },
];

const PRIORITY_CONFIG = {
  high: { label: '高優先', color: '#E07A5F', bg: '#FCEEE9', border: '#F5D0C5', badgeText: '#B85439', weight: 3 },
  medium: { label: '中優先', color: '#E5A93C', bg: '#FDF6E7', border: '#F7E2B8', badgeText: '#9E6B10', weight: 2 },
  low: { label: '低優先', color: '#81B29A', bg: '#ECF4F0', border: '#C9E2D6', badgeText: '#4E7D66', weight: 1 },
};

// 取得相對於今天的日期字串 (YYYY-MM-DD)
const getRelativeDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const INITIAL_CATEGORIES = [
  { id: 'cat-daily', name: '日常待辦', colorId: 'terracotta', icon: '☀️' },
  { id: 'cat-design', name: '設計與創作', colorId: 'amber', icon: '🎨' },
  { id: 'cat-course', name: '課程與專案', colorId: 'sage', icon: '📚' },
  { id: 'cat-market', name: '市集與收納整理', colorId: 'chestnut', icon: '🧺' },
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: '完成個人作品集網站暖色調視覺改版',
    description: '調整首頁 Hero 區塊的排版與燕麥色背景對比度，確認在手機版與平板上的閱讀舒適度。',
    categoryId: 'cat-design',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '16:30',
    completed: false,
    createdAt: getRelativeDate(-2),
    subtasks: [
      { id: 'sub-1', title: '定義色彩變數 (#FDFBF7, #E07A5F, #81B29A)', completed: true },
      { id: 'sub-2', title: '繪製任務卡片與按鈕互動狀態', completed: true },
      { id: 'sub-3', title: '匯出響應式預覽截圖', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: '準備週末文創市集展架與商品標籤',
    description: '清點手作陶器與亞麻布織品庫存，並使用牛皮紙列印價格小卡與品牌故事介紹。',
    categoryId: 'cat-market',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '19:00',
    completed: false,
    createdAt: getRelativeDate(-3),
    subtasks: [
      { id: 'sub-4', title: '確認木質雙層展示架結構穩固', completed: true },
      { id: 'sub-5', title: '裁剪 50 張棉麻吊牌細繩', completed: false },
      { id: 'sub-6', title: '準備找零金與行動支付立牌', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: '採買本週咖啡豆與燕麥奶補給',
    description: '前往巷口烘焙坊挑選衣索比亞日曬淺焙豆，順便購買無糖燕麥奶與肉桂捲。',
    categoryId: 'cat-daily',
    priority: 'low',
    dueDate: getRelativeDate(0),
    dueTime: '11:00',
    completed: true,
    createdAt: getRelativeDate(-1),
    subtasks: [
      { id: 'sub-7', title: '自備環保密封豆罐', completed: true },
      { id: 'sub-8', title: '購買兩瓶咖啡師燕麥奶', completed: true },
    ],
  },
  {
    id: 'task-4',
    title: 'React + Vite 前端模組化架構整理與部署',
    description: '將狀態管理與自訂 Hooks 抽離，撰寫清晰的 README 並設定 Vercel 自動化部署流程。',
    categoryId: 'cat-course',
    priority: 'medium',
    dueDate: getRelativeDate(1),
    dueTime: '15:00',
    completed: false,
    createdAt: getRelativeDate(-1),
    subtasks: [
      { id: 'sub-9', title: '建立 useLocalStorage 自訂 Hook', completed: true },
      { id: 'sub-10', title: '設定 vercel.json SPA 路由規則', completed: false },
    ],
  },
  {
    id: 'task-5',
    title: '書房木櫃換季收納與書籍分類',
    description: '將設計雜誌、工具書與靈感筆記本依照主題重新排列，捐贈不再閱讀的舊書。',
    categoryId: 'cat-market',
    priority: 'medium',
    dueDate: getRelativeDate(3),
    dueTime: '14:00',
    completed: false,
    createdAt: getRelativeDate(0),
    subtasks: [
      { id: 'sub-11', title: '擦拭胡桃木層架灰塵', completed: false },
      { id: 'sub-12', title: '整理桌下充電線材收納盒', completed: false },
    ],
  },
  {
    id: 'task-6',
    title: '繪製秋季插畫明信片草圖 3 款',
    description: '以「午後陽光、熱茶與落葉」為主題，使用 Procreate 進行暖色調水彩質感上色。',
    categoryId: 'cat-design',
    priority: 'low',
    dueDate: getRelativeDate(5),
    dueTime: '18:00',
    completed: false,
    createdAt: getRelativeDate(0),
    subtasks: [
      { id: 'sub-13', title: '收集秋季色票與植物參考圖', completed: true },
      { id: 'sub-14', title: '完成第一款「窗邊閱讀」線稿', completed: false },
    ],
  },
  {
    id: 'task-7',
    title: '繳交本月工作室水電與雲端主機費用',
    description: '核對電子帳單明細並完成轉帳，將收據歸檔至雲端財務資料夾。',
    categoryId: 'cat-daily',
    priority: 'medium',
    dueDate: getRelativeDate(-1),
    dueTime: '12:00',
    completed: true,
    createdAt: getRelativeDate(-4),
    subtasks: [],
  },
];

// ==========================================
// 專案架構與 Vercel 部署指南內容資料
// ==========================================
const ARCHITECTURE_DOCS = {
  tree: `warmflow-task-manager/
├── public/
│   └── favicon.svg              # 暖色調網站圖示
├── src/
│   ├── assets/                  # 靜態字體與溫暖插畫 SVG
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # 左側導覽與專案分類側邊欄
│   │   │   └── Header.jsx       # 全域搜尋、日期與快速操作列
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx     # 任務卡片（支援子任務與狀態切換）
│   │   │   ├── TaskListView.jsx # 邏輯分組列表視圖
│   │   │   ├── KanbanView.jsx   # 看板/專案分類視圖
│   │   │   └── TaskModal.jsx    # 新增與編輯任務彈窗
│   │   ├── calendar/
│   │   │   └── CalendarView.jsx # 互動式月曆與單日待辦抽屜
│   │   └── common/
│   │       └── StatsBanner.jsx  # 今日達成率與溫暖問候統計卡
│   ├── hooks/
│   │   └── useLocalStorage.js   # 本地資料持久化封裝 Hook
│   ├── constants/
│   │   └── theme.js             # 暖色系色票與預設資料設定
│   ├── App.jsx                  # 主應用程式狀態與路由切換
│   ├── main.jsx                 # React 18 掛載入口點
│   └── index.css                # Tailwind CSS 載入與溫暖字體設定
├── index.html                   # 頁面標題與暖色背景預設
├── package.json                 # 專案依賴與 Vite 腳本
├── vite.config.js               # Vite 建置與路徑別名設定
├── tailwind.config.js           # 客製化暖色票 Tailwind 設定
└── vercel.json                  # Vercel SPA 部署路由重導向設定`,

  packageJson: `{
  "name": "warmflow-personal-task-manager",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}`,

  viteConfig: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});`,

  vercelJson: `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}`
};

// ==========================================
// 主應用程式元件 (Main Application)
// ==========================================
export default function App() {
  // --- 狀態管理：任務與專案分類 (含 LocalStorage 持久化) ---
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('warmflow_tasks_v1');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('warmflow_categories_v1');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('warmflow_tasks_v1', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('warmflow_categories_v1', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, [categories]);

  // --- 視圖與導覽狀態 ---
  const [activeView, setActiveView] = useState('list'); // 'list' | 'board' | 'calendar'
  const [selectedCategoryId, setSelectedCategoryId] = useState('all'); // 'all' | categoryId
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'high' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'title'

  // --- 彈窗與互動狀態 ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultModalDate, setDefaultModalDate] = useState(getRelativeDate(0));

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('terracotta');
  const [newCatIcon, setNewCatIcon] = useState('🌿');

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  // --- 刪除與重置確認訊息狀態 (不使用 window.alert / confirm) ---
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // --- 溫暖通知 Toast ---
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // --- 行事曆視圖狀態 ---
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => getRelativeDate(0));

  // --- 輔助函式 ---
  const todayStr = useMemo(() => getRelativeDate(0), []);

  const getCategoryById = (catId) => {
    return categories.find((c) => c.id === catId) || {
      id: 'default',
      name: '未分類',
      colorId: 'chestnut',
      icon: '📌',
    };
  };

  const getColorObj = (colorId) => {
    return CATEGORY_COLORS.find((c) => c.id === colorId) || CATEGORY_COLORS[0];
  };

  // --- 統計數據計算 ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
    const todayCompleted = todayTasks.filter((t) => t.completed).length;
    const todayRate = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 100;

    const highPriorityPending = tasks.filter((t) => !t.completed && t.priority === 'high').length;
    const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < todayStr).length;

    return {
      total,
      completed,
      pending,
      todayTotal: todayTasks.length,
      todayCompleted,
      todayRate,
      highPriorityPending,
      overdueCount,
    };
  }, [tasks, todayStr]);

  // --- 任務篩選與排序邏輯 ---
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // 1. 左側專案分類篩選
        if (selectedCategoryId !== 'all' && task.categoryId !== selectedCategoryId) {
          return false;
        }
        // 2. 左側快速檢視篩選
        if (quickFilter === 'today' && task.dueDate !== todayStr) return false;
        if (quickFilter === 'upcoming' && task.dueDate <= todayStr) return false;
        if (quickFilter === 'high' && task.priority !== 'high') return false;
        if (quickFilter === 'completed' && !task.completed) return false;

        // 3. 狀態下拉篩選
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // 4. 優先級下拉篩選
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // 5. 關鍵字搜尋 (標題、描述、子任務)
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = (task.description || '').toLowerCase().includes(q);
          const matchSub = (task.subtasks || []).some((s) => s.title.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSub) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 未完成永遠排在已完成前面（除非依標題排序）
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        if (sortBy === 'dueDate') {
          const dateCompare = (a.dueDate || '9999-99-99').localeCompare(b.dueDate || '9999-99-99');
          if (dateCompare !== 0) return dateCompare;
          return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
        }
        if (sortBy === 'priority') {
          const weightA = PRIORITY_CONFIG[a.priority]?.weight || 1;
          const weightB = PRIORITY_CONFIG[b.priority]?.weight || 1;
          return weightB - weightA;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title, 'zh-Hant');
        }
        return 0;
      });
  }, [
    tasks,
    selectedCategoryId,
    quickFilter,
    statusFilter,
    priorityFilter,
    searchQuery,
    sortBy,
    todayStr,
  ]);

  // --- CRUD 操作處理 ---
  const handleToggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          showToast(nextState ? '✨ 太棒了！已完成一項任務' : '已將任務標記為待辦');
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubs = (t.subtasks || []).map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubs };
      })
    );
  };

  const handleOpenCreateTask = (presetDate = null, presetCategoryId = null) => {
    setEditingTask(null);
    setDefaultModalDate(presetDate || todayStr);
    setIsTaskModalOpen(true);
    if (presetCategoryId && presetCategoryId !== 'all') {
      // 將在 Modal 中自動帶入
    }
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      );
      showToast('已更新任務內容');
    } else {
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: todayStr,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('已新增溫暖待辦任務');
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (task) => {
    setConfirmDialog({
      isOpen: true,
      title: '確認刪除任務',
      message: `確定要刪除「${task.title}」嗎？此操作無法復原。`,
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
        showToast('已刪除任務');
      },
    });
  };

  // --- 專案分類新增與刪除 ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      colorId: newCatColor,
      icon: newCatIcon || '🌿',
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setIsCategoryModalOpen(false);
    showToast(`已新增分類「${newCat.name}」`);
  };

  const handleDeleteCategory = (cat) => {
    if (categories.length <= 1) {
      showToast('系統至少需保留一個專案分類喔！', 'warning');
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: '刪除專案分類',
      message: `確定要刪除「${cat.name}」分類嗎？該分類下的任務將會移至預設分類。`,
      onConfirm: () => {
        const fallbackCatId = categories.find((c) => c.id !== cat.id)?.id || 'cat-daily';
        setTasks((prev) =>
          prev.map((t) => (t.categoryId === cat.id ? { ...t, categoryId: fallbackCatId } : t))
        );
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        if (selectedCategoryId === cat.id) setSelectedCategoryId('all');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
        showToast(`已移除分類「${cat.name}」`);
      },
    });
  };

  // --- 匯出與重置資料 ---
  const handleExportJSON = () => {
    const data = {
      appName: 'WarmFlow Personal Task Manager',
      exportedAt: new Date().toISOString(),
      categories,
      tasks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warmflow-backup-${todayStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('已匯出 JSON 備份檔案');
  };

  const handleResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: '重置範例資料',
      message: '確定要將所有任務與分類還原為系統預設的溫暖範例資料嗎？目前的自訂變更將會被覆蓋。',
      onConfirm: () => {
        setCategories(INITIAL_CATEGORIES);
        setTasks(INITIAL_TASKS);
        setSelectedCategoryId('all');
        setQuickFilter('all');
        setSearchQuery('');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
        showToast('已重置為預設溫暖範例資料');
      },
    });
  };

  const handleCopyCode = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // 取得繁體中文今日格式化日期
  const formattedToday = useMemo(() => {
    const now = new Date();
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 (${weekdays[now.getDay()]})`;
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row selection:bg-[#E07A5F]/20 selection:text-[#3D352E]"
      style={{
        backgroundColor: '#FDFBF7',
        color: '#3D352E',
        fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      }}
    >
      {/* 頂部溫暖提示 Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border transition-all duration-300 bg-[#3D352E] text-[#FDFBF7] border-[#5A4E44]">
          <Sparkles className="w-4 h-4 text-[#F2CC8F] shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* ==========================================
          左側固定導覽與專案分類側邊欄 (Sidebar)
      ========================================== */}
      <aside
        className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r flex flex-col justify-between p-5 lg:min-h-screen"
        style={{ backgroundColor: '#F5EFE6', borderColor: '#E8DEC8' }}
      >
        <div>
          {/* 品牌標題 Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white font-bold"
                style={{ backgroundColor: '#E07A5F' }}
              >
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#3D352E]">
                  日日暖心待辦
                </h1>
                <p className="text-xs text-[#8C7A6B]">WarmFlow Workspace</p>
              </div>
            </div>

            <button
              onClick={() => handleOpenCreateTask()}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: '#E07A5F' }}
            >
              <Plus className="w-4 h-4" />
              新增任務
            </button>
          </div>

          {/* 智慧快速檢視區 */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] px-2 mb-2">
              智慧檢視
            </p>
            <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
              {[
                {
                  id: 'all',
                  label: '全部任務總覽',
                  icon: Layers,
                  count: tasks.length,
                  accent: '#E07A5F',
                },
                {
                  id: 'today',
                  label: '今日暖心焦點',
                  icon: Sun,
                  count: stats.todayTotal,
                  accent: '#E5A93C',
                },
                {
                  id: 'high',
                  label: '高優先級待辦',
                  icon: Flag,
                  count: stats.highPriorityPending,
                  accent: '#D97757',
                },
                {
                  id: 'completed',
                  label: '已完成歸檔',
                  icon: CheckCircle2,
                  count: stats.completed,
                  accent: '#81B29A',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = quickFilter === item.id && selectedCategoryId === 'all';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setQuickFilter(item.id);
                      setSelectedCategoryId('all');
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#FDFBF7] text-[#3D352E] shadow-sm border border-[#E6DCD2]'
                        : 'text-[#6E6259] hover:bg-[#EFE6D8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: isActive ? item.accent : '#8C7A6B' }}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-[#F5EFE6] text-[#3D352E]' : 'text-[#8C7A6B]'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 專案分類管理區 */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                專案與生活分類
              </p>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs flex items-center gap-1 text-[#E07A5F] hover:text-[#C86246] font-medium transition-colors"
                title="新增專案分類"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const colorObj = getColorObj(cat.colorId);
                const count = tasks.filter((t) => t.categoryId === cat.id && !t.completed).length;
                const isSelected = selectedCategoryId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDFBF7] text-[#3D352E] shadow-sm border border-[#E6DCD2]'
                        : 'text-[#6E6259] hover:bg-[#EFE6D8]'
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setQuickFilter('all');
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                      <span className="text-base leading-none">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#8C7A6B] px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                      {categories.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#A69688] hover:text-[#E07A5F] rounded-lg transition-opacity"
                          title="刪除此分類"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 側邊欄底部：專案架構指南與資料備份區 */}
        <div className="pt-4 border-t border-[#E6DCD2] space-y-2">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm border"
            style={{
              backgroundColor: '#FDF6E7',
              borderColor: '#F2CC8F',
              color: '#8C5E14',
            }}
          >
            <Rocket className="w-4 h-4 text-[#E07A5F]" />
            <span>專案架構 & Vercel 部署指南</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-[#6E6259] hover:bg-[#EFE6D8] border border-[#E6DCD2] transition-colors"
              title="匯出 JSON 備份"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出備份</span>
            </button>
            <button
              onClick={handleResetDemoData}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium text-[#6E6259] hover:bg-[#EFE6D8] border border-[#E6DCD2] transition-colors"
              title="重置為預設範例資料"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置範例</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================
          右側主內容區 (Main Content Area)
      ========================================== */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 頂部導覽與搜尋列 (Header) */}
        <header
          className="sticky top-0 z-20 px-6 py-4 border-b backdrop-blur-md bg-[#FDFBF7]/90"
          style={{ borderColor: '#EFE6D8' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* 左側：日期與當前分類標題 */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#8C7A6B] mb-0.5">
                <span>{formattedToday}</span>
                <span>•</span>
                <span className="text-[#E07A5F]">步調穩定，享受專注當下</span>
              </div>
              <h2 className="text-xl font-bold text-[#3D352E] flex items-center gap-2">
                {selectedCategoryId !== 'all' ? (
                  <>
                    <span>{getCategoryById(selectedCategoryId).icon}</span>
                    <span>{getCategoryById(selectedCategoryId).name}</span>
                  </>
                ) : quickFilter === 'today' ? (
                  '☀️ 今日暖心焦點'
                ) : quickFilter === 'high' ? (
                  '🚩 高優先級重要待辦'
                ) : quickFilter === 'completed' ? (
                  '🌿 已完成任務歸檔'
                ) : (
                  '✨ 個人任務與專案工作台'
                )}
              </h2>
            </div>

            {/* 右側：搜尋框與快速新增按鈕 */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-[#9C8B7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋任務標題、描述或子項目..."
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] placeholder-[#A69688] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 transition-all"
                  style={{ borderColor: '#E6DCD2' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9C8B7A] hover:text-[#3D352E]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  handleOpenCreateTask(
                    activeView === 'calendar' ? selectedDateStr : todayStr,
                    selectedCategoryId
                  )
                }
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-all shrink-0"
                style={{ backgroundColor: '#E07A5F' }}
              >
                <Plus className="w-4 h-4" />
                <span>新增任務</span>
              </button>
            </div>
          </div>
        </header>

        {/* 主內容容器 */}
        <div className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. 溫暖進度統計卡片列 (Stats Cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 今日達成率卡片 */}
            <div
              className="p-4 rounded-2xl border shadow-sm flex flex-col justify-between"
              style={{ backgroundColor: '#FAF6F0', borderColor: '#EDE3D5' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8C7A6B]">今日待辦達成率</span>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#ECF4F0', color: '#4E7D66' }}
                >
                  {stats.todayCompleted} / {stats.todayTotal} 完成
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="text-2xl font-bold text-[#3D352E]">{stats.todayRate}%</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-[#EAE0D2]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.todayRate}%`,
                      backgroundColor: '#81B29A',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 待辦進行中總數 */}
            <div
              className="p-4 rounded-2xl border shadow-sm flex items-center justify-between"
              style={{ backgroundColor: '#FAF6F0', borderColor: '#EDE3D5' }}
            >
              <div>
                <p className="text-xs font-semibold text-[#8C7A6B] mb-1">進行中待辦事項</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#3D352E]">{stats.pending}</span>
                  <span className="text-xs text-[#8C7A6B]">
                    項待完成（已完成 {stats.completed} 項）
                  </span>
                </div>
              </div>
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FDF6E7', color: '#D4952A' }}
              >
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* 高優先級與逾期提醒 */}
            <div
              className="p-4 rounded-2xl border shadow-sm flex items-center justify-between"
              style={{ backgroundColor: '#FAF6F0', borderColor: '#EDE3D5' }}
            >
              <div>
                <p className="text-xs font-semibold text-[#8C7A6B] mb-1">重點關注提醒</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#E07A5F]">
                    {stats.highPriorityPending}
                  </span>
                  <span className="text-xs text-[#8C7A6B]">
                    項高優先級
                    {stats.overdueCount > 0 ? ` • ${stats.overdueCount} 項已逾期` : ' • 無逾期項目'}
                  </span>
                </div>
              </div>
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#FCEEE9', color: '#E07A5F' }}
              >
                <Flag className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* 2. 多維度視圖切換與篩選控制列 (View Switcher & Filters) */}
          <section
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl border"
            style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
          >
            {/* 視圖切換按鈕 (列表 / 看板 / 行事曆) */}
            <div className="flex items-center gap-1.5 bg-[#EAE0D2] p-1 rounded-xl self-start">
              {[
                { id: 'list', label: '任務列表視圖', icon: LayoutList },
                { id: 'board', label: '看板分類視圖', icon: Kanban },
                { id: 'calendar', label: '行事曆視圖', icon: CalendarIcon },
              ].map((v) => {
                const Icon = v.icon;
                const active = activeView === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#FDFBF7] text-[#3D352E] shadow-sm'
                        : 'text-[#6E6259] hover:text-[#3D352E]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 狀態、優先級篩選與排序 */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1.5 rounded-xl border border-[#E6DCD2]">
                <Filter className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span className="text-[#8C7A6B]">狀態:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#3D352E] focus:outline-none cursor-pointer"
                >
                  <option value="all">全部顯示</option>
                  <option value="pending">僅未完成</option>
                  <option value="completed">僅已完成</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1.5 rounded-xl border border-[#E6DCD2]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span className="text-[#8C7A6B]">優先級:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#3D352E] focus:outline-none cursor-pointer"
                >
                  <option value="all">全部等級</option>
                  <option value="high">高優先</option>
                  <option value="medium">中優先</option>
                  <option value="low">低優先</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1.5 rounded-xl border border-[#E6DCD2]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7A6B]" />
                <span className="text-[#8C7A6B]">排序:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-[#3D352E] focus:outline-none cursor-pointer"
                >
                  <option value="dueDate">依截止日期</option>
                  <option value="priority">依優先級高低</option>
                  <option value="title">依名稱排序</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. 主視圖渲染區 */}
          {activeView === 'list' && (
            <TaskListView
              tasks={filteredTasks}
              todayStr={todayStr}
              getCategoryById={getCategoryById}
              getColorObj={getColorObj}
              onToggleComplete={handleToggleTaskComplete}
              onToggleSubtask={handleToggleSubtask}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onOpenCreate={() => handleOpenCreateTask(todayStr, selectedCategoryId)}
            />
          )}

          {activeView === 'board' && (
            <KanbanBoardView
              tasks={filteredTasks}
              categories={categories}
              todayStr={todayStr}
              getCategoryById={getCategoryById}
              getColorObj={getColorObj}
              onToggleComplete={handleToggleTaskComplete}
              onToggleSubtask={handleToggleSubtask}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onOpenCreate={(catId) => handleOpenCreateTask(todayStr, catId)}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarMonthView
              tasks={filteredTasks}
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              selectedDateStr={selectedDateStr}
              setSelectedDateStr={setSelectedDateStr}
              todayStr={todayStr}
              getCategoryById={getCategoryById}
              getColorObj={getColorObj}
              onToggleComplete={handleToggleTaskComplete}
              onToggleSubtask={handleToggleSubtask}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onOpenCreateForDate={(dateStr) => handleOpenCreateTask(dateStr, selectedCategoryId)}
            />
          )}
        </div>
      </main>

      {/* ==========================================
          彈窗 1：新增 / 編輯任務 Modal
      ========================================== */}
      {isTaskModalOpen && (
        <TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          initialTask={editingTask}
          categories={categories}
          defaultDate={defaultModalDate}
          defaultCategoryId={
            selectedCategoryId !== 'all' ? selectedCategoryId : categories[0]?.id
          }
        />
      )}

      {/* ==========================================
          彈窗 2：新增專案分類 Modal
      ========================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D352E]/40 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-3xl border p-6 shadow-xl"
            style={{ backgroundColor: '#FDFBF7', borderColor: '#E6DCD2' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#3D352E] flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-[#E07A5F]" />
                <span>新增溫暖專案分類</span>
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8C7A6B] hover:bg-[#F5EFE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                  分類名稱
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="例如：閱讀筆記、居家園藝、自由接案..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                  style={{ borderColor: '#E6DCD2' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                  選擇代表小圖示
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🌿', '☀️', '🎨', '📚', '🧺', '☕', '🏡', '✨', '🎯', '🪴'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewCatIcon(emoji)}
                      className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all ${
                        newCatIcon === emoji
                          ? 'bg-[#FCEEE9] border-[#E07A5F] scale-105 shadow-xs'
                          : 'bg-[#FAF6F0] border-[#E6DCD2] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                  選擇專屬暖色系標籤
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewCatColor(c.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        newCatColor === c.id
                          ? 'ring-2 ring-[#E07A5F] bg-[#FAF6F0]'
                          : 'bg-[#FDFBF7] hover:bg-[#F5EFE6]'
                      }`}
                      style={{ borderColor: '#E6DCD2' }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE6D8]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6259] hover:bg-[#F5EFE6]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: '#E07A5F' }}
                >
                  建立分類
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          彈窗 3：確認對話框 (取代原生 confirm)
      ========================================== */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D352E]/40 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-3xl border p-6 shadow-xl"
            style={{ backgroundColor: '#FDFBF7', borderColor: '#E6DCD2' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FCEEE9', color: '#E07A5F' }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#3D352E]">{confirmDialog.title}</h3>
            </div>
            <p className="text-sm text-[#6E6259] leading-relaxed mb-5">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6E6259] hover:bg-[#F5EFE6]"
              >
                保留
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: '#E07A5F' }}
              >
                確定執行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          彈窗 4：React + Vite 專案結構與 Vercel 部署指南
      ========================================== */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D352E]/50 backdrop-blur-xs">
          <div
            className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#FDFBF7', borderColor: '#E6DCD2' }}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
            >
              <div className="flex items-center gap-2.5">
                <FileCode2 className="w-5 h-5 text-[#E07A5F]" />
                <div>
                  <h3 className="text-base font-bold text-[#3D352E]">
                    React + Vite 標準專案架構與 Vercel 部署指南
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    符合模組化生產環境標準，可直接建立本地專案並一鍵部署至 Vercel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6E6259] hover:bg-[#EAE0D2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* 步驟說明卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: '#FAF6F0', borderColor: '#E6DCD2' }}
                >
                  <div className="text-xs font-bold text-[#E07A5F] mb-1">STEP 01</div>
                  <div className="font-bold text-[#3D352E] mb-1">初始化 Vite + React 專案</div>
                  <p className="text-xs text-[#6E6259] leading-relaxed">
                    執行 <code className="bg-[#EFE6D8] px-1.5 py-0.5 rounded">npm create vite@latest warmflow -- --template react</code> 並安裝 <code className="bg-[#EFE6D8] px-1.5 py-0.5 rounded">lucide-react</code> 與 Tailwind CSS。
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: '#FAF6F0', borderColor: '#E6DCD2' }}
                >
                  <div className="text-xs font-bold text-[#E5A93C] mb-1">STEP 02</div>
                  <div className="font-bold text-[#3D352E] mb-1">配置模組化目錄與設定檔</div>
                  <p className="text-xs text-[#6E6259] leading-relaxed">
                    依照下方標準結構拆分為 <code className="bg-[#EFE6D8] px-1.5 py-0.5 rounded">components/</code>、<code className="bg-[#EFE6D8] px-1.5 py-0.5 rounded">hooks/</code> 與 <code className="bg-[#EFE6D8] px-1.5 py-0.5 rounded">vercel.json</code>。
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: '#FAF6F0', borderColor: '#E6DCD2' }}
                >
                  <div className="text-xs font-bold text-[#81B29A] mb-1">STEP 03</div>
                  <div className="font-bold text-[#3D352E] mb-1">部署至 Vercel 平台</div>
                  <p className="text-xs text-[#6E6259] leading-relaxed">
                    將專案推送至 GitHub 後，於 Vercel 匯入儲存庫，Framework Preset 自動識別為 <strong>Vite</strong>，點擊 Deploy 即可完成。
                  </p>
                </div>
              </div>

              {/* 1. 專案目錄樹 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#3D352E] flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#E07A5F]" />
                    標準 React + Vite 檔案目錄結構
                  </span>
                  <button
                    onClick={() => handleCopyCode('tree', ARCHITECTURE_DOCS.tree)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#E6DCD2] bg-[#FAF6F0] hover:bg-[#F5EFE6]"
                  >
                    {copiedKey === 'tree' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#81B29A]" />
                        <span>已複製</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>複製架構樹</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#3D352E] text-[#F5EFE6] text-xs overflow-x-auto leading-relaxed font-mono">
                  {ARCHITECTURE_DOCS.tree}
                </pre>
              </div>

              {/* 2. 設定檔展示 (package.json, vite.config.js, vercel.json) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#3D352E] text-xs">package.json</span>
                    <button
                      onClick={() => handleCopyCode('pkg', ARCHITECTURE_DOCS.packageJson)}
                      className="text-xs text-[#E07A5F] hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'pkg' ? '已複製！' : '複製內容'}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-[#3D352E] text-[#F5EFE6] text-xs overflow-x-auto font-mono">
                    {ARCHITECTURE_DOCS.packageJson}
                  </pre>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#3D352E] text-xs">vite.config.js</span>
                      <button
                        onClick={() => handleCopyCode('vite', ARCHITECTURE_DOCS.viteConfig)}
                        className="text-xs text-[#E07A5F] hover:underline"
                      >
                        {copiedKey === 'vite' ? '已複製！' : '複製內容'}
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-2xl bg-[#3D352E] text-[#F5EFE6] text-xs overflow-x-auto font-mono">
                      {ARCHITECTURE_DOCS.viteConfig}
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#3D352E] text-xs">vercel.json (SPA 部署設定)</span>
                      <button
                        onClick={() => handleCopyCode('vercel', ARCHITECTURE_DOCS.vercelJson)}
                        className="text-xs text-[#E07A5F] hover:underline"
                      >
                        {copiedKey === 'vercel' ? '已複製！' : '複製內容'}
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-2xl bg-[#3D352E] text-[#F5EFE6] text-xs overflow-x-auto font-mono">
                      {ARCHITECTURE_DOCS.vercelJson}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-3.5 border-t flex justify-end"
              style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
            >
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: '#E07A5F' }}
              >
                返回工作台
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 子元件 1：單一任務卡片 (TaskCard)
// ==========================================
function TaskCard({
  task,
  todayStr,
  getCategoryById,
  getColorObj,
  onToggleComplete,
  onToggleSubtask,
  onEdit,
  onDelete,
  compact = false,
}) {
  const category = getCategoryById(task.categoryId);
  const catColor = getColorObj(category.colorId);
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
  const isToday = task.dueDate === todayStr;

  const subtasks = task.subtasks || [];
  const completedSubCount = subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`group rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
        task.completed ? 'opacity-70 bg-[#F7F3EB]' : 'bg-[#FAF6F0]'
      }`}
      style={{
        borderColor: isOverdue ? '#F5D0C5' : '#EDE3D5',
      }}
    >
      <div className="flex items-start gap-3.5">
        {/* 完成勾選按鈕 */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 shrink-0 transition-transform active:scale-90"
          title={task.completed ? '標記為未完成' : '標記為已完成'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" style={{ color: '#81B29A' }} />
          ) : (
            <Circle className="w-5 h-5 text-[#C5B4A5] hover:text-[#E07A5F]" />
          )}
        </button>

        {/* 任務主要資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* 專案分類標籤 */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: catColor.bg,
                borderColor: catColor.border,
                color: catColor.text,
              }}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </span>

            {/* 優先級標籤 */}
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: priorityInfo.bg,
                borderColor: priorityInfo.border,
                color: priorityInfo.badgeText,
              }}
            >
              <Flag className="w-2.5 h-2.5" />
              <span>{priorityInfo.label}</span>
            </span>

            {/* 日期與時間標籤 */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isOverdue
                    ? 'bg-[#FCEEE9] text-[#B85439] font-semibold'
                    : isToday
                    ? 'bg-[#FDF6E7] text-[#9E6B10] font-semibold'
                    : 'bg-[#F0E9DF] text-[#7A6B5D]'
                }`}
              >
                <CalendarIcon className="w-2.5 h-2.5" />
                <span>
                  {isToday ? '今日' : task.dueDate}
                  {task.dueTime ? ` ${task.dueTime}` : ''}
                  {isOverdue ? ' (已逾期)' : ''}
                </span>
              </span>
            )}
          </div>

          {/* 標題 */}
          <h4
            className={`text-sm font-bold leading-snug break-words ${
              task.completed ? 'line-through text-[#8C7A6B]' : 'text-[#3D352E]'
            }`}
          >
            {task.title}
          </h4>

          {/* 詳細描述 */}
          {!compact && task.description && (
            <p className="text-xs text-[#6E6259] mt-1 leading-relaxed break-words">
              {task.description}
            </p>
          )}

          {/* 子任務清單 (Checklist) */}
          {subtasks.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#EAE0D2] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#8C7A6B] mb-1">
                <span>子任務進度</span>
                <span>
                  {completedSubCount} / {subtasks.length}
                </span>
              </div>
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onToggleSubtask(task.id, sub.id)}
                  className="flex items-center gap-2 text-xs py-0.5 cursor-pointer text-[#5A4E44] hover:text-[#3D352E]"
                >
                  {sub.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 shrink-0 text-[#81B29A]" />
                  ) : (
                    <Square className="w-3.5 h-3.5 shrink-0 text-[#B8A798]" />
                  )}
                  <span className={sub.completed ? 'line-through text-[#9C8B7A]' : ''}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右側編輯與刪除按鈕 */}
        <div className="flex items-center gap-1 shrink-0 opacity-85 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#3D352E] hover:bg-[#EFE6D8] transition-colors"
            title="編輯任務"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:text-[#E07A5F] hover:bg-[#FCEEE9] transition-colors"
            title="刪除任務"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 子元件 2：邏輯分組列表視圖 (TaskListView)
// ==========================================
function TaskListView({
  tasks,
  todayStr,
  getCategoryById,
  getColorObj,
  onToggleComplete,
  onToggleSubtask,
  onEdit,
  onDelete,
  onOpenCreate,
}) {
  // 依「今日與逾期焦點」、「即將到來」、「已完成歸檔」進行邏輯分組
  const groups = useMemo(() => {
    const todayAndOverdue = tasks.filter((t) => !t.completed && t.dueDate <= todayStr);
    const upcoming = tasks.filter((t) => !t.completed && t.dueDate > todayStr);
    const completed = tasks.filter((t) => t.completed);

    return [
      {
        id: 'focus',
        title: '☀️ 今日待辦與優先處理',
        subtitle: '專注完成眼前的溫暖小目標',
        items: todayAndOverdue,
        badgeBg: '#FCEEE9',
        badgeText: '#B85439',
      },
      {
        id: 'upcoming',
        title: '🗓️ 即將到來計畫',
        subtitle: '預先規劃未來的步調與靈感',
        items: upcoming,
        badgeBg: '#FDF6E7',
        badgeText: '#9E6B10',
      },
      {
        id: 'completed',
        title: '🌿 已完成項目',
        subtitle: '累積每一份踏實的成就感',
        items: completed,
        badgeBg: '#ECF4F0',
        badgeText: '#4E7D66',
      },
    ];
  }, [tasks, todayStr]);

  if (tasks.length === 0) {
    return (
      <div
        className="rounded-3xl border p-12 text-center my-4"
        style={{ backgroundColor: '#FAF6F0', borderColor: '#EDE3D5' }}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: '#FCEEE9', color: '#E07A5F' }}
        >
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#3D352E] mb-1">目前沒有符合條件的任務</h3>
        <p className="text-xs text-[#8C7A6B] mb-5">
          泡杯熱茶休息一下，或者點擊下方按鈕建立新的待辦事項吧！
        </p>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: '#E07A5F' }}
        >
          <Plus className="w-4 h-4" />
          <span>新增第一筆任務</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        if (group.items.length === 0) return null;
        return (
          <div key={group.id} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-bold text-[#3D352E] flex items-center gap-2">
                  <span>{group.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: group.badgeBg, color: group.badgeText }}
                  >
                    {group.items.length}
                  </span>
                </h3>
                <p className="text-xs text-[#8C7A6B]">{group.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {group.items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  todayStr={todayStr}
                  getCategoryById={getCategoryById}
                  getColorObj={getColorObj}
                  onToggleComplete={onToggleComplete}
                  onToggleSubtask={onToggleSubtask}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 子元件 3：看板分類視圖 (KanbanBoardView)
// ==========================================
function KanbanBoardView({
  tasks,
  categories,
  todayStr,
  getCategoryById,
  getColorObj,
  onToggleComplete,
  onToggleSubtask,
  onEdit,
  onDelete,
  onOpenCreate,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {categories.map((cat) => {
        const colorObj = getColorObj(cat.colorId);
        const catTasks = tasks.filter((t) => t.categoryId === cat.id);
        const pendingCount = catTasks.filter((t) => !t.completed).length;

        return (
          <div
            key={cat.id}
            className="rounded-3xl border p-4 flex flex-col gap-3"
            style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
          >
            {/* 欄位標頭 */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: colorObj.hex }}
                />
                <span className="text-base">{cat.icon}</span>
                <h3 className="text-sm font-bold text-[#3D352E] truncate">{cat.name}</h3>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: colorObj.bg,
                  color: colorObj.text,
                }}
              >
                {pendingCount} 待辦
              </span>
            </div>

            {/* 該分類任務卡片列表 */}
            <div className="space-y-2.5 min-h-[120px]">
              {catTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D8CBB8] p-6 text-center text-xs text-[#9C8B7A]">
                  尚無任務項目
                </div>
              ) : (
                catTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    todayStr={todayStr}
                    getCategoryById={getCategoryById}
                    getColorObj={getColorObj}
                    onToggleComplete={onToggleComplete}
                    onToggleSubtask={onToggleSubtask}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    compact={true}
                  />
                ))
              )}
            </div>

            {/* 快速新增該分類任務按鈕 */}
            <button
              onClick={() => onOpenCreate(cat.id)}
              className="w-full py-2 rounded-xl border border-dashed border-[#D5C7B4] text-xs font-semibold text-[#7A6B5D] hover:bg-[#FAF6F0] hover:text-[#E07A5F] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增「{cat.name}」任務</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 子元件 4：互動式月曆與單日待辦視圖 (CalendarMonthView)
// ==========================================
function CalendarMonthView({
  tasks,
  calendarDate,
  setCalendarDate,
  selectedDateStr,
  setSelectedDateStr,
  todayStr,
  getCategoryById,
  getColorObj,
  onToggleComplete,
  onToggleSubtask,
  onEdit,
  onDelete,
  onOpenCreateForDate,
}) {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  // 計算當月月曆網格 (42格)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];

    // 上個月尾端日期
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateObj = new Date(year, month - 1, d);
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dStr = String(dateObj.getDate()).padStart(2, '0');
      grid.push({
        dateStr: `${yStr}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    // 本月日期
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      grid.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: true,
      });
    }

    // 下個月開頭日期補齊 42 格 (6週)
    const remaining = 42 - grid.length;
    for (let d = 1; d <= remaining; d++) {
      const dateObj = new Date(year, month + 1, d);
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dStr = String(dateObj.getDate()).padStart(2, '0');
      grid.push({
        dateStr: `${yStr}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    return grid;
  }, [year, month]);

  // 依日期分組任務 Map
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [tasks]);

  const selectedDateTasks = tasksByDate[selectedDateStr] || [];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    const now = new Date();
    setCalendarDate(now);
    setSelectedDateStr(todayStr);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* 左側 2/3：月曆網格 */}
      <div
        className="lg:col-span-2 rounded-3xl border p-5 shadow-xs"
        style={{ backgroundColor: '#FAF6F0', borderColor: '#EDE3D5' }}
      >
        {/* 月曆控制標頭 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-[#3D352E]">
              {year} 年 {month + 1} 月
            </h3>
            <button
              onClick={handleGoToday}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E6DCD2] bg-[#FDFBF7] text-[#E07A5F] hover:bg-[#F5EFE6]"
            >
              回到今日
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-[#E6DCD2] bg-[#FDFBF7] hover:bg-[#F5EFE6] text-[#6E6259]"
              title="上個月"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-[#E6DCD2] bg-[#FDFBF7] hover:bg-[#F5EFE6] text-[#6E6259]"
              title="下個月"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 星期標頭 */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((d, idx) => (
            <div
              key={d}
              className={`text-xs font-bold py-1.5 ${
                idx === 0 || idx === 6 ? 'text-[#E07A5F]' : 'text-[#8C7A6B]'
              }`}
            >
              週{d}
            </div>
          ))}
        </div>

        {/* 42 格日期網格 */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((cell) => {
            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isSelected = selectedDateStr === cell.dateStr;
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[82px] sm:min-h-[96px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-[#E07A5F] bg-[#FDFBF7] border-[#E07A5F]'
                    : cell.isCurrentMonth
                    ? 'bg-[#FDFBF7] border-[#EDE3D5] hover:border-[#D9C8B4]'
                    : 'bg-[#F5EFE6]/60 border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isToday
                        ? 'bg-[#E07A5F] text-white'
                        : isSelected
                        ? 'text-[#E07A5F]'
                        : 'text-[#3D352E]'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#8C7A6B] px-1">
                      {dayTasks.length}件
                    </span>
                  )}
                </div>

                {/* 任務迷你標籤列表 */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((t) => {
                    const cat = getCategoryById(t.categoryId);
                    const cObj = getColorObj(cat.colorId);
                    return (
                      <div
                        key={t.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium ${
                          t.completed ? 'line-through opacity-60 bg-[#EAE0D2]' : ''
                        }`}
                        style={
                          !t.completed
                            ? {
                                backgroundColor: cObj.bg,
                                color: cObj.text,
                              }
                            : { color: '#6E6259' }
                        }
                      >
                        {t.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] text-[#8C7A6B] pl-1 font-medium">
                      +{dayTasks.length - 2} 項更多
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右側 1/3：選中日期的單日任務檢視與快速新增面板 */}
      <div
        className="rounded-3xl border p-5 space-y-4"
        style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
      >
        <div className="flex items-center justify-between border-b border-[#E6DCD2] pb-3">
          <div>
            <span className="text-xs font-semibold text-[#E07A5F]">單日行程與待辦</span>
            <h4 className="text-base font-bold text-[#3D352E] mt-0.5">
              {selectedDateStr === todayStr ? `${selectedDateStr} (今日)` : selectedDateStr}
            </h4>
          </div>
          <button
            onClick={() => onOpenCreateForDate(selectedDateStr)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
            style={{ backgroundColor: '#E07A5F' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增當日任務</span>
          </button>
        </div>

        {selectedDateTasks.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#6E6259]">這天還沒有安排任務</p>
            <p className="text-xs text-[#8C7A6B]">
              點擊上方「新增當日任務」為這天排入計畫吧！
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {selectedDateTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                todayStr={todayStr}
                getCategoryById={getCategoryById}
                getColorObj={getColorObj}
                onToggleComplete={onToggleComplete}
                onToggleSubtask={onToggleSubtask}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 子元件 5：任務新增與編輯表單彈窗 (TaskFormModal)
// ==========================================
function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
  categories,
  defaultDate,
  defaultCategoryId,
}) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [categoryId, setCategoryId] = useState(
    initialTask?.categoryId || defaultCategoryId || categories[0]?.id
  );
  const [priority, setPriority] = useState(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || defaultDate);
  const [dueTime, setDueTime] = useState(initialTask?.dueTime || '18:00');
  const [completed, setCompleted] = useState(initialTask?.completed || false);
  const [subtasks, setSubtasks] = useState(initialTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      priority,
      dueDate,
      dueTime,
      completed,
      subtasks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D352E]/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FDFBF7', borderColor: '#E6DCD2' }}
      >
        {/* 彈窗頂部 */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: '#F5EFE6', borderColor: '#E6DCD2' }}
        >
          <h3 className="text-base font-bold text-[#3D352E] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E07A5F]" />
            <span>{initialTask ? '編輯任務內容' : '建立溫暖新任務'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C7A6B] hover:bg-[#EAE0D2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表單內容 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* 任務標題 */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
              任務標題 <span className="text-[#E07A5F]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="輸入要完成的任務名稱..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
              style={{ borderColor: '#E6DCD2' }}
            />
          </div>

          {/* 任務詳細描述 */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
              詳細描述與備註
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="記錄靈感、執行細節或注意事項..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
              style={{ borderColor: '#E6DCD2' }}
            />
          </div>

          {/* 所屬分類與優先級 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                所屬專案分類
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none"
                style={{ borderColor: '#E6DCD2' }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                優先級程度
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setPriority(key)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      priority === key ? 'ring-2 ring-[#E07A5F] shadow-xs' : 'opacity-75'
                    }`}
                    style={{
                      backgroundColor: cfg.bg,
                      borderColor: cfg.border,
                      color: cfg.badgeText,
                    }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 截止日期與時間 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                預計完成日期
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none"
                style={{ borderColor: '#E6DCD2' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
                提醒時間
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none"
                style={{ borderColor: '#E6DCD2' }}
              />
            </div>
          </div>

          {/* 子任務檢查清單 (Checklist) */}
          <div>
            <label className="block text-xs font-semibold text-[#6E6259] mb-1.5">
              子任務步驟清單 (Checklist)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="新增具體執行小步驟（按 Enter 快速加入）"
                className="flex-1 px-3 py-2 text-xs rounded-xl border bg-[#FAF6F0] text-[#3D352E] focus:outline-none"
                style={{ borderColor: '#E6DCD2' }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F5EFE6] text-[#3D352E] hover:bg-[#EAE0D2] border border-[#E6DCD2]"
              >
                加入步驟
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EDE3D5]">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#FDFBF7]"
                  >
                    <span className="text-[#3D352E]">{sub.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-[#A69688] hover:text-[#E07A5F]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 完成狀態切換 */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 accent-[#81B29A] rounded"
              />
              <span className="text-xs font-semibold text-[#5A4E44]">
                將此任務直接標記為「已完成」狀態
              </span>
            </label>
          </div>

          {/* 底部儲存與取消按鈕 */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#EFE6D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6E6259] hover:bg-[#F5EFE6]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-95"
              style={{ backgroundColor: '#E07A5F' }}
            >
              {initialTask ? '儲存變更' : '建立任務'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}