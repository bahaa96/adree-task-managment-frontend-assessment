export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    
    // Task statuses
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    OVERDUE: 'Overdue',
    
    // Task categories
    DEVELOPMENT: 'Development',
    DESIGN: 'Design',
    TESTING: 'Testing',
    DOCUMENTATION: 'Documentation',
    MEETING: 'Meeting',
    RESEARCH: 'Research',
    BUG_FIX: 'Bug Fix',
    FEATURE: 'Feature',
    
    // Dashboard
    totalTasks: 'Total Tasks',
    openTasks: 'Open Tasks',
    closedTasks: 'Closed Tasks',
    averageHours: 'Avg Hours',
    overdueTasks: 'Overdue Tasks',
    tasksByCategory: 'Tasks by Category',
    tasksByStatus: 'Tasks by Status',
    recentActivity: 'Recent Activity',
    
    // Tasks page
    createTask: 'Create Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    searchTasks: 'Search tasks...',
    filterByStatus: 'Filter by Status',
    filterByCategory: 'Filter by Category',
    sortBy: 'Sort By',
    noTasksFound: 'No tasks found',
    
    // Form fields
    title: 'Title',
    description: 'Description',
    dueDate: 'Due Date',
    assignedTo: 'Assigned To',
    status: 'Status',
    category: 'Category',
    estimatedHours: 'Estimated Hours',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    confirmDelete: 'Are you sure you want to delete this task?',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    
    // Language
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    
    // Task statuses
    TODO: 'للإنجاز',
    IN_PROGRESS: 'قيد التنفيذ',
    COMPLETED: 'مكتمل',
    OVERDUE: 'متأخر',
    
    // Task categories
    DEVELOPMENT: 'تطوير',
    DESIGN: 'تصميم',
    TESTING: 'اختبار',
    DOCUMENTATION: 'توثيق',
    MEETING: 'اجتماع',
    RESEARCH: 'بحث',
    BUG_FIX: 'إصلاح خطأ',
    FEATURE: 'ميزة',
    
    // Dashboard
    totalTasks: 'إجمالي المهام',
    openTasks: 'المهام المفتوحة',
    closedTasks: 'المهام المكتملة',
    averageHours: 'متوسط الساعات',
    overdueTasks: 'المهام المتأخرة',
    tasksByCategory: 'المهام حسب الفئة',
    tasksByStatus: 'المهام حسب الحالة',
    recentActivity: 'النشاط الأخير',
    
    // Tasks page
    createTask: 'إنشاء مهمة',
    editTask: 'تعديل المهمة',
    deleteTask: 'حذف المهمة',
    searchTasks: 'البحث في المهام...',
    filterByStatus: 'تصفية حسب الحالة',
    filterByCategory: 'تصفية حسب الفئة',
    sortBy: 'ترتيب حسب',
    noTasksFound: 'لم يتم العثور على مهام',
    
    // Form fields
    title: 'العنوان',
    description: 'الوصف',
    dueDate: 'تاريخ الاستحقاق',
    assignedTo: 'مُسند إلى',
    status: 'الحالة',
    category: 'الفئة',
    estimatedHours: 'الساعات المقدرة',
    
    // Actions
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    confirmDelete: 'هل أنت متأكد من حذف هذه المهمة؟',
    
    // Validation
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'عنوان بريد إلكتروني غير صالح',
    
    // Language
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
