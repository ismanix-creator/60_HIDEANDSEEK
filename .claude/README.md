# Claude Agent-System für 60_HIDEANDSEEK

**Version**: 1.0.0
**Erstellt**: 2026-01-11
**Projekt**: Material-Tracker (60_HIDEANDSEEK)

## Übersicht

Dieses Verzeichnis enthält das **9-Agent-System** mit **7-Plugin-Integration** für Claude Code.

### 9 Specialized Agents

1. **orchestrator** - Master-Koordinator (delegiert, orchestriert Quality-Gates)
2. **architect** - System-Design (serena + typescript-lsp + context7)
3. **frontend_specialist** - React/TypeScript (frontend-design + serena + typescript-lsp)
4. **backend_specialist** - Hono/Node.js (serena + typescript-lsp + context7)
5. **database_specialist** - SQLite (serena + typescript-lsp + context7)
6. **testing_specialist** - Tests (playwright + serena + context7)
7. **documentation_specialist** - Docs (serena + typescript-lsp + context7)
8. **qa_specialist** - Code-Review (code-review + serena + typescript-lsp)
9. **devops_specialist** - CI/CD (serena + context7)

### 7 Integrated Plugins

- ✅ **typescript-lsp** - TypeScript Language Server
- ✅ **serena** - Semantic Code Understanding
- ✅ **frontend-design** - UI Design Excellence
- ✅ **context7** - Library Documentation
- ✅ **code-review** - Multi-Agent Code-Review
- ✅ **feature-dev** - Alternative Workflow (optional)
- ✅ **playwright** - E2E Testing & Browser-Automation

## Verzeichnisstruktur

```
.claude/
├── README.md                    # Diese Datei
├── settings.local.json          # Claude-Settings
│
├── agents/                      # Agent-Konfigurationen (9 YAML-Files)
│   ├── orchestrator.yaml
│   ├── architect.yaml
│   ├── frontend_specialist.yaml
│   ├── backend_specialist.yaml
│   ├── database_specialist.yaml
│   ├── testing_specialist.yaml
│   ├── documentation_specialist.yaml
│   ├── qa_specialist.yaml
│   └── devops_specialist.yaml
│
├── context/                     # Shared Context für Agents
│   └── project-overview.md      # Projekt-Übersicht
│
├── workflows/                   # Vordefinierte Workflows
│   ├── simple-fix.yaml          # Bug-Fixes (< 1h, 1-2 Agents)
│   ├── medium-feature.yaml      # Features (1-4h, 3-6 Agents)
│   └── complex-feature.yaml     # Breaking-Changes (> 4h, 6-8 Agents)
│
└── handoff-templates/           # Templates für Agent-zu-Agent-Übergaben
    ├── architect-to-backend.md
    ├── architect-to-frontend.md
    ├── implementation-to-testing.md
    └── testing-to-qa.md
```

## Verwendung

### 1. Agent direkt aufrufen

```bash
# Beispiel: Orchestrator für Feature-Request
claude-agent orchestrator "Implementiere CSV-Export für Material-Tabelle"

# Beispiel: Architect für Design-Review
claude-agent architect "Analysiere Material-Service-Architektur"

# Beispiel: QA für Code-Review
claude-agent qa_specialist "Review src/pages/MaterialPage.tsx"
```

### 2. Workflow nutzen

```bash
# Simple Fix
claude-agent orchestrator --workflow=.claude/workflows/simple-fix.yaml "Fix Button-Color"

# Medium Feature
claude-agent orchestrator --workflow=.claude/workflows/medium-feature.yaml "CSV-Export"

# Complex Feature
claude-agent orchestrator --workflow=.claude/workflows/complex-feature.yaml "Multi-Tenant-Support"
```

### 3. Agent-Chain manuell orchestrieren

```bash
# 1. Design-Phase
claude-agent architect "Design CSV-Export-Feature"

# 2. Implementation-Phase (nach Design-Review)
claude-agent backend_specialist "Implementiere CSV-Export-API"
claude-agent frontend_specialist "Implementiere Export-Button"

# 3. Testing-Phase
claude-agent testing_specialist "Schreibe Tests für CSV-Export"

# 4. QA-Phase
claude-agent qa_specialist "Review CSV-Export-Feature"
```

## Workflow-Entscheidungsmatrix

| Task-Type | Complexity | Workflow | Agents | Effort |
|-----------|------------|----------|--------|--------|
| Typo-Fix, Button-Color | Simple | simple-fix.yaml | 1-2 | < 1h |
| CSV-Export, Filter-Funktion | Medium | medium-feature.yaml | 3-6 | 1-4h |
| Multi-Tenant, Auth-System | Complex | complex-feature.yaml | 6-8 | > 4h |

## Quality-Gates

### Gate 1: Design-Review (nach architect)
- **Prüfer**: orchestrator
- **Kriterien**: Specs vollständig, Breaking-Changes dokumentiert, Migration-Strategie

### Gate 2: Code-Review (nach Implementation)
- **Prüfer**: qa_specialist
- **Kriterien**: ESLint/Prettier compliant, TypeScript 0 Errors, No-Hardcodes

### Gate 3: Test-Coverage (nach testing_specialist)
- **Prüfer**: qa_specialist (automatisiert)
- **Kriterien**: min. 80% Coverage, E2E Happy-Path + Error-Paths

### Gate 4: Documentation-Completeness (nach documentation_specialist)
- **Prüfer**: orchestrator
- **Kriterien**: README.md aktualisiert, JSDoc-Header vollständig, Migration-Guide

## Plugin-Nutzung pro Agent

| Agent | typescript-lsp | serena | frontend-design | context7 | code-review | playwright |
|-------|----------------|--------|-----------------|----------|-------------|------------|
| orchestrator | - | - | - | - | - | - |
| architect | ✓ | ✓ | - | ✓ | - | - |
| frontend_specialist | ✓ | ✓ | ✓ | ✓ | - | - |
| backend_specialist | ✓ | ✓ | - | ✓ | - | - |
| database_specialist | ✓ | ✓ | - | ✓ | - | - |
| testing_specialist | - | ✓ | - | ✓ | - | ✓ |
| documentation_specialist | ✓ | ✓ | - | ✓ | - | - |
| qa_specialist | ✓ | ✓ | - | ✓ | ✓ | - |
| devops_specialist | - | ✓ | - | ✓ | - | - |

## Handoff-Protokolle

Agent-zu-Agent-Übergaben folgen dem Template-Format in `.claude/handoff-templates/`.

**Standard-Flow**:
1. **architect** erstellt Design + Handoff-Dokument
2. **Implementation-Agents** (backend/frontend/database) implementieren nach Handoff-Specs
3. **testing_specialist** schreibt Tests basierend auf Implementation-Handoff
4. **documentation_specialist** aktualisiert Docs
5. **qa_specialist** führt Final-Review durch
6. **orchestrator** meldet Completion an User

## Projekt-Spezifische Constraints

Alle Agents müssen folgende Constraints einhalten (siehe AGENTS.md):

### Config-System (CRITICAL)
- **NUR** config.toml ändern, **NIEMALS** *.config.ts Files direkt
- **IMMER** nach config.toml-Änderung: `pnpm generate:config`
- **KEINE** Hardcodes für UI-Texte, Colors, Spacing

### Testing (CRITICAL)
- **IMMER** Tests schreiben (Unit + E2E)
- **IMMER** `pnpm qa` ausführen vor Final-Report
- **IMMER** min. 80% Test-Coverage

### Documentation (CRITICAL)
- **IMMER** JSDoc-Header aktualisieren (@version, @changelog)
- **IMMER** AGENTS.md synchron halten bei Pattern-Changes

## Troubleshooting

### Agent nicht gefunden
```bash
# Liste alle verfügbaren Agents
ls -la .claude/agents/

# Prüfe YAML-Syntax
yaml-lint .claude/agents/orchestrator.yaml
```

### Plugin nicht verfügbar
```bash
# Liste aktivierte Plugins
claude plugin list

# Aktiviere Plugin
claude plugin enable serena
```

### Handoff-Template fehlt
```bash
# Liste alle Templates
ls -la .claude/handoff-templates/

# Erstelle Custom-Template (basierend auf bestehenden)
cp .claude/handoff-templates/architect-to-backend.md .claude/handoff-templates/custom.md
```

## Weiterentwicklung

### Neuen Agent hinzufügen

1. Erstelle `.claude/agents/new_agent.yaml`
2. Definiere: name, version, role, instructions, tools, contextFiles, handoffTo
3. Aktualisiere `orchestrator.yaml` → handoffTo-Liste
4. Teste Agent-Aufruf: `claude-agent new_agent "Test-Task"`

### Neuen Workflow erstellen

1. Erstelle `.claude/workflows/new_workflow.yaml`
2. Definiere: steps (Agent-Chain), quality_gates, example_tasks
3. Teste Workflow: `claude-agent orchestrator --workflow=.claude/workflows/new_workflow.yaml "Test"`

## Support & Dokumentation

- **Coding-Standards**: [AGENTS.md](../AGENTS.md)
- **Config-Architektur**: [CONFIG_ARCHITECTURE_SUMMARY.md](../CONFIG_ARCHITECTURE_SUMMARY.md)
- **Projekt-README**: [README.md](../README.md)
- **Project-Overview**: [context/project-overview.md](context/project-overview.md)

## Version History

- **v1.0.0** (2026-01-11): Initial Agent-System Setup
  - 9 Agents erstellt
  - 7 Plugins integriert
  - 3 Workflows definiert
  - 4 Handoff-Templates erstellt
