"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconBell, IconX } from "@/components/icons";
import { useDictionary } from "@/i18n";

/**
 * Notification item shape.
 */
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

/**
 * NotificationDropdown — bell icon with unread count badge and dropdown panel.
 */
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dict } = useDictionary();

  // Placeholder notifications — replace with real data later
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: dict.notifications.welcomeTitle,
      message: dict.notifications.welcomeMessage,
      time: dict.notifications.justNow,
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: dict.notifications.completeProfileTitle,
      message: dict.notifications.completeProfileMessage,
      time: dict.notifications.minutesAgo.replace("{count}", "5"),
      read: false,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Click outside to close
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const typeColors: Record<Notification["type"], string> = {
    info: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        aria-label={dict.notifications.title}
      >
        <IconBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {dict.notifications.title}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {dict.notifications.markAllRead}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <IconBell size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">
                  {dict.notifications.noNotifications}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {dict.notifications.allCaughtUp}
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                      !n.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Type indicator */}
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeColors[n.type]}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {n.time}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(n.id);
                      }}
                      className="mt-0.5 hidden rounded p-0.5 text-slate-400 hover:text-slate-600 group-hover:block"
                      aria-label={dict.common.close}
                    >
                      <IconX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                {dict.notifications.viewAll}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
