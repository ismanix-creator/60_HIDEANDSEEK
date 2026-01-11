# Handoff: Architect → Backend Specialist

---
**handoff_version**: 1.0.0
**from_agent**: architect
**to_agent**: backend_specialist
**timestamp**: {TIMESTAMP}
**task_id**: {TASK_ID}
---

## Task-Summary
**Feature**: {FEATURE_NAME}
**Priority**: {High/Medium/Low}
**Estimated-Effort**: {HOURS}h

## Context-Files (Must-Read)
- [server/routes/{module}.routes.ts](server/routes/{module}.routes.ts) - Existing Routes
- [server/services/{module}.service.ts](server/services/{module}.service.ts) - Existing Service
- [config.toml](config.toml) - Labels-Config
- [AGENTS.md](AGENTS.md) - Backend-Patterns

## Implementation-Specs

### API-Endpoint
- **Route**: `{METHOD} /api/{path}`
- **Query-Params**: {name}={type} (optional/required)
- **Request-Body**: {JSON-Schema oder "None"}
- **Response**: `Content-Type: {type}`
- **Status-Codes**: 200 (Success), 400 (Bad Request), 404 (Not Found), 500 (Internal Error)

### Business-Logic
{Detaillierte Beschreibung der Business-Logic}

### Zod-Validation
```typescript
export const {module}CreateSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
  // ...
}).strict();
```

### Service-Function-Signature
```typescript
export function create{Module}(
  db: Database.Database,
  input: Omit<{Module}Record, 'id' | 'created_at' | 'updated_at'>
): {Module}Record {
  // Implementation
}
```

### Error-Handling
- **400**: {Beschreibung wann}
- **404**: {Beschreibung wann}
- **500**: {Beschreibung wann}

### Dependencies
- {Neue Dependencies oder "None"}

## Acceptance-Criteria
- [ ] API-Endpoint `{METHOD} /api/{path}` implementiert
- [ ] Zod-Schema für Validation erstellt
- [ ] Service-Function implementiert
- [ ] ApiResponse<T>-Pattern genutzt
- [ ] Error-Handling vollständig
- [ ] TypeScript strict-mode (0 Errors)
- [ ] ESLint/Prettier compliant
- [ ] JSDoc-Header aktualisiert (@version, @changelog)

## Next-Agent
- **Agent**: {frontend_specialist/testing_specialist/...}
- **Handoff-Trigger**: Backend-Implementation complete
- **Context**: {Was Next-Agent braucht}

## Blockers
{Bekannte Blocker oder "None identified"}

## Questions
{Offene Fragen oder "None"}

---
**signature**: architect_agent_v1.0.0
**checksum**: {GENERATED}
