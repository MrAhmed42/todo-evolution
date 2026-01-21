<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial creation)
Modified principles: N/A (new constitution)
Added sections: Core Principles (7), Technical Constraints, Agent Architecture, Development Workflow, Bonus Points Strategy, Security Requirements, Performance Standards, Deployment Standards, Governance, Submission Requirements, Success Metrics
Removed sections: N/A
Templates requiring updates: ✅ .specify/templates/plan-template.md (Constitution Check section already exists) | ✅ .specify/templates/spec-template.md (no conflicts) | ✅ .specify/templates/tasks-template.md (no conflicts)
Follow-up TODOs: None
-->

# Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development (SDD) - NON-NEGOTIABLE
Every feature, from Phase I console app to Phase V cloud deployment, MUST follow the SDD pipeline: **Specify → Plan → Tasks → Implement**.

**Rules:**
- No code written without pre-approved specification in `/specs` folder
- Every implementation references Task IDs (e.g., T-301)
- Task files created before any coding begins
- `spec-architect` agent must approve all specifications

**Enforcement:** Any code without Task ID reference will be rejected during review.

### II. Reusable Intelligence First
Development focuses on building "intelligence" (reusable templates, sub-agents, MCP skills, Agent Skills, Cloud-Native Blueprints) rather than just writing code.

**Goals:**
- Earn +200 bonus points for "Reusable Intelligence via Subagents"
- Earn +200 bonus points for "Cloud-Native Blueprints via Agent Skills"
- Create modular, reusable components across phases
- Document all reusable patterns in `/docs/reusable-intelligence.md`

### III. Stateless Cloud-Native Design
All application state MUST be externalized for horizontal scalability.

**Requirements:**
- **State Store:** PostgreSQL (via SQLModel/Neon) for task events, reminders, audit logs
- **State Store:** Dapr State Management (optional)
- **Forbidden:** localStorage, sessionStorage, file system state, global variables
- **Validation:** Server restarts must not lose any data

**Why:** Horizontal scalability, resilience, cloud-native deployment.

### IV. User Isolation & Security
Every data access must enforce user boundaries.

**Requirements:**
- All database queries filter by `user_id`
- JWT validated on every protected endpoint
- Token payload `user_id` must match URL `user_id`
- MCP tools receive and validate `user_id` parameter
- No cross-user data leakage

**Enforcement:** Security audit in every phase review.

### V. Modern Python Standards
Python 3.13+ with strict typing and async patterns.

**Standards:**
- Type hints on ALL functions: `async def create_task(...) -> Task:`
- Async/await for all I/O operations
- Pydantic models for validation
- SQLModel for database models (inherits from Pydantic)
- UV for package management (NO pip, NO conda)

**Linting:** Use `mypy --strict` and `ruff` for enforcement.

### VI. Test-First Implementation
TDD approach: Acceptance Criteria → Tests → Implementation.

**Workflow:**
1. Specification defines acceptance criteria
2. Write tests that validate criteria (they fail initially)
3. Implement code to make tests pass
4. Refactor while keeping tests green

**Coverage:** Minimum 80% code coverage for Phase II onwards.

### VII. Monorepo Architecture
Single repository with clear separation.

**Structure:**
```
hackathon-todo/
├── .spec-kit/           # Spec-Kit Plus config
├── specs/               # All specifications
├── frontend/            # Next.js application
├── backend/             # FastAPI application
├── mcp-server/          # MCP tools (Phase III)
├── services/            # Microservices (Phase V)
├── k8s/                 # Kubernetes manifests
├── helm/                # Helm charts
└── docs/                # Documentation
```

**Rationale:** Easier for Claude Code to navigate and make cross-cutting changes.

## Technical Constraints

### Technology Stack (NON-NEGOTIABLE)

**Phase I:**
- Python 3.13+, UV package manager

**Phase II:**
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- Backend: FastAPI, SQLModel, Pydantic
- Database: Neon Serverless PostgreSQL
- Auth: Better Auth with JWT

**Phase III:**
- AI: OpenAI Agents SDK (NOT LangChain, NOT LlamaIndex)
- MCP: Official MCP SDK (Python)
- ChatKit: OpenAI ChatKit
- ALL Phase II technologies

**Phase IV:**
- Docker, Docker Desktop
- Kubernetes (Minikube for local)
- Helm Charts
- kubectl-ai, kagent (AI DevOps tools)
- Docker AI (Gordon) - optional

**Phase V:**
- Kafka: Redpanda Cloud, Confluent Cloud, or Strimzi (self-hosted)
- Dapr: All building blocks (Pub/Sub, State, Invocation, Jobs, Secrets)
- Cloud: DigitalOcean DOKS, Google GKE, or Azure AKS
- ALL Phase III-IV technologies

### Forbidden Technologies
- localStorage/sessionStorage (NOT supported in Claude.ai)
- LangChain, LlamaIndex (NOT part of stack)
- pip/conda (use UV only)
- Class-based React components (use functional only)
- Custom CSS files (use Tailwind utilities only)

### Environment Requirements

**WSL 2 Mandatory (Windows Users):**
- All development in WSL 2 (Ubuntu 22.04+)
- Docker Desktop with WSL 2 backend
- Minikube runs inside WSL 2
- Ensures dev/prod parity

**Verification:**
```bash
wsl --version  # Must show WSL 2
uv --version   # Must exist
```

## Agent Architecture

### Master Agent
`hackathon-master` orchestrates all phases and delegates to specialists.

### Specialized Sub-Agents (5 Required)
1. **spec-architect** - Spec-Kit Plus master, creates all specifications
2. **backend-specialist** - All Python backend (Phase I-III)
3. **frontend-specialist** - All Next.js UI (Phase II-III)
4. **cloud-architect** - OpenAI Agents SDK + Kafka/Dapr (Phase III, V)
5. **devops-master** - Docker, K8s, Cloud deployment (Phase IV-V)

**Delegation Rule:** Master agent MUST NOT implement directly; always delegate to specialists.

## Development Workflow

### Phase Initialization
```bash
# Start new phase
uv specifyplus init phase-X

# Create constitution if not exists
# Create specify, plan, tasks files
# Review with spec-architect agent
```

### Implementation Cycle
1. **Specify:** `spec-architect` creates `/specs/phase-X-specify.md`
2. **Plan:** `spec-architect` creates `/specs/phase-X-plan.md`
3. **Tasks:** `spec-architect` creates `/specs/phase-X-tasks.md`
4. **Delegate:** Master agent assigns tasks to specialist agents
5. **Implement:** Specialist agents write code referencing Task IDs
6. **Validate:** Run tests, verify acceptance criteria
7. **Iterate:** Refine specs if needed, re-implement

### Knowledge Persistence
- Maintain `.claude/` folder with agent definitions
- Document key decisions in `/docs/decisions/`
- Keep Prompt History Records (PHRs) for complex interactions
- Update specs when requirements change

### Quality Gates

**Phase Completion Checklist:**
- [ ] All specifications in `/specs` folder
- [ ] All Task IDs implemented and referenced in code
- [ ] Tests written and passing (80%+ coverage for Phase II+)
- [ ] CLAUDE.md file exists with setup instructions
- [ ] README.md updated with phase details
- [ ] Demo video recorded (max 90 seconds)
- [ ] Deployment successful (for applicable phases)

## Bonus Points Strategy

### +200 Points: Reusable Intelligence
**Requirement:** Create and use reusable intelligence via Subagents and Agent Skills

**Implementation:**
- Build 5 specialized sub-agents (already done)
- Create Agent Skills for common patterns
- Document reusability in `/docs/reusable-intelligence.md`

### +200 Points: Cloud-Native Blueprints
**Requirement:** Create and use blueprints via Agent Skills

**Implementation:**
- Build deployment blueprints (Helm charts as templates)
- Create Dapr component blueprints
- Kafka topic configuration templates
- Document in `/docs/blueprints.md`

### +100 Points: Multi-language Support (Urdu)
**Implementation:**
- i18n support in Next.js frontend
- Urdu translations for UI
- ChatKit supports Urdu input/output

### +200 Points: Voice Commands
**Implementation:**
- Web Speech API integration
- Voice-to-text for task creation
- Text-to-speech for responses

## Security Requirements

### Authentication & Authorization
- Better Auth with JWT tokens
- Token expiry: 7 days maximum
- Refresh token rotation
- HTTPS only in production

### Data Protection
- User isolation enforced at database level
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)
- CSRF protection (SameSite cookies)

### Secrets Management
- Environment variables for all secrets
- `.env` files NOT committed to git
- Kubernetes Secrets for production
- Dapr Secrets store integration (Phase V)

## Performance Standards

### API Response Times
- GET endpoints: < 200ms
- POST/PUT/PATCH endpoints: < 500ms
- Chat endpoint: < 2s (including AI processing)

### Scalability Targets
- Phase II-III: 10 concurrent users
- Phase IV: 100 concurrent users (local K8s)
- Phase V: 1000+ concurrent users (cloud)

### Database
- Connection pooling (10-20 connections)
- Query optimization (proper indexes)
- N+1 query prevention

## Deployment Standards

### Containerization (Phase IV+)
- Multi-stage Docker builds
- Minimal base images (alpine, slim)
- Layer caching optimization
- Health checks in all containers
- Resource limits defined

### Kubernetes (Phase IV+)
- Namespaces for isolation (`todo-app`)
- ConfigMaps for configuration
- Secrets for credentials
- Liveness and Readiness probes
- HorizontalPodAutoscaler (Phase V)

### Monitoring (Phase V)
- Structured logging (JSON format)
- Log aggregation (optional: ELK stack)
- Metrics collection (optional: Prometheus)
- Health check endpoints (`/health`)

## Governance

### Constitution Authority
- This Constitution is the **Supreme Law** of the project
- Supersedes all other documentation
- All agents must comply
- Spec-architect enforces SDD compliance
- Master agent resolves conflicts

### Amendment Process
1. Identify needed change with justification
2. Document in `/docs/amendments/`
3. Update Constitution version
4. Notify all agents via AGENTS.md update
5. Migration plan if breaking changes

### Compliance Verification
- Every PR must reference Constitution principles
- Code reviews check Task ID references
- Security audits verify user isolation
- Performance tests validate response times
- Deployment reviews check statelessness

### Conflict Resolution Hierarchy
1. **Constitution** (this document) - highest authority
2. **Specifications** in `/specs` folder
3. **Agent instructions** in `.claude/agents/`
4. **AGENTS.md** for cross-agent coordination
5. **Code comments** for implementation details

### Review Process
- Phase I-III: Weekly review on Sundays
- Phase IV-V: Bi-weekly review
- Live presentations by invitation only
- Scoring based on rubric compliance

## Submission Requirements

### Every Phase Must Include
1. Public GitHub repository link
2. Published app link (Vercel for frontend)
3. Demo video link (max 90 seconds)
4. WhatsApp number for presentation invite

### Repository Must Contain
- `/specs` folder with all SDD artifacts
- `CLAUDE.md` with Claude Code setup
- `README.md` with comprehensive docs
- `.claude/agents/` with all agent definitions
- Working code for completed features
- Tests with passing status

### Demo Video Requirements
- Maximum 90 seconds (judges watch only first 90s)
- Show all implemented features
- Demonstrate spec-driven workflow
- Highlight bonus point features

## Success Metrics

### Academic Success
- Complete all 5 phases: 1,000 base points
- Earn all bonus points: +600 points
- **Total possible: 1,600 points**

### Technical Excellence
- Clean architecture following Constitution
- Reusable intelligence demonstrated
- Cloud-native patterns implemented
- Security and performance standards met

### Career Advancement
- Top performers invited to Panaversity core team
- Potential startup founder role
- Teaching opportunities at PIAIC/GIAIC
- Work with founders Zia, Rehan, Junaid, Wania

## Living Document

This Constitution evolves with the project. When in doubt:
1. Refer to Core Principles
2. Consult spec-architect agent
3. Document decision for future reference

**Remember:** We're not just building an app. We're mastering the **Architecture of Intelligence** for AI-native, spec-driven, cloud-native development.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29
