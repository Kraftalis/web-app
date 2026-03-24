/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// ─── Push Notification Handling ─────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json() as {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      url?: string;
      tag?: string;
    };

    event.waitUntil(
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192x192.png",
        badge: payload.badge ?? "/icons/icon-96x96.png",
        tag: payload.tag,
        data: { url: payload.url ?? "/" },
      }),
    );
  } catch {
    // Fallback for plain text
    event.waitUntil(
      self.registration.showNotification("Kraftalis", {
        body: event.data.text(),
        icon: "/icons/icon-192x192.png",
      }),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data?.url as string) ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if open
        for (const client of clients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        return self.clients.openWindow(url);
      }),
  );
});
