import { z } from "zod";

import { emailRegex } from "@/shared/lib/constants";
import { t } from "@/shared/lib/i18n/t";

const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const avatarFileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_AVATAR_MIME_TYPES.includes(file.type), {
    message: t("validation.image_type"),
  });

export const createProfileNameSchema = () =>
  z.object({
    portalName: z.string().min(1, t("validation.field_required")),
  });

export const createChangePasswordSchema = () =>
  z
    .object({
      currentPassword: z.string().min(8, t("validation.password_min")),
      newPassword: z.string().min(8, t("validation.password_min")),
      confirmPassword: z.string().min(8, t("validation.password_min")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwords_dont_match"),
      path: ["confirmPassword"],
    });

export const createChangeEmailSchema = () =>
  z.object({
    newEmail: z.string().refine((val) => emailRegex.test(val), {
      message: t("validation.email_invalid"),
    }),
    currentPassword: z.string().min(8, t("validation.password_min")),
  });

export type ProfileNameFormValues = z.infer<
  ReturnType<typeof createProfileNameSchema>
>;
export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
export type ChangeEmailFormValues = z.infer<
  ReturnType<typeof createChangeEmailSchema>
>;
