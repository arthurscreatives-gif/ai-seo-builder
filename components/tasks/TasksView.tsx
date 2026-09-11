'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Task, TaskPriority, TaskStatus, IssueCategory } from '@/lib/types';
import {
  CheckSquare,
  Plus,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Code,
  Sparkles,
  X,
  Clock,
} from 'lucide-react';

interface TasksViewProps {
  onAskLoveBrain: (prompt: string) => void;
}

export function TasksView({ onAskLoveBrain }: TasksViewProps) {
  const {
    activeWebsite,
    activeWorkspace,
    tasksForActiveWebsite,
    createTask,
    updateTaskStatus,
    state,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Task Creation Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newCategory, setNewCategory] = useState<IssueCategory>('On-Page SEO');
  const [newOwner, setNewOwner] = useState(state.user.name);
  const [newDueDate, setNewDueDate] = useState(() =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Dismissal Modal State
  const [dismissingTask, setDismissingTask] = useState<Task | null>(null);
  const [dismissReason, setDismissReason] = useState<string>('Accepted Risk');
  const [dismissNotes, setDismissNotes] = useState('');

  // Selected Task Drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const statuses: TaskStatus[] = ['Open', 'In Progress', 'Awaiting Review', 'Completed', 'Dismissed'];

  const filteredTasks = tasksForActiveWebsite.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTask({
      workspaceId: state.activeWorkspaceId,
      websiteId: activeWebsite?.id || 'site-001',
      title: newTitle,
      description: newDesc || 'User created improvement task.',
      affectedUrl: newUrl || `https://${activeWebsite?.domain || 'arthurscreatives.com'}`,
      priority: newPriority,
      category: newCategory,
      owner: newOwner,
      dueDate: newDueDate,
      status: 'Open',
      suggestedFix: 'Implement according to SEO standard.',
    });

    setCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
  };

  const handleConfirmDismiss = () => {
    if (!dismissingTask) return;
    updateTaskStatus(dismissingTask.id, 'Dismissed', dismissReason, dismissNotes);
    setDismissingTask(null);
    setDismissNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111738] border border-[#1E2554] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white tracking-tight">Task Execution Board</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live Progress Tracking
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Prioritized tasks linked to exact crawl evidence, owner assignments, and mandatory dismissal reasoning.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-[#161D44] p-1 rounded-xl border border-[#252E63]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-[#D4AF37] text-[#111738]' : 'text-slate-400 hover:text-white'
              }`}
              title="Filterable Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2b] text-[#111738] font-bold text-xs flex items-center gap-1.5 transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111738] border border-[#1E2554] p-4 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#161D44] border border-[#252E63] text-white rounded px-2 py-1 text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#161D44] border border-[#252E63] text-white rounded px-2 py-1 text-xs"
            >
              <option value="all">All Categories</option>
              <option value="Crawlability">Crawlability</option>
              <option value="On-Page SEO">On-Page SEO</option>
              <option value="Headings & Content">Headings & Content</option>
              <option value="Structured Data">Structured Data</option>
              <option value="Local SEO">Local SEO</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400">
          Showing <strong className="text-white">{filteredTasks.length}</strong> tasks for {activeWebsite?.domain}
        </div>
      </div>

      {/* Main View: Kanban or Table */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => {
            const tasksInCol = filteredTasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="bg-[#111738] border border-[#1E2554] rounded-2xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2554]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{status}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#161D44] border border-[#252E63] text-slate-300 font-bold">
                    {tasksInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {tasksInCol.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3.5 rounded-xl bg-[#161D44] border border-[#252E63] hover:border-[#D4AF37]/60 transition cursor-pointer space-y-2 group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            task.priority === 'Critical'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : task.priority === 'High'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.dueDate.slice(5)}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition line-clamp-2">
                        {task.title}
                      </h4>

                      <div className="text-[10px] text-slate-400 truncate max-w-full font-mono">
                        {task.affectedUrl}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#252E63]/60 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {task.owner.split(' ')[0]}
                        </span>

                        {/* Quick status stepper */}
                        {status === 'Open' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(task.id, 'In Progress');
                            }}
                            className="text-[#4DA3FF] hover:underline"
                          >
                            Start →
                          </button>
                        )}
                        {status === 'In Progress' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(task.id, 'Completed');
                            }}
                            className="text-emerald-400 hover:underline"
                          >
                            Done ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {tasksInCol.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-500 italic">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#111738] border border-[#1E2554] rounded-2xl p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E2554] text-slate-400 text-[11px]">
                <th className="py-3 px-3 font-semibold">Priority</th>
                <th className="py-3 px-3 font-semibold">Task Title</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Affected Asset</th>
                <th className="py-3 px-3 font-semibold">Assignee</th>
                <th className="py-3 px-3 font-semibold">Due Date</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2554]">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-[#161D44]/50 transition cursor-pointer" onClick={() => setSelectedTask(t)}>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        t.priority === 'Critical'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : t.priority === 'High'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{t.title}</td>
                  <td className="py-3 px-3 text-slate-300">{t.category}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">{t.affectedUrl}</td>
                  <td className="py-3 px-3 text-slate-300">{t.owner}</td>
                  <td className="py-3 px-3 text-slate-400">{t.dueDate}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#161D44] border border-[#252E63] text-slate-200">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDismissingTask(t);
                      }}
                      className="text-slate-400 hover:text-red-400 text-xs"
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Details Drawer Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#252E63]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                    selectedTask.priority === 'Critical'
                      ? 'bg-red-500/15 text-red-400 border-red-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {selectedTask.priority}
                </span>
                <span className="text-slate-400">{selectedTask.category}</span>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{selectedTask.title}</h3>

            <div className="p-3 rounded-lg bg-[#0E132D] border border-[#252E63] space-y-1">
              <div className="text-slate-400 font-semibold">Affected Page / Asset:</div>
              <div className="text-white font-mono">{selectedTask.affectedUrl}</div>
            </div>

            {selectedTask.supportingEvidence && (
              <div className="p-3 rounded-lg bg-[#111738] border border-[#1E2554] space-y-1">
                <div className="font-semibold text-[#D4AF37]">Supporting Crawl Evidence:</div>
                <p className="text-slate-300 font-mono text-[11px]">{selectedTask.supportingEvidence}</p>
              </div>
            )}

            {selectedTask.suggestedFix && (
              <div>
                <div className="font-semibold text-white mb-1">Recommended Implementation:</div>
                <p className="text-slate-300 leading-relaxed">{selectedTask.suggestedFix}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400 border-t border-[#252E63]">
              <div>Assignee: <strong className="text-white">{selectedTask.owner}</strong></div>
              <div>Due Date: <strong className="text-white">{selectedTask.dueDate}</strong></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onAskLoveBrain(`Generate developer fix code for task: ${selectedTask.title}`);
                  setSelectedTask(null);
                }}
                className="text-[#4DA3FF] hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask LOVE Brain to solve
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDismissingTask(selectedTask);
                    setSelectedTask(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#161D44] text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    updateTaskStatus(selectedTask.id, 'Completed');
                    setSelectedTask(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[#111738] font-bold"
                >
                  Mark Completed ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dismissal Reason Required Modal */}
      {dismissingTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Dismiss Task (Reason Required)</h3>
              <button onClick={() => setDismissingTask(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300">
              Please classify why <strong>&quot;{dismissingTask.title}&quot;</strong> is being dismissed:
            </p>

            <div>
              <label className="block text-slate-400 mb-1">Dismissal Reason:</label>
              <select
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg p-2 text-xs"
              >
                <option value="False Positive">False Positive (Rule does not apply)</option>
                <option value="Accepted Risk">Accepted Risk (Business trade-off)</option>
                <option value="Outside Scope">Outside Scope (Platform constraints)</option>
                <option value="Duplicate">Duplicate (Covered by another task)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Additional Notes:</label>
              <textarea
                rows={2}
                value={dismissNotes}
                onChange={(e) => setDismissNotes(e.target.value)}
                placeholder="Optional explanation for team audit logs..."
                className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDismissingTask(null)}
                className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDismiss}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Task Creation Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141B42] border border-[#252E63] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Create SEO Task
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomTask} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement schema.org LocalBusiness markup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Affected URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://arthurscreatives.com/services"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg px-3 py-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg px-2 py-1.5"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as IssueCategory)}
                    className="w-full bg-[#0E132D] border border-[#252E63] text-white rounded-lg px-2 py-1.5"
                  >
                    <option value="Crawlability">Crawlability</option>
                    <option value="On-Page SEO">On-Page SEO</option>
                    <option value="Headings & Content">Headings & Content</option>
                    <option value="Structured Data">Structured Data</option>
                    <option value="Local SEO">Local SEO</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#161D44] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111738] font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
