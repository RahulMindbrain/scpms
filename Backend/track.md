# 🚀 SCPMS BACKEND — COMPLETE ERROR FIX TRACKER

## 📊 SUMMARY

- Total Errors: **68**
- Goal: **0 errors**
- Mode: Fix + tick ✅

---

# ✅ LEGEND

- [ ] Not done
- [✅] Done
- 🔥 Critical
- ⚠️ Important

---

# 📁 1. AUTH SERVICE (1)

### src/auth/auth.service.ts

- [✅ ] Fix Date comparison 🔥

```ts
now.getTime() < new Date(user.otpExpiry).getTime();
```

---

# 📁 2. APPLICATION CONTROLLER (3)

### src/controllers/application.controller.ts

- [ ✅ ] Remove wrong import `deleteApplicationService`
- [ ✅ ] Add types to req/res 🔥

```ts
import { Request, Response } from "express";
```

- [✅ ] Fix controller signature

---

# 📁 3. JOB CONTROLLER (2)

### src/controllers/job.controller.ts

- [✅ ] Handle undefined limit

```ts
const safeLimit = parsedLimit ?? 10;
```

- [✅ ] Fix param type mismatch ⚠️

---

# 📁 4. NOTIFICATION CONTROLLER (2)

### src/controllers/notification.controller.ts

- [ ✅] Import `sendError`
- [ ✅] Fix catch type

```ts
catch (e: any)
```

---

# 📁 5. SCHEDULE CONTROLLER (1)

### src/controllers/schedule.controller.ts

- [✅ ] Handle null response

```ts
if (!schedule) return sendError(res, 404, "Not found");
```

---

# 📁 6. SCHEDULE MESSAGE CONTROLLER (1)

### src/controllers/schedule.message.controller.ts

- [ ✅] Fix wrong import name

---

# 📁 7. QUERY LOGGER (2)

### src/middlewares/queryLogger.ts

- [ ✅ ] Fix Prisma `$on` typing

```ts
(prisma as any).$on("query", handler);
```

- [ ✅] Remove/ignore `$off`

---

# 📁 8. VALIDATE MIDDLEWARE (2)

### src/middlewares/validate.ts

- [✅ ] Replace import

```ts
import { ZodObject } from "zod";
```

- [ ✅ ] Fix implicit any in map

---

# 📁 9. ADMIN REPOSITORY (6)

### src/repository/admin.repository.ts

- [ ✅ ] Replace string role with enum 🔥
- [✅ ] Fix where type mismatch
- [✅ ] Import Prisma

```ts
import { Prisma } from "@prisma/client";
```

- [ ✅ ] Fix all 4 occurrences of role mismatch

---

# 📁 10. COMPANY REPOSITORY (2)

### src/repository/company.repository.ts

- [✅ ] Fix undefined → null 🔥

```ts
description: description ?? null;
```

- [✅ ] Import Prisma namespace

---

# 📁 11. SCHEDULE REPOSITORY (1)

### src/repository/schedule.repository.ts

- [ ✅] Fix enum type mismatch

---

# 📁 12. USER REPOSITORY (1)

### src/repository/user.repository.ts

- [✅ ] Fix undefined → null

```ts
lastname: lastname ?? null;
```

---

# 📁 13. ADMIN SERVICE (6)

### src/services/admin.service.ts

- [ ✅ ] Fix wrong import
- [ ✅ ] Handle undefined params (3 places) 🔥
- [ ✅ ] Fix enum mismatch
- [ ✅ ] Fix undefined id

---

# 📁 14. APPLICATION SERVICE (1)

### src/services/application.service.ts

- [ ✅ ] Fix `student.user` access
  👉 either include in select OR remove

---

# 📁 15. JOB SERVICE (1)

### src/services/job.service.ts

- [✅ ] Fix optional param mismatch

---

# 📁 16. MAIL SERVICE (2)

### src/services/mail/mail.service.ts

- [✅ ] Remove `fromName` OR extend type (2 places)

---

# 📁 17. NOTIFICATION SERVICE (2)

### src/services/notification.service.ts

- [ ✅] Fix missing export (job repo)
- [✅ ] Fix missing export (student repo)

---

# 📁 18. SCHEDULE MESSAGE SERVICE (1)

### src/services/schedule.message.service.ts

- [ ✅ ] Fix union type mismatch

---

# 📁 19. SCHEDULE SERVICE (4)

### src/services/schedule.service.ts

- [✅ ] Add type to `data` (2 places)
- [ ✅] Fix invalid property
- [ ✅] Fix null assignment

---

# 📁 20. STUDENT SERVICE (3)

### src/services/student.service.ts

- [✅ ] Fix implicit any (2)
- [ ✅ ] Fix missing `isPlaced`

---

# 📁 21. MAIL UTILS (6)

### src/utils/mails/\*

- [✅ ] Add types to all params (5+ places)
- [ ✅] Fix invalid property (`to`)

---

# 📁 22. PARSE TTL (1)

### src/utils/parseTTL.ts

- [✅ ] Fix possibly undefined

```ts
if (!match) return null;
```

---

# 📁 23. TOKEN GENERATION (4)

### src/utils/tokenGeneration.ts

- [ ✅] Fix JWT typing (2)
- [ ✅] Fix expiresIn (2) 🔥

```ts
expiresIn: process.env.JWT_ACCESS_TTL as string;
```

---

# 📁 24. VALIDATORS (15 🔥🔥🔥)

### src/validators/\*

- [✅ ] Replace ALL required_error

```ts
.string().min(1, "Required")
```

- [ ✅] Replace invalid_type_error

```ts
.number()
```

- [✅ ] Fix all validator files

---

# 📊 CATEGORY PROGRESS

| Category      | Status |
| ------------- | ------ |
| Auth          | [ ]    |
| Controllers   | [ ]    |
| Middleware    | [ ]    |
| Repositories  | [ ]    |
| Services      | [ ]    |
| Utils         | [ ]    |
| Validators 🔥 | [ ]    |

---

# 🎯 FINAL CHECKLIST

- [ ] Errors = 0
- [ ] Server runs
- [ ] Prisma queries working
- [ ] OTP flow working
- [ ] Pagination working

---

# 📈 PROGRESS TRACKER

- Completed: \_\_\_ / 68
- Remaining: \_\_\_
- Last Updated: \***\*\_\_\*\***

---

# 🧠 RULES (DON’T BREAK THESE)

- ❗ Prisma → use `null`, NOT `undefined`
- ❗ Collections → NEVER throw errors
- ❗ Always type `req, res`
- ❗ Use enums, NOT strings
- ❗ Fix validators first (removes ~15 errors instantly)

---

# 🏁 STATUS

👉 Project Health: ⬜ Broken / ⬜ Partial / ⬜ Stable / ⬜ Production Ready

---

35 remaining
