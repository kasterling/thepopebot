# Google Project Antigravity Research Report

**URL:** https://antigravity.google/  
**Date:** February 25, 2026  
**Research Method:** Browser automation + documentation exploration

---

## Executive Summary

**Google Antigravity** is Google's "agentic development platform" — a next-generation IDE that evolves traditional development environments into the "agent-first era." It combines an AI-powered code editor with multi-agent orchestration, cross-surface control (editor, terminal, browser), and sophisticated reasoning capabilities to provide an autonomous development experience.

**Tagline:** "Build the new way" / "Experience liftoff with the next-generation IDE"

---

## What Google Antigravity Is

Google Antigravity is an **AI-native IDE** (Integrated Development Environment) that places AI agents at the center of the development workflow. Unlike traditional IDEs with AI assistants bolted on, Antigravity is designed from the ground up for **agentic development** — where AI agents can reason, plan, execute, and collaborate across your entire development environment.

### Key Positioning

- **Agent-first IDE**: Moves beyond autocomplete and copilots to full autonomous agents
- **Multi-agent orchestration**: Manage multiple AI agents simultaneously from a central "mission control"
- **Cross-surface control**: Synchronized agent actions across editor, terminal, and browser
- **Enterprise-ready**: Built for professional developers, teams, and organizations at scale

---

## Core Architecture & Components

### 1. **The Agent**

The Agent is the main AI functionality within Google Antigravity. It is a **multi-step reasoning system** powered by frontier LLMs that can:

- Reason over existing codebases
- Use a wide range of tools (including a browser subagent)
- Communicate through tasks, artifacts, and more
- Execute in parallel (multiple agent conversations simultaneously)

**Core Components:**
- Reasoning model
- Tools
- Artifacts
- Knowledge
- Customizations
- Agent Modes / Settings
- MCP (Model Context Protocol)
- Rules / Workflows

### 2. **Editor View**

- **Tab autocompletion**: AI-powered code completion
- **Natural language code commands**: Write code using plain English
- **Context-aware agent**: Understands your codebase context
- **Configurable**: Extensive customization options

### 3. **Agent Manager**

A **central mission control** view for managing multiple agents simultaneously across any workspace. Features include:

- **Workspaces**: Organize agent conversations by project
- **Playground**: Experimental space for testing
- **Inbox**: Centralized notification system
- **Conversation View**: Monitor and interact with agent work
- **Review Changes + Source Control**: Integrated git operations

### 4. **Artifacts System**

Higher-level abstractions for monitoring agent activity:

- **Task List**: Track agent tasks and progress
- **Implementation Plan**: View agent's execution strategy
- **Walkthrough**: Step-by-step agent activity
- **Screenshots**: Visual artifacts from browser interactions
- **Browser Recordings**: Capture browser automation sessions

### 5. **Cross-Surface Agents**

Synchronized agentic control across:
- **Editor**: Code editing and file operations
- **Terminal**: Command execution and shell operations
- **Browser**: Web interaction via browser subagent

### 6. **Browser Subagent**

A specialized subagent that can:
- Navigate websites
- Click, scroll, and fill in inputs
- Interact with web applications
- Capture screenshots and recordings
- Uses **Gemini 2.5 Pro UI Checkpoint** model for browser actuation

---

## AI Models & Technology Stack

### Reasoning Models (User-Selectable)

Google Antigravity offers leading frontier models from the **Google Vertex Model Garden**:

1. **Gemini 3.1 Pro (high)** — High-capability reasoning
2. **Gemini 3.1 Pro (low)** — Optimized for speed
3. **Gemini 3 Flash** — Fast lightweight reasoning
4. **Claude Sonnet 4.6 (thinking)** — Deep reasoning capabilities
5. **Claude Opus 4.6 (thinking)** — Maximum reasoning power
6. **GPT-OSS-120b** — Open-source option

**Model Selection:** Users can select their preferred reasoning model via a dropdown in the conversation prompt. The choice is "sticky" within a conversation until changed.

### Additional Models (Non-Customizable)

- **Nano Banana Pro**: Generative images (UI mockups, diagrams, web assets)
- **Gemini 2.5 Pro UI Checkpoint**: Browser subagent actuation
- **Gemini 2.5 Flash**: Background checkpointing and context summarization
- **Gemini 2.5 Flash Lite**: Codebase semantic search

---

## Agent Modes & Capabilities

### Conversation-Level Modes

1. **Planning Mode** 
   - Agent plans before executing
   - For deep research, complex tasks, collaborative work
   - Organizes work in task groups
   - Produces artifacts
   - Thorough research and planning for optimal quality

2. **Fast Mode**
   - Agent executes directly without planning
   - For simple, localized tasks
   - Examples: renaming variables, bash commands, quick edits
   - Prioritizes speed over thorough planning

### Key Agent Settings

#### **Artifact Review Policy**
- **Always Proceed**: Agent never asks for review
- **Request Review**: Agent always asks before implementing plans

#### **Terminal Command Auto Execution**
- **Request Review**: Never auto-execute (except allow list)
- **Always Proceed**: Auto-execute all (except deny list)
- Configurable allow/deny lists for command permissioning

#### **Agent Non-Workspace File Access**
- Allow agent to view/edit files outside workspace
- Disabled by default for security
- When enabled, exposes all local files (use with caution)

---

## Customization & Extension System

### 1. **Rules**

**Rules** are manually defined constraints for the agent to follow.

**Types:**
- **Global Rules**: Apply across all workspaces (`~/.gemini/GEMINI.md`)
- **Workspace Rules**: Project-specific (`<workspace>/.agent/rules/`)

**Activation Modes:**
- **Manual**: Activated via `@mention` in agent input
- **Always On**: Applied automatically
- **Model Decision**: AI decides based on natural language description
- **Glob**: Applied to files matching glob pattern (e.g., `*.js`, `src/**/*.ts`)

**Features:**
- Written in Markdown
- Limited to 12,000 characters per rule
- Support `@filename` references to include other files
- Relative or absolute path resolution

### 2. **Workflows**

**Workflows** define a series of steps to guide the agent through repetitive tasks.

**Use Cases:**
- Deploying services
- Responding to PR comments
- Running test suites
- Release processes

**Features:**
- Written in Markdown
- Invoked via slash commands: `/workflow-name`
- Can call other workflows (nested execution)
- 12,000 character limit per workflow
- Agent can generate workflows from conversation history

**Types:**
- **Global Workflows**: Available across all workspaces
- **Workspace Workflows**: Project-specific

### 3. **Skills**

**Skills** are an **open standard for extending agent capabilities**. Each skill is a folder containing a `SKILL.md` file with instructions.

**Skill Locations:**
- **Workspace**: `<workspace>/.agent/skills/<skill-folder>/`
- **Global**: `~/.gemini/antigravity/skills/<skill-folder>/`

**Skill Structure:**
```
.agent/skills/my-skill/
├── SKILL.md         # Main instructions (required)
├── scripts/         # Helper scripts (optional)
├── examples/        # Reference implementations (optional)
└── resources/       # Templates and assets (optional)
```

**SKILL.md Format:**
```markdown
---
name: my-skill
description: Helps with X. Use when you need to do Y or Z.
---

# My Skill

Detailed instructions for the agent...
```

**How Skills Work (Progressive Disclosure):**
1. **Discovery**: Agent sees skill names and descriptions
2. **Activation**: Agent reads full SKILL.md when relevant
3. **Execution**: Agent follows skill instructions

**Best Practices:**
- Keep skills focused (one thing well)
- Write clear descriptions for auto-selection
- Use scripts as black boxes (run with `--help` first)
- Include decision trees for complex scenarios

---

## Integration & Extensibility

### MCP (Model Context Protocol)

Google Antigravity supports **MCP** for extending agent capabilities with custom tools and context providers. Details not fully captured in this research, but it's a documented extensibility point.

### Tool Ecosystem

The agent has access to various tools:
- **Terminal command generation**
- **Codebase semantic search** (Gemini 2.5 Flash Lite)
- **Generative image tool** (Nano Banana Pro)
- **Browser automation** (via browser subagent)
- **File operations** (read, write, edit)
- **Git operations** (commit, branch, merge)
- Custom tools via MCP

---

## User Experience Features

### User Feedback Integration

- Intuitively integrate feedback across surfaces and artifacts
- Guide and refine agent work
- Review implementation plans before execution
- Add comments to augment proposed changes

### Task-Based Abstractions

- Task lists for tracking progress
- Implementation plans for transparency
- Walkthroughs for understanding agent actions
- Essential artifacts for building trust

### Knowledge System

Referenced in documentation but details not fully captured. Appears to be a system for storing and retrieving project-specific knowledge that the agent can reference.

### Sandboxing & Strict Mode

- **Sandboxing**: Isolate agent execution for safety
- **Strict Mode**: Additional constraints on agent behavior
- Details not fully captured in this research

---

## Platform & Availability

### Supported Platforms

#### **macOS**
- Versions with Apple security update support (typically current + 2 previous)
- Minimum: macOS 12 (Monterey)
- Apple Silicon: Supported
- Intel: Supported
- **X86 is NOT supported**

#### **Windows**
- Windows 10 (64-bit)
- x64: Supported
- ARM64: Supported

#### **Linux**
- glibc >= 2.28
- glibcxx >= 3.4.25
- Examples: Ubuntu 20, Debian 10, Fedora 36, RHEL 8

### Installation

- Download from https://antigravity.google/download
- Automatic update notifications within the application
- Current version: **1.18.4-5780041996042240** (as of February 2026)

---

## Pricing & Plans

### Individual Plan (Public Preview)
**$0/month** — Available now

**Includes:**
- Access to Gemini 3.1 Pro, Gemini 3 Flash, Claude Sonnet & Opus 4.6, GPT-OSS-120b
- Unlimited tab completions
- Unlimited command requests
- Generous weekly rate limits*

### Developer Plan
**via Google One AI Pro or Ultra subscription** — Available now

**Everything in Individual plus:**
- More generous rate limits*

### Team Plan (Preview)
**via Google Workspace AI Ultra for Business** — Available now

**Everything in Individual plus:**
- More generous rate limits*
- Designed for software development teams

### Organization Plan
**via Google Cloud** — Coming soon

**Features:**
- Fully enterprise-grade solution
- For organizations at scale
- Sign up for notifications

*Rate limits detailed on the plans page (FAQ)

---

## Target Audiences

### 1. **Frontend Developers**
- Case study/video content available
- Focus on UI/UX development workflows

### 2. **Full Stack Developers**
- Case study/video content available
- End-to-end application development

### 3. **Enterprise/Professional Developers**
- Case study/video content available
- Large enterprise codebase support
- Team collaboration features

### 4. **Hobbyist "Vibe-Coders"**
- Casual developers
- Side projects
- Learning and experimentation

---

## Recent Developments (Blog Timeline)

Based on blog posts visible on the site:

1. **Nov 18, 2025** — "Introducing Google Antigravity" (Product)
2. **Nov 20, 2025** — "Nano Banana Pro in Google Antigravity" (Product)
3. **Dec 17, 2025** — "Gemini 3 Flash in Google Antigravity" (Product)
4. **Feb 19, 2026** — "Gemini 3.1 Pro in Google Antigravity" (Product)

**Launch Timeline:** Appears to have launched November 2025 with rapid model additions through February 2026.

---

## APIs & Integration Points

### For Autonomous AI Agent Systems

Google Antigravity has **significant potential for autonomous AI agent systems** like thepopebot:

#### 1. **Skills as Integration Points**

The Skills system is an **open standard** that could be leveraged:

- **Agent-to-Agent Integration**: Create skills that allow Antigravity to call external agents
- **Webhook Skills**: Skills could trigger external webhooks or APIs
- **Custom Tools**: Extend Antigravity with agent-specific capabilities
- **Bidirectional Communication**: External agents could potentially interact via skills

**Example Use Case for thepopebot:**
Create a custom skill at `~/.gemini/antigravity/skills/thepopebot/SKILL.md` that teaches Antigravity how to:
- Create jobs in the thepopebot system
- Check job status
- Integrate thepopebot's autonomous capabilities into Antigravity workflows

#### 2. **MCP (Model Context Protocol) Integration**

MCP appears to be a documented extensibility point for:
- Custom tool integration
- Context providers
- External service connections

This could be a **primary integration vector** for autonomous agents to:
- Provide custom tools to Antigravity
- Inject context from external systems
- Create bidirectional communication channels

#### 3. **Workflows as Automation Points**

Workflows could potentially:
- Call external APIs or webhooks
- Trigger thepopebot jobs
- Orchestrate multi-agent scenarios
- Chain Antigravity actions with external agent actions

#### 4. **Terminal & Browser Access**

The agent's ability to:
- Execute terminal commands (with allow lists)
- Control a browser via the browser subagent
- Access the file system

Means Antigravity could potentially:
- Run CLI tools that interact with external agent APIs
- Use browser automation to trigger web-based agent interfaces
- Read/write configuration files for agent orchestration

#### 5. **Potential API Endpoints**

**Note:** No public REST API was discovered during this research. Integration appears to be primarily through:
- **Skills system** (file-based)
- **MCP protocol** (needs further investigation)
- **Local file system** (rules, workflows, knowledge)
- **CLI/terminal commands** (if Antigravity has a CLI)

### What's NOT Exposed (Limitations)

- No public REST API discovered for remote agent control
- No webhook system for external event triggers
- No documented RPC or gRPC endpoints
- Integration appears to be designed for **local development environment** rather than remote orchestration

---

## Security & Permissions Model

### File Access Control
- **Default**: Agent limited to workspace + `~/.antigravity/` directory
- **Optional**: Can enable non-workspace file access (security risk)

### Terminal Command Execution
- **Configurable policies**: Request Review vs. Always Proceed
- **Allow lists**: Commands that can auto-execute
- **Deny lists**: Commands that are blocked
- **Unix shell matching**: Space-separated token prefix matching
- **PowerShell matching**: Contiguous subsequence matching

### Sandboxing
- Referenced in documentation
- Details not fully captured in this research

---

## Documentation & Resources

### Main Documentation Sections
- Getting Started
- Agent (models, modes, settings)
- Rules / Workflows
- Skills
- Task Groups
- Browser Subagent
- Strict Mode
- Sandboxing
- Tools / MCP
- Artifacts
- Editor (Tab, Command)
- Agent Manager
- Workspaces
- Conversation View
- Browser
- Plans
- Settings
- FAQ

### Support Resources
- Documentation: https://antigravity.google/docs
- Changelog: https://antigravity.google/changelog
- Support: https://antigravity.google/support
- Press: https://antigravity.google/press
- Releases: https://antigravity.google/releases
- Blog: https://antigravity.google/blog

---

## Competitive Positioning

Google Antigravity positions itself as:

1. **Beyond Copilots**: Not just autocomplete or chat, but full autonomous agents
2. **Agent-First Era**: Fundamental rethinking of the IDE for AI-native development
3. **Enterprise Trust**: Built for professional developers with trust and transparency
4. **Multi-Agent Orchestration**: Manage multiple agents simultaneously
5. **Cross-Surface Control**: Unlike competitors focused on just the editor

**Key Differentiators:**
- Browser automation built-in (browser subagent)
- Task-based abstractions (not just chat)
- Implementation plans for transparency
- Multiple frontier models (Google + Anthropic + Open Source)
- Deep Google integration (Vertex AI, Google One, Google Workspace, Google Cloud)

---

## Relevance for Autonomous AI Agent Systems (thepopebot)

### High Relevance Areas

1. **Skills System**
   - **Open standard** for agent extensibility
   - File-based, easy to automate
   - Progressive disclosure (discovery → activation → execution)
   - Could be used to teach Antigravity about external agents

2. **Workflows System**
   - Repeatable automation sequences
   - Markdown-based, easy to generate
   - Slash command invocation
   - Could orchestrate multi-agent scenarios

3. **Terminal Access**
   - Agent can execute commands
   - Could run CLI tools for agent orchestration
   - Allow lists provide security

4. **Browser Subagent**
   - Automated web interaction
   - Could trigger web-based agent interfaces
   - Screenshot and recording capabilities

5. **Multi-Agent Architecture**
   - Already designed for multiple simultaneous agents
   - Workspace isolation
   - Central mission control UI
   - Aligns with thepopebot's multi-agent philosophy

### Integration Strategies for thepopebot

#### Strategy 1: **Skills-Based Integration**
Create custom Antigravity skills that:
- Define how to create thepopebot jobs
- Teach Antigravity when to delegate to external agents
- Provide agent status checking capabilities

#### Strategy 2: **Workflow Orchestration**
Generate Antigravity workflows that:
- Chain Antigravity actions with thepopebot jobs
- Implement agent handoff protocols
- Coordinate multi-agent tasks

#### Strategy 3: **Terminal Bridge**
Build CLI tools that:
- Allow Antigravity to create/manage thepopebot jobs via terminal
- Provide status feedback to Antigravity
- Enable bidirectional communication

#### Strategy 4: **File-Based Communication**
Use the local file system for:
- Writing job definitions Antigravity can read
- Status files Antigravity monitors
- Result artifacts Antigravity processes

#### Strategy 5: **MCP Provider** (Requires Research)
Investigate MCP to potentially:
- Provide thepopebot as an MCP tool
- Inject agent context into Antigravity
- Create custom integration protocols

### What's Missing for Full Integration

1. **No REST API**: Can't remotely control Antigravity
2. **No Webhooks**: Can't send events to Antigravity from external systems
3. **Local-First Design**: Not built for remote/cloud agent orchestration
4. **MCP Documentation**: Need more details on MCP integration
5. **Enterprise APIs**: Organization plan may have additional capabilities (not yet released)

---

## Key Takeaways

1. **Google Antigravity is a full agentic IDE**, not just an AI assistant — it's designed for agents to control the entire development environment.

2. **Multi-model support** gives users choice between Google, Anthropic, and open-source models.

3. **Cross-surface control** (editor, terminal, browser) is unique and powerful for autonomous development.

4. **Skills, Rules, and Workflows** provide three levels of customization:
   - **Skills**: Reusable packages of agent capabilities
   - **Rules**: Constraints and guidance
   - **Workflows**: Repeatable automation sequences

5. **Agent-first architecture** means it's designed for:
   - Multiple simultaneous agents
   - Complex multi-step reasoning
   - Transparent planning and execution
   - User feedback integration

6. **Integration potential** exists primarily through:
   - Skills system (file-based extensibility)
   - MCP protocol (needs investigation)
   - Terminal commands (with security controls)
   - Local file system (rules, workflows, artifacts)

7. **Pricing is aggressive**: Free individual plan with generous limits, paid plans via existing Google subscriptions (One, Workspace, Cloud).

8. **Enterprise focus**: Built for professional developers, large codebases, and team collaboration.

9. **Recent launch**: Launched November 2025, still in rapid development with frequent model additions.

10. **No public API** for remote control — designed as a local development tool, not a cloud service.

---

## Recommendations for thepopebot Integration

### Immediate Opportunities

1. **Create Antigravity Skills** for thepopebot:
   - Document thepopebot's capabilities as skills
   - Enable Antigravity agents to delegate to thepopebot
   - Provide status checking and result retrieval

2. **Experiment with Workflows**:
   - Generate Antigravity workflows that include thepopebot job creation
   - Test agent handoff scenarios
   - Validate multi-agent orchestration patterns

3. **Build CLI Bridge**:
   - Create command-line tools for thepopebot interaction
   - Leverage Antigravity's terminal execution capabilities
   - Implement secure communication via allow lists

### Future Exploration

1. **Investigate MCP Integration**:
   - Research Model Context Protocol documentation
   - Assess feasibility of thepopebot as MCP provider
   - Prototype custom tool integration

2. **Monitor Organization Plan**:
   - Track enterprise features when released
   - Look for additional API or integration capabilities
   - Assess team/organization collaboration features

3. **File-Based Protocols**:
   - Design agent communication protocols via file system
   - Implement job definition standards
   - Create status monitoring systems

4. **Browser Subagent Opportunities**:
   - Explore using browser automation for agent UI interaction
   - Test web-based agent orchestration
   - Leverage screenshot/recording capabilities

---

## Conclusion

Google Antigravity represents a significant evolution in IDE design — moving from "AI-assisted development" to "agent-first development." Its architecture around autonomous agents, multi-model support, cross-surface control, and extensibility through skills/rules/workflows makes it a powerful platform.

For autonomous AI agent systems like thepopebot, Antigravity offers **integration opportunities** primarily through its skills system, workflows, and terminal access. While lacking a traditional REST API, the file-based and local-first design provides alternative integration paths worth exploring.

The platform is in active development (launched November 2025) and may evolve to include more integration points, especially with the upcoming enterprise/organization tier. Worth monitoring for future API capabilities and agent-to-agent communication protocols.

---

**End of Report**
