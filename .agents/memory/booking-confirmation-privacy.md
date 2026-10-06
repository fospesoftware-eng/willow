---
name: Booking confirmation privacy
description: Privacy boundary when porting server-rendered booking confirmation to client-side fetching.
---

Treat possession of a booking reference as insufficient authorization for customer contacts, health declarations, emergency contacts, or payment identifiers.

**Why:** A server-rendered page previously exposed only display data. Converting it to client-side fetching can unintentionally expose the full service-role database result, including sensitive fields that never appeared in the original page.

**How to apply:** Review any new public lookup against what the original page displayed. Use an explicit display-only response allowlist; keep personal, medical, and internal payment data behind admin authentication.
