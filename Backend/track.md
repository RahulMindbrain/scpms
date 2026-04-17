==============================
🚨 TYPESCRIPT ERROR REPORT
==============================

TOTAL ERRORS: 64

---

## 📂 src/cloudinaryUploads/cloudinary.ts : 🟢

- TS2769 → Invalid cloudinary config (env vars possibly undefined)
- TS7006 → req implicitly has 'any'
- TS7006 → res implicitly has 'any'
- TS2345 → CLOUDINARY_API_SECRET possibly undefined

---

## 📂 src/controllers/admin.controller.ts :

- TS2379 → page/limit/year/... undefined mismatch (5 occurrences)
- TS2339 → updatedJobs.status does not exist (BatchPayload issue)
- TS2339 → updatedJobs.id does not exist

---

## 📂 src/controllers/job.controller.ts

- TS18048 → parsedLimit possibly undefined
- TS2379 → limit undefined mismatch in service call

---

## 📂 src/controllers/notification.controller.ts

- TS2304 → sendError not found
- TS18046 → error (e) is of type unknown

---

## 📂 src/controllers/schedule.controller.ts

- TS2345 → schedule can be null but expected object

---

## 📂 src/middlewares/queryLogger.ts

- TS2345 → prisma.$on("query") invalid type
- TS2339 → prisma.$off does not exist

---

## 📂 src/middlewares/validate.ts

- TS2724 → AnyZodObject not found (Zod v4 issue)
- TS7006 → e implicitly any

---

## 📂 src/repository/admin.repository.ts

- TS2304 → JobStatus not found
- TS2375 → role: string not assignable to Prisma enum (4 occurrences)
- TS2503 → Prisma namespace not found

---

## 📂 src/repository/company.repository.ts

- TS2375 → description: string | undefined not assignable to string | null
- TS2503 → Prisma namespace not found

---

## 📂 src/repository/schedule.repository.ts

- TS2375 → status: string not assignable to ScheduleStatus enum

---

## 📂 src/repository/user.repository.ts

- TS2375 → lastname: string | undefined not assignable to string | null

---

## 📂 src/services/admin.service.ts

- TS2724 → getInactiveStudents not exported
- TS2379 → year/passingYear undefined mismatch
- TS2379 → status undefined mismatch
- TS2345 → JobStatus mismatch (PENDING not allowed)
- TS2345 → jobIds[0] possibly undefined

---

## 📂 src/services/application.service.ts

- TS2339 → student.user does not exist

---

## 📂 src/services/job.service.ts

- TS2379 → status undefined mismatch

---

## 📂 src/services/mail.service.ts

- TS2353 → fromName not allowed in MailOptions (2 occurrences)

---

## 📂 src/services/notification.service.ts

- TS2305 → getJobBasicDetails not exported
- TS2305 → getUnplacedStudents not exported
- TS2339 → SOCKET_EVENTS.NEW_JOB does not exist

---

## 📂 src/services/schedule.service.ts

- TS2379 → venue: string | undefined not assignable to string

---

## 📂 src/services/student.service.ts

- TS7006 → id implicitly any (2 occurrences)
- TS2339 → student.isPlaced does not exist

---

## 📂 src/utils/parseTTL.ts

- TS2532 → match[2] possibly undefined

---

## 📂 src/utils/tokenGeneration.ts

- TS2769 → jwt.sign overload mismatch (2 occurrences)
- TS2412 → expiresIn undefined issue (2 occurrences)

---

## 📂 src/validators/auth.validator.ts

- TS2769 → required_error not valid (Zod v4) (4 occurrences)

---

## 📂 src/validators/company.validators.ts

- TS2769 → required_error not valid

---

## 📂 src/validators/job.validator.ts

- TS2769 → required_error not valid (3 occurrences)
- TS2353 → invalid_type_error not valid (5 occurrences)

==================================
🧠 ROOT CAUSES (IMPORTANT)
==================================

1. exactOptionalPropertyTypes = true → causing majority errors
2. Zod v4 breaking changes → all validator errors
3. Prisma strict typing (null vs undefined, enums)
4. Missing imports / wrong exports
5. ENV variables not validated (string | undefined issues)

==================================
🚨 IMPACT
==================================

❌ Build is NOT reliable  
❌ dist output may be broken/incomplete  
❌ Runtime crashes likely

==================================
✅ PRIORITY FIX ORDER
==================================

1. Disable exactOptionalPropertyTypes OR fix undefined handling
2. Fix Zod validators (remove required_error, invalid_type_error)
3. Fix Prisma enum + null issues
4. Fix missing imports/exports
5. Fix ENV variable typing

==================================
