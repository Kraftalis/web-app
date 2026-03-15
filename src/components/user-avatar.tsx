"use client";

/**
 * UserAvatar — displays a user's profile image or initials fallback.
 * Uses a plain <img> for external URLs to avoid next/image hostname
 * validation errors during client-side navigations.
 */

interface UserAvatarProps {
  src: string | null | undefined;
  name: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  src,
  name,
  size = 32,
  className = "",
}: UserAvatarProps) {
  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={name ?? "User"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white ${className}`}
      style={{ width: size, height: size }}
    >
      {name?.charAt(0).toUpperCase() ?? "U"}
    </div>
  );
}
