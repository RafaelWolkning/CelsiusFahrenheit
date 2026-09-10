# Implementation Plan: CelsiusFahrenheit Mini-Project

## Overview

A minimal Node.js/Express temperature converter with:
- Simple HTML frontend
- REST API endpoints (C→F, F→C)
- ESLint linter
- Jest tests with coverage (pass + fail cases)
- AI test reviewer (script that suggests additional test cases)
- Terraform config for local Docker provisioning
- Gitignore, CI pipeline (GitHub Actions), commit + push

## Architecture Decisions

- **Backend:** Node.js + Express (user preference)
- **Frontend:** Static HTML served by Express (no build step)
- **Tests:** Jest with coverage report
- **Lint:** ESLint
- **AI reviewer:** Script using OpenAI API (or similar) to analyze test file and suggest cases
- **Terraform:** Docker provider to build/run container locally
- **CI:** GitHub Actions workflow

## Task List

### Phase 1: Foundation
- [ ] Task 1: Initialize project (package.json, .gitignore, basic structure)
- [ ] Task 2: Implement conversion logic (src/convert.js)
- [ ] Task 3: Create Express server (src/server.js) with API endpoints
- [ ] Task 4: Create static HTML frontend (public/index.html)

### Checkpoint: Foundation
- [ ] Server starts without errors
- [ ] API endpoints respond correctly
- [ ] Frontend renders and converts

### Phase 2: Testing & Quality
- [ ] Task 5: Write Jest tests (__tests__/convert.test.js) with pass + fail cases
- [ ] Task 6: Configure ESLint (.eslintrc)
- [ ] Task 7: Configure Jest coverage (jest.config.js)
- [ ] Task 8: Add npm scripts for test, lint, coverage

### Checkpoint: Testing & Quality
- [ ] Tests pass with coverage report
- [ ] Lint passes

### Phase 3: AI & IaC
- [ ] Task 9: Create AI test reviewer script (scripts/ai-review.js)
- [ ] Task 10: Create Terraform config (terraform/main.tf, Dockerfile)

### Checkpoint: AI & IaC
- [ ] AI script runs and suggests test cases
- [ ] Terraform validates

### Phase 4: CI & Git
- [ ] Task 11: Create GitHub Actions CI workflow (.github/workflows/ci.yml)
- [ ] Task 12: Commit all files and push to remote

### Checkpoint: Complete
- [ ] CI pipeline runs successfully
- [ ] Project is live on remote

## Risks and Mitigations
| Risk | Impact | Impact | Mitigation |
|------|--------|--------|------------|
| OpenAI API key not available | Medium | AI reviewer won't run | Fall back to rule-based suggestions or document that key is optional |
| Docker not available locally | Low | Terraform apply fails | Document that `terraform plan` still works |
| Git remote not configured | High | Push fails | Check `git remote -v` and prompt user |

## Open Questions
- Does the user have an OpenAI API key for the AI reviewer?
- Is there a git remote already configured?