"use client";

import { useState, useTransition } from "react";
import { AppLayout } from "@/components/layout";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Input,
} from "@/components/ui";
import UserAvatar from "@/components/user-avatar";
import {
  IconUser,
  IconMail,
  IconShield,
  IconCamera,
  IconEdit,
  IconCheck,
  IconCalendar,
} from "@/components/icons";
import { updateProfile } from "./actions";
import { useDictionary } from "@/i18n";

/**
 * User data shape for the profile page.
 */
interface ProfileUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  status: string;
  emailVerified: Date | null;
  createdAt: Date;
}

interface ProfileTemplateProps {
  user: ProfileUser;
}

export default function ProfileTemplate({ user }: ProfileTemplateProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { dict, locale } = useDictionary();

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: dict.profile.profileUpdated });
        setEditing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  const handleCancel = () => {
    setName(user.name ?? "");
    setEditing(false);
    setMessage(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(
      locale === "id" ? "id-ID" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success" as const;
      case "PENDING_VERIFICATION":
        return "warning" as const;
      case "SUSPENDED":
        return "danger" as const;
      default:
        return "default" as const;
    }
  };

  const topbarUser = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  return (
    <AppLayout
      user={topbarUser}
      title={dict.profile.title}
      contentContainerClassName="max-w-6xl pb-20"
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {dict.profile.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{dict.profile.subtitle}</p>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <IconCheck size={16} />
          ) : (
            <IconShield size={16} />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Left Column: Profile Card ──────────────────── */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center py-8">
              {/* Avatar */}
              <div className="group relative mb-4">
                <UserAvatar
                  src={user.image}
                  name={user.name}
                  size={96}
                  className="ring-4 ring-slate-100"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={dict.profile.changePhoto}
                  title={dict.profile.changePhoto}
                >
                  <IconCamera size={24} className="text-white" />
                </button>
              </div>

              {/* Name & Email */}
              <h2 className="text-lg font-semibold text-slate-900">
                {user.name || dict.profileDropdown.user}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>

              {/* Status & Role Badges */}
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={statusVariant(user.status)}>
                  {user.status.replace("_", " ")}
                </Badge>
                <Badge variant="info">{user.role}</Badge>
              </div>

              {/* Joined Date */}
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <IconCalendar size={14} />
                <span>
                  {dict.profile.joined} {formatDate(user.createdAt)}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ─── Right Column: Details & Edit ───────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader
              title={dict.profile.personalInfo}
              action={
                !editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <IconEdit size={14} />
                    {dict.common.edit}
                  </Button>
                ) : null
              }
            />
            <CardBody>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      {dict.profile.fullName}
                    </label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={dict.profile.enterFullName}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {dict.profile.emailAddress}
                    </label>
                    <Input value={user.email ?? ""} disabled />
                    <p className="mt-1 text-xs text-slate-400">
                      {dict.profile.emailCannotChange}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleSave}
                      isLoading={isPending}
                      size="sm"
                    >
                      {dict.profile.saveChanges}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isPending}
                    >
                      {dict.common.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <InfoRow
                    icon={<IconUser size={16} className="text-slate-400" />}
                    label={dict.profile.fullName}
                    value={user.name || "—"}
                  />
                  <InfoRow
                    icon={<IconMail size={16} className="text-slate-400" />}
                    label={dict.profile.emailAddress}
                    value={user.email || "—"}
                    extra={
                      user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <IconCheck size={12} />
                          {dict.profile.verified}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600">
                          {dict.profile.notVerified}
                        </span>
                      )
                    }
                  />
                  <InfoRow
                    icon={<IconShield size={16} className="text-slate-400" />}
                    label={dict.profile.role}
                    value={user.role}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader title={dict.profile.accountSecurity} />
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {dict.profile.password}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {dict.profile.passwordDesc}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    {dict.profile.changePassword}
                  </Button>
                </div>
                <div className="border-t border-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {dict.profile.twoFactor}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {dict.profile.twoFactorDesc}
                    </p>
                  </div>
                  <Badge variant="default">{dict.common.comingSoon}</Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader title={dict.profile.dangerZone} />
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    {dict.profile.deleteAccount}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {dict.profile.deleteAccountDesc}
                  </p>
                </div>
                <Button variant="danger" size="sm" disabled>
                  {dict.profile.deleteAccount}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

/* ─── Helper: Info Row ──────────────────────────────────────── */

function InfoRow({
  icon,
  label,
  value,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-sm text-slate-900">{value}</p>
          {extra}
        </div>
      </div>
    </div>
  );
}
