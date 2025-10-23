import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components';
import { Badge } from '@/components';
import { useAllTasks } from '@/hooks';
import { Task, TaskStatus, TaskCategory } from '@/domain-models';
import { cn } from '@/lib/cn';

interface MetricsData {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  averageHours: number;
  overdueTasks: number;
}

const COLORS = {
  primary: '#2563eb',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
  secondary: '#6b7280',
  development: '#3b82f6',
  design: '#8b5cf6',
  testing: '#10b981',
  documentation: '#f59e0b',
  meeting: '#ef4444',
  research: '#6366f1',
  bugFix: '#ec4899',
  feature: '#14b8a6',
};

export const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7days' | '30days' | 'all'>('30days');

  const {
    tasks,
    loading,
    error,
    fetchTasks,
  } = useAllTasks({
    page: 1,
    pageSize: 1000, // Get all tasks for dashboard analytics
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate metrics
  const metrics = useMemo((): MetricsData => {
    if (!tasks.length) return {
      totalTasks: 0,
      openTasks: 0,
      completedTasks: 0,
      averageHours: 0,
      overdueTasks: 0,
    };

    const openTasks = tasks.filter(task =>
      task.status === TaskStatus.TODO || task.status === TaskStatus.IN_PROGRESS
    ).length;

    const completedTasks = tasks.filter(task =>
      task.status === TaskStatus.COMPLETED
    ).length;

    const overdueTasks = tasks.filter(task =>
      new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
    ).length;

    const averageHours = tasks.reduce((sum, task) =>
      sum + task.estimatedHours, 0) / tasks.length;

    return {
      totalTasks: tasks.length,
      openTasks,
      completedTasks,
      averageHours: Math.round(averageHours * 10) / 10,
      overdueTasks,
    };
  }, [tasks]);

  // Prepare chart data
  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};

    tasks.forEach(task => {
      categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category.replace('_', ' '),
      value: count,
      color: COLORS[category.toLowerCase() as keyof typeof COLORS] || COLORS.secondary,
    }));
  }, [tasks]);

  const statusData = useMemo(() => {
    const statusCount: Record<string, number> = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
      [TaskStatus.OVERDUE]: 0,
    };

    tasks.forEach(task => {
      statusCount[task.status] = (statusCount[task.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.replace('_', ' '),
      value: count,
      color:
        status === TaskStatus.COMPLETED ? COLORS.success :
        status === TaskStatus.OVERDUE ? COLORS.danger :
        status === TaskStatus.IN_PROGRESS ? COLORS.warning :
        COLORS.primary,
    }));
  }, [tasks]);

  // Recent activities (last 5 tasks)
  const recentTasks = useMemo(() => {
    return tasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error loading dashboard</div>
          <div className="text-gray-500 mb-4">{String(error)}</div>
          <button
            onClick={() => fetchTasks()}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const MetricCard = ({ title, value, subtitle, trend, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
    color: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={cn("text-2xl font-bold", color)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center text-sm mt-2",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-opacity-10", color.replace('text-', 'bg-'))}>
          <div className={cn("w-6 h-6", color)}></div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your tasks and productivity</p>
        </div>

        {/* Time Range Selector */}
        <div className="mt-4 sm:mt-0 flex rounded-lg border border-gray-200 overflow-hidden">
          {(['7days', '30days', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                selectedTimeRange === range
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tasks"
          value={metrics.totalTasks}
          color="text-primary-600"
        />
        <MetricCard
          title="Open Tasks"
          value={metrics.openTasks}
          subtitle={`${Math.round((metrics.openTasks / metrics.totalTasks) * 100)}% of total`}
          color="text-yellow-600"
        />
        <MetricCard
          title="Completed"
          value={metrics.completedTasks}
          subtitle={`${Math.round((metrics.completedTasks / metrics.totalTasks) * 100)}% completion rate`}
          color="text-green-600"
        />
        <MetricCard
          title="Average Hours"
          value={metrics.averageHours}
          subtitle="per task"
          color="text-blue-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Category */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Tasks by Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: status.color }}
                ></div>
                <span className="capitalize">{status.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {recentTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 truncate">
                      {task.title}
                    </h3>
                    <Badge variant={
                      task.status === TaskStatus.COMPLETED ? 'success' :
                      task.status === TaskStatus.OVERDUE ? 'danger' :
                      task.status === TaskStatus.IN_PROGRESS ? 'secondary' : 'ghost'
                    }>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500 space-x-4">
                    <span>Category: {task.category.replace('_', ' ')}</span>
                    <span>Assigned to: {task.assignedTo}</span>
                    <span>Est. {task.estimatedHours}h</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Updated {new Date(task.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};