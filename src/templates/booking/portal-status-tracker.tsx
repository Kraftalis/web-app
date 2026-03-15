"use client";

import { Card, CardBody } from "@/components/ui";
import { IconCheck } from "@/components/icons";
import { EVENT_STATUS_STEPS } from "./types";

// ─── Status Tracker ─────────────────────────────────────────

interface PortalStatusTrackerProps {
  currentStatus: string;
  statusLabel: Record<string, string>;
  title: string;
}

export function PortalStatusTracker({
  currentStatus,
  statusLabel,
  title,
}: PortalStatusTrackerProps) {
  const currentIdx = EVENT_STATUS_STEPS.indexOf(
    currentStatus as (typeof EVENT_STATUS_STEPS)[number],
  );

  return (
    <Card>
      <CardBody className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">{title}</h2>

        {/* Desktop: horizontal stepper */}
        <div className="hidden sm:block">
          <div className="flex items-start justify-between">
            {EVENT_STATUS_STEPS.map((step, i) => {
              const isDone = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isUpcoming = i > currentIdx;

              return (
                <div
                  key={step}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  {/* Connector + circle */}
                  <div className="flex w-full items-center">
                    {/* Left connector */}
                    {i > 0 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          isDone || isCurrent ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                    {i === 0 && <div className="flex-1" />}

                    {/* Circle */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isDone
                          ? "bg-blue-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white ring-4 ring-blue-100"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isDone ? <IconCheck size={14} /> : <span>{i + 1}</span>}
                    </div>

                    {/* Right connector */}
                    {i < EVENT_STATUS_STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          isDone ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                    {i === EVENT_STATUS_STEPS.length - 1 && (
                      <div className="flex-1" />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-2 text-xs leading-tight ${
                      isUpcoming
                        ? "text-gray-400"
                        : isCurrent
                          ? "font-semibold text-blue-600"
                          : "font-medium text-gray-600"
                    }`}
                  >
                    {statusLabel[step] ?? step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical stepper */}
        <div className="sm:hidden">
          <div className="space-y-0">
            {EVENT_STATUS_STEPS.map((step, i) => {
              const isDone = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isLast = i === EVENT_STATUS_STEPS.length - 1;

              return (
                <div key={step} className="flex gap-3">
                  {/* Line + circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-blue-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white ring-4 ring-blue-100"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isDone ? <IconCheck size={12} /> : <span>{i + 1}</span>}
                    </div>
                    {!isLast && (
                      <div
                        className={`h-6 w-0.5 ${
                          isDone ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`pt-1 text-sm ${
                      isCurrent
                        ? "font-semibold text-blue-600"
                        : isDone
                          ? "font-medium text-gray-600"
                          : "text-gray-400"
                    }`}
                  >
                    {statusLabel[step] ?? step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
