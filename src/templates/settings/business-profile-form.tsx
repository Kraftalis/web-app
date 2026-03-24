"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Skeleton } from "@/components/ui";
import {
  IconCamera,
  IconMail,
  IconPhone,
  IconInstagram,
  IconTiktok,
  IconFacebook,
  IconLinkedin,
  IconWhatsApp,
  IconCheck,
} from "@/components/icons";
import { useDictionary } from "@/i18n";
import { useBusinessProfile, useUpsertBusinessProfile } from "@/hooks/user";
import type { UpsertBusinessProfilePayload } from "@/hooks/user";

// ─── Social link config ─────────────────────────────────────

const socialConfig = [
  {
    key: "instagram",
    label: "Instagram",
    icon: IconInstagram,
    placeholder: "@yourbusiness",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: IconTiktok,
    placeholder: "@yourbusiness",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: IconFacebook,
    placeholder: "facebook.com/yourbusiness",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: IconLinkedin,
    placeholder: "linkedin.com/in/you",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: IconWhatsApp,
    placeholder: "+62812...",
  },
];

// ─── Component ──────────────────────────────────────────────

export default function BusinessProfileForm() {
  const { dict } = useDictionary();
  const o = dict.onboarding;
  const s = dict.settings;

  const profileQuery = useBusinessProfile();
  const upsert = useUpsertBusinessProfile();

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    instagram: "",
    tiktok: "",
    facebook: "",
    linkedin: "",
    whatsapp: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill form with existing data
  useEffect(() => {
    const p = profileQuery.data;
    if (!p) return;
    setBusinessName(p.businessName ?? "");
    setTagline(p.tagline ?? "");
    setLogoUrl(p.logoUrl ?? null);
    setLogoPreview(p.logoUrl ?? null);
    setEmail(p.email ?? "");
    setPhoneNumber(p.phoneNumber ?? "");
    setSocialLinks({
      instagram: "",
      tiktok: "",
      facebook: "",
      linkedin: "",
      whatsapp: "",
      ...(p.socialLinks ?? {}),
    });
  }, [profileQuery.data]);

  // ─── Photo upload ─────────────────────────────────────
  const handleLogoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
            folder: "logos",
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");

        await fetch(json.data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        setLogoUrl(json.data.publicUrl);
      } catch (err) {
        console.error("[Settings] Logo upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  // ─── Social link change ───────────────────────────────
  const handleSocialChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Submit ───────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!businessName.trim()) {
      setError(o.businessNameRequired);
      return;
    }

    const filteredSocials: Record<string, string> = {};
    for (const [key, val] of Object.entries(socialLinks)) {
      if (val.trim()) filteredSocials[key] = val.trim();
    }

    const payload: UpsertBusinessProfilePayload = {
      businessName: businessName.trim(),
      tagline: tagline.trim() || null,
      logoUrl,
      email: email.trim() || null,
      phoneNumber: phoneNumber.trim() || null,
      socialLinks:
        Object.keys(filteredSocials).length > 0 ? filteredSocials : null,
    };

    try {
      await upsert.mutateAsync(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(o.saveError);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────
  if (profileQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="settings-logo-upload"
          className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-accent hover:bg-accent/5"
        >
          {logoPreview ? (
            <Image src={logoPreview} alt="Logo" fill className="object-cover" />
          ) : (
            <IconCamera
              size={28}
              className="text-gray-400 group-hover:text-accent"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          )}
        </label>
        <input
          id="settings-logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        <p className="mt-2 text-xs text-(--text-tertiary)">{o.uploadLogo}</p>
      </div>

      {/* Business Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {o.businessNameLabel} <span className="text-red-500">*</span>
        </label>
        <Input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={o.businessNamePlaceholder}
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {o.taglineLabel}
        </label>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder={o.taglinePlaceholder}
        />
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <IconMail size={14} className="text-(--text-tertiary)" />
            {o.emailLabel}
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={o.emailPlaceholder}
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <IconPhone size={14} className="text-(--text-tertiary)" />
            {o.phoneLabel}
          </label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={o.phonePlaceholder}
          />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          {o.socialLinksLabel}
        </p>
        <div className="space-y-3">
          {socialConfig.map(({ key, icon: Icon, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon size={18} className="shrink-0 text-(--text-tertiary)" />
              <Input
                value={socialLinks[key] ?? ""}
                onChange={(e) => handleSocialChange(key, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <IconCheck size={16} className="text-green-600" />
          {s.profileUpdated}
        </div>
      )}

      {/* Submit */}
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={upsert.isPending || uploading}
      >
        {upsert.isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {o.saving}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconCheck size={16} />
            {s.saveProfile}
          </span>
        )}
      </Button>
    </div>
  );
}
