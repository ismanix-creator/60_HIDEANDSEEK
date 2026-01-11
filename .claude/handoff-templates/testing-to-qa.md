# Handoff: Testing Specialist → QA Specialist

---
**handoff_version**: 1.0.0
**from_agent**: testing_specialist
**to_agent**: qa_specialist
**timestamp**: {TIMESTAMP}
**task_id**: {TASK_ID}
---

## Task-Summary
**Feature**: {FEATURE_NAME}
**Test-Scope**: {Unit|Integration|E2E|All}
**Test-Status**: {All-Passing|Some-Failing}

## Test-Results

### Unit-Tests
- **Tests-Written**: {ANZAHL}
- **Status**: {Passing|Failing}
- **Coverage**: {PROZENT}%
- **Files-Tested**: {Liste}

### Integration-Tests (falls vorhanden)
- **Tests-Written**: {ANZAHL}
- **Status**: {Passing|Failing}
- **Endpoints-Tested**: {Liste}

### E2E-Tests (falls vorhanden)
- **Tests-Written**: {ANZAHL}
- **Status**: {Passing|Failing}
- **User-Flows-Tested**: {Liste}

## Coverage-Report
```
Overall Coverage: {PROZENT}%

By File:
- {File-Path}: {PROZENT}%
- {File-Path}: {PROZENT}%
...
```

## Changed-Files (für QA-Review)
1. [{File-Path}]({File-Path}) - {Implementation}
2. [{File-Path}]({File-Path}) - {Tests}
...

## Test-Commands
```bash
# Run all tests
pnpm test

# Run specific test-suite
pnpm test {test-file}

# Run E2E-tests
pnpm test:e2e

# Coverage-Report
pnpm test:coverage
```

## Known-Issues
{Bekannte Test-Failures oder "None"}

## QA-Review-Checklist
- [ ] All tests passing
- [ ] Coverage ≥ 80%
- [ ] No Flaky-Tests
- [ ] E2E-Tests stable (no timeouts)
- [ ] Test-Code follows AGENTS.md patterns

## Next-Steps
- **QA-Review**: Full Code-Review + Quality-Gates
- **Expected-Outcome**: {PASS → Merge | FAIL → Back to Implementation}

## Blockers
{Bekannte Blocker oder "None identified"}

## Questions
{Offene Fragen oder "None"}

---
**signature**: testing_specialist_agent_v1.0.0
**checksum**: {GENERATED}
