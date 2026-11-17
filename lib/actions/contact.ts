"use server";

import { headers } from "next/headers";
import { handleContactSubmission } from "@/lib/contact/service";
import type { ContactState } from "@/lib/forms/contact";
import { clientIpFrom } from "@/lib/forms/request-context";
import { contactDeps } from "@/lib/services";

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = clientIpFrom(await headers());
  return handleContactSubmission(formData, { ip }, contactDeps());
}
