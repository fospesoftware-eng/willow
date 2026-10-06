---
name: Supabase login diagnosis
description: Diagnostic lesson from an API-key rejection masked as a password failure.
---

A login endpoint's generic 401 is not evidence that the supplied password is wrong. The imported handler originally converted all Supabase auth errors—including API-gateway key rejection—into an invalid-password response.

**Why:** A confirmed user existed in the configured Supabase project, but the publishable key was rejected as "Invalid API key." Repeatedly asking for a password reset delayed finding the configuration problem.

**How to apply:** Check the actual upstream error classification and verify the public key against the auth service, without printing credentials or customer data. A service-role lookup succeeding does not establish that the separate publishable key is valid.
