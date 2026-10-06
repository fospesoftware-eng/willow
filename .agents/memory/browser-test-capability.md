---
name: Browser test capability
description: Runtime mismatch encountered while verifying the imported application.
---

The runtime rejected the documented testing subagent kind as unknown during migration verification.

**Why:** Skill documentation and registered runtime capabilities can differ. A missing subagent capability is not an application failure and should not prevent browser verification.

**How to apply:** Recheck availability before relying on that capability in a future session. When it is rejected, run the project's local Playwright tests rather than repeatedly dispatching the unavailable subagent.
