# Handoff: Implementation → Testing Specialist

---

**handoff_version**: 1.0.0
**from_agent**: {frontend_specialist|backend_specialist|database_specialist}
**to_agent**: testing_specialist
**timestamp**: {TIMESTAMP}
**task_id**: {TASK_ID}

---

## Task-Summary

**Feature**: {FEATURE_NAME}
**Implementation-Type**: {Frontend|Backend|Database}
**Test-Scope**: {Unit|Integration|E2E|All}

## Changed-Files

1. [{File-Path}]({File-Path}) - {Beschreibung}
2. [{File-Path}]({File-Path}) - {Beschreibung}
   ...

## Test-Requirements

### Unit-Tests (tests/unit/)

**Target-Files**:

- {File-Path} → Tests für {Functions/Components}

**Test-Cases**:

1. **Happy-Path**: {Beschreibung}
2. **Error-Cases**: {Beschreibung}
3. **Edge-Cases**: {Beschreibung}

**Expected-Coverage**: min. 80% für neue Files

### Integration-Tests (tests/integration/) - Falls Backend-Änderungen

**API-Endpoints to test**:

- `{METHOD} /api/{path}` → {Test-Cases}

**Test-Cases**:

1. **Success-Response**: {Expected-Data}
2. **Validation-Errors**: {Invalid-Inputs}
3. **Error-Handling**: {404, 500, etc.}

### E2E-Tests (tests/e2e/) - Falls Frontend-Änderungen

**User-Flows to test**:

1. **Flow-1**: {Step-by-Step User-Actions}
2. **Flow-2**: {Step-by-Step User-Actions}

**Test-Cases**:

1. **Happy-Path**: {Erfolgreicher Durchlauf}
2. **Error-Handling**: {Validation-Errors, Network-Errors}
3. **Visual-Regression** (optional): Screenshots für UI-Changes

## Existing-Tests (zu aktualisieren)

- {Test-File} → {Änderungen nötig weil...}

## Test-Data

**Fixtures/Mocks**:

```typescript
const mockData = {
  // Test-Daten
};
```

## Acceptance-Criteria

- [ ] Unit-Tests geschrieben für alle neuen Functions/Components
- [ ] Integration-Tests für neue API-Endpoints (falls Backend)
- [ ] E2E-Tests für neue User-Flows (falls Frontend)
- [ ] `pnpm test` erfolgreich (alle Tests grün)
- [ ] `pnpm test:coverage` → min. 80% Coverage
- [ ] `pnpm test:e2e` erfolgreich (falls E2E-Tests)
- [ ] Keine Flaky-Tests (Tests stabil, kein Timeout-Risiko)

## Next-Agent

- **Agent**: qa_specialist
- **Handoff-Trigger**: Tests complete + Coverage-Check passed
- **Context**: Test-Coverage-Report, Test-Results

## Blockers

{Bekannte Blocker oder "None identified"}

## Questions

{Offene Fragen oder "None"}

---

**signature**: {from_agent}\_agent_v1.0.0
**checksum**: {GENERATED}
