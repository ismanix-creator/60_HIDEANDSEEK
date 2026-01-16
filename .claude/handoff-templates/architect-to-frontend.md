# Handoff: Architect → Frontend Specialist

---

**handoff_version**: 1.0.0
**from_agent**: architect
**to_agent**: frontend_specialist
**timestamp**: {TIMESTAMP}
**task_id**: {TASK_ID}

---

## Task-Summary

**Feature**: {FEATURE_NAME}
**Priority**: {High/Medium/Low}
**Estimated-Effort**: {HOURS}h

## Context-Files (Must-Read)

- [src/pages/{Page}.tsx](src/pages/{Page}.tsx) - Existing Page (falls relevant)
- [src/components/ui/{Component}.tsx](src/components/ui/{Component}.tsx) - Reference Component
- [config.toml](config.toml) - UI-Config (colors, labels, spacing)
- [AGENTS.md](AGENTS.md) - Frontend-Patterns

## Implementation-Specs

### Component-Design

- **Component-Name**: {ComponentName}
- **Location**: `src/{components|pages}/{category}/{ComponentName}.tsx`
- **Type**: {Page|Layout|UI-Component}

### Props-Interface

```typescript
export interface {ComponentName}Props {
  propA: string;
  propB?: number; // optional
  onAction?: () => void;
}
```

### UI-Design

- **Layout**: {Beschreibung des Layouts}
- **Responsive**: Mobile-First, Breakpoints: {sm|md|lg|xl}
- **Icons**: Lucide React - {icon-name}
- **Colors**: appConfig.colors.{palette}.{shade}
- **Spacing**: appConfig.spacing.{key}

### Config-Integration

```toml
# config.toml
[labels.{module}]
title = "{Deutsch}"
button_new = "{Deutsch}"
# ...

[components.{component}]
# Component-spezifische Config
```

### State-Management

- **State-Type**: {Local (useState)|Context|Props}
- **Hooks**: {useApi|useResponsive|custom}

### API-Integration (falls nötig)

- **Endpoint**: `{METHOD} /api/{path}`
- **Request**: {Beschreibung}
- **Response**: `ApiResponse<{Type}>`

## Acceptance-Criteria

- [ ] Component in `src/{path}/{ComponentName}.tsx` erstellt
- [ ] TypeScript-Props-Interface definiert
- [ ] Config-driven (KEINE Hardcodes für UI-Texte, Colors, Spacing)
- [ ] Responsive-Design (Mobile-First)
- [ ] Accessibility (ARIA-Labels, Keyboard-Navigation)
- [ ] config.toml ergänzt (falls neue Labels/Config nötig)
- [ ] `pnpm generate:config` ausgeführt
- [ ] JSDoc-Header vollständig (@file, @version, @props, @changelog)
- [ ] TypeScript strict-mode (0 Errors)
- [ ] ESLint/Prettier compliant

## Next-Agent

- **Agent**: testing_specialist
- **Handoff-Trigger**: Frontend-Implementation complete
- **Context**: Geänderte Components, neue Pages

## Blockers

{Bekannte Blocker oder "None identified"}

## Questions

{Offene Fragen oder "None"}

---

**signature**: architect_agent_v1.0.0
**checksum**: {GENERATED}
