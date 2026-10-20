---
description: Build the whole portfolio in one run (ship mode), then teach through a walkthrough
---

Ship mode. Follow AGENTS.md exactly. We ship today.

1. Read AGENTS.md, docs/PROGRESS.md and docs/FACTS.md. Run `git status` and `git log --oneline -10`. Leftover uncommitted work from an earlier Claude session is part of the build: review it and continue.
2. Run every unticked phase in PROGRESS.md back to back, porting from `E:\abinash-adaptive-portfolio-main` (read-only) as AGENTS.md maps it. After each phase: run lint and build (both must pass), commit `phase N: …`, tick the box and add one log line. Don't pause for teaching, TODO(human) tasks or approval.
3. Stop only for real blockers: a secret I must create (`DATABASE_URL`), a login, or anything destructive. If `DATABASE_URL` is missing, finish everything else first, then tell me exactly what to create and paste where.
4. Missing facts or assets: leave the element out cleanly (no TODO text on the page) and add it to the MISSING list.
5. At the end, write docs/WALKTHROUGH.md in the AGENTS.md format. Then give me a chat summary: what you built, how one request flows through it, the top 5 Next.js ideas to learn from this code, the MISSING list, and my deploy and domain steps.

$ARGUMENTS
