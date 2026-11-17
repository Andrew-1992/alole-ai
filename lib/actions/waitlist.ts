"use server";

import { headers } from "next/headers";
import { clientIpFrom } from "@/lib/forms/request-context";
import type { WaitlistState } from "@/lib/forms/waitlist";
import { waitlistDeps } from "@/lib/services";
import { handleWaitlistSubmission } from "@/lib/waitlist/service";

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const ip = clientIpFrom(await headers());
  return handleWaitlistSubmission(formData, { ip }, waitlistDeps());
}
