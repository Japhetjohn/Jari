# SHARED CORE: MIDDLEWARE
**Directory**: `shared/middleware/`  
**Ownership**: Shared  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Middleware package intercepts HTTP requests to provide uniform logging, request context tracking, error handling, input sanitization, and immutable audit logging.

---

## 2. PROPOSED FILES & SUBCOMPONENTS
```
shared/middleware/
├── README.md                           # This orientation document
├── errorHandler.ts                     # Global API error handler formatting unified JSON envelopes
├── requestLogger.ts                    # Logs HTTP method, URL, status code, and latency
├── auditTrailMiddleware.ts             # Intercepts institutional actions and logs to activity_audit_logs
└── corsConfig.ts                       # CORS headers configuration
```

---

## 3. UNIFIED ERROR HANDLING CONVENTION
All unhandled exceptions or validation rejections must pass through `errorHandler.ts`, returning the standard JSON envelope specified in `docs/API_CONTRACTS.md`:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Detailed error message",
    "details": []
  },
  "timestamp": "2026-11-04T12:00:00.000Z"
}
```

---

## 4. INTEGRATION RULES
- Both developers must route all API endpoint errors through `next(error)` or throw standard domain exceptions rather than returning ad-hoc raw error strings.

