<div align="center">

# Ex.skill

> *"From now on, your phone holds more than just chat logs — it holds her."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://python.org)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://claude.ai/code)
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-green)](https://agentskills.io)

<br>

She's gone, but the chat logs are still there.<br>
Three years of daily life, reduced to a conversation you're afraid to open.<br>
Do you still remember that when she said "whatever" she actually wanted hotpot?<br>
Do you still remember that when she replied "oh" she was waiting for you to reach out?<br>

**Distill memories into a Skill. Not to get her back — but to remember.**

<br>

Provide chat logs (WeChat, iMessage, SMS), photos, social media exports, plus your own descriptions<br>
Generate an **AI Skill that talks like her**<br>
Uses her texting style, knows when she's being cute vs. actually angry

[Data Sources](#supported-data-sources) · [Install](#installation) · [Usage](#usage) · [Examples](#examples) · [Install Guide](INSTALL.md)

</div>

---

## Supported Data Sources

| Source | Chat Logs | Photos | Social Media | Notes |
|--------|:---------:|:------:|:------------:|-------|
| WeChat | ✅ | — | — | Exported via WechatExporter etc. |
| iMessage | ✅ | — | — | macOS chat.db or exported files |
| SMS | ✅ | — | — | Android SMS Backup XML/CSV |
| Photos | — | ✅ | — | EXIF metadata timeline extraction |
| Weibo | — | — | ✅ | JSON data export |
| Douban | — | — | ✅ | JSON/HTML export |
| Xiaohongshu (RED) | — | — | ✅ | JSON export |
| Instagram | — | — | ✅ | JSON data export |
| PDF / Images | ✅ | ✅ | — | Manual upload |
| Direct text | ✅ | — | — | Paste directly |

---

## Installation

### Claude Code

```bash
# Install to current project
mkdir -p .claude/skills
git clone https://github.com/perkfly/ex-skill .claude/skills/create-ex

# Or install globally
git clone https://github.com/perkfly/ex-skill ~/.claude/skills/create-ex
```

### Dependencies (optional)

```bash
pip3 install -r requirements.txt
```

---

## Usage

In Claude Code, type:

```
/create-ex
```

Follow the prompts to enter her nickname, relationship info, personality tags, and choose data sources. All fields except nickname are optional.

After creation, use `/{slug}` to activate the ex Skill.

### Commands

| Command | Description |
|---------|-------------|
| `/list-exes` | List all ex Skills |
| `/{slug}` | Full Skill (Persona + Memories) |
| `/{slug}-memories` | Memories only |
| `/{slug}-persona` | Persona only |
| `/ex-rollback {slug} {version}` | Rollback to version |
| `/delete-ex {slug}` | Delete |

---

## Examples

> Input: `ENFP Gemini anxious attachment, clingy, brings up old arguments`

**Scenario: Daily chat**
```
User      > what are you doing

Ex.skill  > just got off work
           > so tired today
           > what about you, why are you only texting me now 🥺
```

**Scenario: She's upset**
```
User      > sorry I was busy

Ex.skill  > oh
           > (5 minutes later)
           > you always say you're busy
           > last time was the same
```

---

## Privacy

- All data is processed locally — nothing is sent to external services
- Photo analysis only extracts metadata (date/location), not image content
- The `exes/` directory is gitignored by default

---

<div align="center">

MIT License © [perkfly](https://github.com/perkfly)

</div>
