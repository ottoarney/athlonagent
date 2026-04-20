import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface Subtask {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending" | "need-help" | "failed";
}

interface Task {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending" | "need-help" | "failed";
  subtasks: Subtask[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Athlete obligations board",
    status: "in-progress",
    subtasks: [
      {
        id: "1.1",
        title: "Load active obligations",
        status: "completed",
      },
      {
        id: "1.2",
        title: "Flag next 14-day deadlines",
        status: "in-progress",
      },
    ],
  },
  {
    id: "2",
    title: "Deal flow pipeline",
    status: "pending",
    subtasks: [
      {
        id: "2.1",
        title: "Qualify new brand opportunities",
        status: "pending",
      },
      {
        id: "2.2",
        title: "Track term sheet revisions",
        status: "pending",
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

  const prefersReducedMotion = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    [],
  );

  const taskVariants = {
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

  const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      height: "auto",
      opacity: 1,
      overflow: "visible",
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
      overflow: "hidden",
      transition: {
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const subtaskVariants = {
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

  const statusBadgeVariants = {
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
    <div className="h-full min-h-[520px] overflow-auto rounded-2xl border border-border/70 bg-card p-2 text-foreground shadow-sm">
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
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                            ) : task.status === "in-progress" ? (
                              <CircleDotDashed className="h-4 w-4 text-accent" />
                            ) : task.status === "need-help" ? (
                              <CircleAlert className="h-4 w-4 text-warning" />
                            ) : task.status === "failed" ? (
                              <CircleX className="h-4 w-4 text-destructive" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      <motion.div className="flex min-w-0 flex-grow cursor-pointer items-center justify-between" onClick={() => toggleTaskExpansion(task.id)}>
                        <div className="mr-2 flex-1 truncate">
                          <span className={isCompleted ? "text-muted-foreground line-through" : ""}>{task.title}</span>
                        </div>

                        <div className="flex flex-shrink-0 items-center text-xs">
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
                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-6"
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
