"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion, type Variants } from "framer-motion";

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "need-help" | "failed";
  priority: "high" | "medium" | "low";
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "need-help" | "failed";
  priority: "high" | "medium" | "low";
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Athlete obligations dashboard",
    description: "Centralize contracts, appearances, NIL activations, and renewal obligations.",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Import active athlete obligations",
        description: "Pull signed deal obligations and upcoming commitments for each athlete.",
        status: "completed",
        priority: "high",
        tools: ["contracts", "athlete-records"],
      },
      {
        id: "1.2",
        title: "Flag compliance deadlines",
        description: "Surface deliverables due in the next 14 days so nothing gets missed.",
        status: "in-progress",
        priority: "high",
        tools: ["deadline-rules", "calendar"],
      },
      {
        id: "1.3",
        title: "Escalate blocked obligations",
        description: "Highlight dependencies that need athlete, brand, or legal follow-up.",
        status: "need-help",
        priority: "medium",
        tools: ["task-routing", "notifications"],
      },
    ],
  },
  {
    id: "2",
    title: "Deal flow pipeline",
    description: "Track opportunities from outreach to terms, approvals, and signature.",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "2.1",
        title: "Qualify new partnership opportunities",
        description: "Score opportunities by fit, revenue potential, and brand alignment.",
        status: "pending",
        priority: "high",
        tools: ["deal-scoring", "agency-notes"],
      },
      {
        id: "2.2",
        title: "Track term sheet revisions",
        description: "Keep version history visible to agents, coordinators, and legal contacts.",
        status: "pending",
        priority: "medium",
        tools: ["version-history", "contracts"],
      },
      {
        id: "2.3",
        title: "Prepare signing checklist",
        description: "Confirm deliverables, billing terms, and kickoff dates before close.",
        status: "pending",
        priority: "high",
        tools: ["checklists", "approvals"],
      },
    ],
  },
  {
    id: "3",
    title: "Agency operations calendar",
    description: "Coordinate travel, media, content shoots, and internal priorities in one view.",
    status: "pending",
    priority: "high",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [
      {
        id: "3.1",
        title: "Sync athlete and staff calendars",
        description: "Unify schedules across reps, athletes, and support staff.",
        status: "pending",
        priority: "high",
        tools: ["calendar-sync", "availability"],
      },
      {
        id: "3.2",
        title: "Set reminder windows",
        description: "Create pre-event reminders for prep, travel, and deliverable due dates.",
        status: "pending",
        priority: "medium",
        tools: ["alerts", "timeline"],
      },
      {
        id: "3.3",
        title: "Review weekly execution board",
        description: "Run Monday ops reviews with live status across every athlete.",
        status: "pending",
        priority: "medium",
        tools: ["ops-board"],
      },
    ],
  },
];

const statusCycle: Task["status"][] = ["completed", "in-progress", "pending", "need-help", "failed"];

const statusClassName: Record<Task["status"], string> = {
  completed: "bg-accent/15 text-foreground border border-accent/30",
  "in-progress": "bg-accent/10 text-foreground border border-accent/25",
  pending: "bg-muted text-muted-foreground border border-border",
  "need-help": "bg-warning/10 text-foreground border border-warning/25",
  failed: "bg-destructive/10 text-foreground border border-destructive/25",
};

export default function Plan() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  const prefersReducedMotion = useReducedMotion();

  const taskVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
      transition: { duration: 0.15 },
    },
  };

  const subtaskListVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.25,
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren",
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const subtaskVariants: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
      transition: { duration: 0.15 },
    },
  };

  const subtaskDetailsVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.25,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const statusBadgeVariants: Variants = {
    initial: { scale: 1 },
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextStatus = statusCycle[Math.floor(Math.random() * statusCycle.length)];
        const updatedSubtasks = task.subtasks.map((subtask) => ({
          ...subtask,
          status: nextStatus === "completed" ? "completed" : subtask.status,
        }));

        return {
          ...task,
          status: nextStatus,
          subtasks: updatedSubtasks,
        };
      }),
    );
  };

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask.id !== subtaskId) return subtask;
          const newStatus = subtask.status === "completed" ? "pending" : "completed";
          return { ...subtask, status: newStatus };
        });

        return {
          ...task,
          subtasks: updatedSubtasks,
          status: updatedSubtasks.every((s) => s.status === "completed") ? "completed" : task.status,
        };
      }),
    );
  };

  return (
    <div className="h-full overflow-auto rounded-2xl border border-border/70 bg-card p-2 text-foreground shadow-sm">
      <motion.div
        className="overflow-hidden rounded-xl border border-accent/20 bg-background"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        }}
      >
        <LayoutGroup>
          <div className="overflow-hidden p-4">
            <ul className="space-y-1 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li key={task.id} className={index !== 0 ? "mt-1 pt-2" : ""} initial="hidden" animate="visible" variants={taskVariants}>
                    <motion.div
                      className="group flex items-center rounded-md px-3 py-1.5"
                      whileHover={{
                        backgroundColor: "rgba(1, 251, 100, 0.08)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.div
                        className="mr-2 flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{ duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-[18px] w-[18px] text-accent" />
                            ) : task.status === "in-progress" ? (
                              <CircleDotDashed className="h-[18px] w-[18px] text-accent" />
                            ) : task.status === "need-help" ? (
                              <CircleAlert className="h-[18px] w-[18px] text-warning" />
                            ) : task.status === "failed" ? (
                              <CircleX className="h-[18px] w-[18px] text-destructive" />
                            ) : (
                              <Circle className="h-[18px] w-[18px] text-muted-foreground" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-2 flex-1 truncate">
                          <span className={isCompleted ? "text-muted-foreground line-through" : ""}>{task.title}</span>
                        </div>

                        <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                          {task.dependencies.length > 0 && (
                            <div className="mr-2 flex items-center">
                              <div className="flex flex-wrap gap-1">
                                {task.dependencies.map((dep, idx) => (
                                  <motion.span
                                    key={dep}
                                    className="rounded border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                  >
                                    depends on {dep}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          <motion.span
                            className={`rounded px-1.5 py-0.5 ${statusClassName[task.status]}`}
                            variants={statusBadgeVariants}
                            initial="initial"
                            animate="animate"
                            key={task.status}
                          >
                            {task.status}
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div className="relative overflow-hidden" variants={subtaskListVariants} initial="hidden" animate="visible" exit="hidden" layout>
                          <div className="absolute bottom-0 left-[20px] top-0 border-l-2 border-dashed border-accent/30" />
                          <ul className="border-muted mb-1.5 ml-3 mr-2 mt-1 space-y-0.5">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`;
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-6"
                                  onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <motion.div
                                    className="flex flex-1 items-center rounded-md p-1"
                                    whileHover={{
                                      backgroundColor: "rgba(1, 251, 100, 0.08)",
                                      transition: { duration: 0.2 },
                                    }}
                                    layout
                                  >
                                    <motion.div
                                      className="mr-2 flex-shrink-0 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSubtaskStatus(task.id, subtask.id);
                                      }}
                                      whileTap={{ scale: 0.9 }}
                                      whileHover={{ scale: 1.1 }}
                                      layout
                                    >
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={subtask.status}
                                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                          transition={{ duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                                        >
                                          {subtask.status === "completed" ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                                          ) : subtask.status === "in-progress" ? (
                                            <CircleDotDashed className="h-3.5 w-3.5 text-accent" />
                                          ) : subtask.status === "need-help" ? (
                                            <CircleAlert className="h-3.5 w-3.5 text-warning" />
                                          ) : subtask.status === "failed" ? (
                                            <CircleX className="h-3.5 w-3.5 text-destructive" />
                                          ) : (
                                            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                                          )}
                                        </motion.div>
                                      </AnimatePresence>
                                    </motion.div>

                                    <span className={`cursor-pointer text-sm ${subtask.status === "completed" ? "text-muted-foreground line-through" : ""}`}>
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence mode="wait">
                                    {isSubtaskExpanded && (
                                      <motion.div
                                        className="text-muted-foreground mt-1 ml-1.5 overflow-hidden border-l border-dashed border-accent/30 pl-5 text-xs"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mb-1 mt-0.5 flex flex-wrap items-center gap-1.5">
                                            <span className="font-medium text-muted-foreground">Workstreams:</span>
                                            <div className="flex flex-wrap gap-1">
                                              {subtask.tools.map((tool, idx) => (
                                                <motion.span
                                                  key={tool}
                                                  className="rounded border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm"
                                                  initial={{ opacity: 0, y: -5 }}
                                                  animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                      duration: 0.2,
                                                      delay: idx * 0.05,
                                                    },
                                                  }}
                                                >
                                                  {tool}
                                                </motion.span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
