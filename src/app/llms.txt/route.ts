import { agentProfileText } from "@/lib/agentProfile";

// /llms.txt — the plain-text profile for AI agents, generated at build time
export const dynamic = "force-static";

export function GET() {
  return new Response(agentProfileText(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
