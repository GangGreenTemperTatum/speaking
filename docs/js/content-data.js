/**
 * Content Data Module
 * Single source of truth for all portfolio content
 */

// Conference data
const conferences = [
    {
        id: "apidays-2023",
        name: "API Days",
        displayName: "API Days 2023 - AI/ML Security at the API level",
        year: "2023",
        icon: "fas fa-cloud",
        description: "Talks on AI/ML Security at API level",
        path: "apidays",
        subdir: null,
        localPath: "conferences/apidays/2023",
        type: "conference",
        date: "2023-06-28",
        featured: true
    },
    {
        id: "apisec-2023",
        name: "APISec",
        displayName: "APISec 2023 - Securing LLM and NLP APIs",
        year: "2023",
        icon: "fas fa-shield-alt",
        description: "Securing LLM and NLP APIs",
        path: "apisec",
        subdir: "december",
        localPath: "conferences/apisec/2023/december",
        type: "conference",
        date: "2023-12-15",
        featured: true
    },
    {
        id: "dc604-2023",
        name: "DC604",
        displayName: "DC604 2023 - Hacker Summer Camp",
        year: "2023",
        icon: "fas fa-users",
        description: "Hacker Summer Camp - Poisoning Web Training Data",
        path: "dc604",
        subdir: "hacker-summer-camp-23",
        localPath: "conferences/dc604/2023/hacker-summer-camp-23",
        type: "conference",
        date: "2023-08-15",
        featured: true
    },
    {
        id: "interface-2023",
        name: "Interface",
        displayName: "INTERFACE ApiSec 2023",
        year: "2023",
        icon: "fas fa-code",
        description: "Language AI Security at the API level - Avoiding Hacks, Injections and Breaches",
        path: "interface",
        subdir: null,
        localPath: "conferences/interface",
        type: "conference",
        date: "2023-06-28",
        featured: true
    },
    {
        id: "owasp-vancouver-2023",
        name: "OWASP Vancouver",
        displayName: "OWASP Vancouver - Language AI Security",
        year: "2023",
        icon: "fas fa-shield-virus",
        description: "Language AI Security at the API level",
        path: "owasp/owasp-vancouver",
        subdir: "november",
        localPath: "conferences/owasp/owasp-vancouver/2023/november",
        type: "conference",
        date: "2023-11-13",
        featured: true
    },
    {
        id: "lakera-2023",
        name: "Lakera AI",
        displayName: "Lakera December 2023",
        year: "2023",
        icon: "fas fa-shield-alt",
        description: "How to Secure AI Applications: Lessons from OWASP's Top 10 for LLMs",
        path: "lakera/december",
        subdir: "2023",
        localPath: "conferences/lakera/december/2023",
        type: "conference",
        date: "2023-12-01",
        featured: true
    },
    {
        id: "mako-lab-2023",
        name: "Mako Lab",
        displayName: "Mako Lab 2023",
        year: "2023",
        icon: "fas fa-flask",
        description: "Talks on AI/ML Security and LLM Application Safety",
        path: "mako-lab",
        subdir: null,
        localPath: "conferences/mako-lab",
        type: "conference",
        date: "2023-10-01",
        featured: false
    },
    {
        id: "in-cyber-forum-2024",
        name: "In-Cyber Forum",
        displayName: "In-Cyber Forum 2024",
        year: "2024",
        icon: "fas fa-globe",
        description: "Language AI Security at the API level",
        path: "in-cyber-forum",
        subdir: "october",
        localPath: "conferences/in-cyber-forum/2024/october",
        type: "conference",
        date: "2024-10-29",
        featured: true
    },
    {
        id: "isaca-2024",
        name: "ISACA",
        displayName: "ISACA Application Security Sector Day",
        year: "2024",
        icon: "fas fa-certificate",
        description: "Application Security Sector Day",
        path: "isaca",
        subdir: "feb/appsec-security-sector-days",
        localPath: "conferences/isaca/2024/feb/appsec-security-sector-days",
        type: "conference",
        date: "2024-02-15",
        featured: true
    },
    {
        id: "owasp-toronto-2024",
        name: "OWASP Toronto",
        displayName: "OWASP Toronto - OWASP Top 10 for LLM",
        year: "2024",
        icon: "fas fa-shield-virus",
        description: "OWASP Top 10 for LLM Applications",
        path: "owasp/owasp-toronto",
        subdir: "june",
        localPath: "conferences/owasp/owasp-toronto/2024/june",
        type: "conference",
        date: "2024-06-11",
        featured: true
    },
    {
        id: "rsa-2024",
        name: "RSA Conference",
        displayName: "RSA Conference 2024",
        year: "2024",
        icon: "fas fa-lock",
        description: "Keynote on AI/ML Security",
        path: "rsa-usa",
        subdir: "may",
        localPath: "conferences/rsa-usa/2024/may",
        type: "conference",
        date: "2024-05-15",
        featured: true
    },
    {
        id: "lakera-2024",
        name: "Lakera AI",
        displayName: "Lakera April 2024",
        year: "2024",
        icon: "fas fa-shield-alt",
        description: "Decoding OWASP Large Language Model Security Verification Standard (LLMSVS)",
        path: "lakera/april",
        subdir: "2024",
        localPath: "conferences/lakera/april/2024",
        type: "conference",
        date: "2024-04-15",
        featured: true
    },
    {
        id: "mako-lab-2024",
        name: "Mako Lab",
        displayName: "Mako Lab 2024",
        year: "2024",
        icon: "fas fa-flask",
        description: "Talks on AI/ML Security and LLM Application Safety",
        path: "mako-lab",
        subdir: null,
        localPath: "conferences/mako-lab",
        type: "conference",
        date: "2024-03-01",
        featured: false
    },
    {
        id: "mlops-community-2024",
        name: "MLOps Community",
        displayName: "MLOps Community Conference",
        year: "2024",
        icon: "fas fa-cogs",
        description: "AI in Production - MLOps Security Panel",
        path: "mlopscommunity",
        subdir: "february",
        localPath: "conferences/mlopscommunity/2024/february",
        type: "conference",
        date: "2024-02-20",
        featured: true
    },
    {
        id: "owasp-toronto-march-2025",
        name: "OWASP Toronto",
        displayName: "OWASP Toronto - Shiny Rocks in Offensive AI",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "Shiny Rocks in Offensive AI",
        path: "owasp/owasp-toronto",
        subdir: "march",
        localPath: "conferences/owasp/owasp-toronto/2025/march",
        type: "conference",
        date: "2025-03-19",
        featured: true
    },
    {
        id: "owasp-atlanta-2025",
        name: "OWASP Atlanta",
        displayName: "OWASP Atlanta - Harnessing AI for Offensive Security",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "Harnessing AI for Offensive Security",
        path: "owasp/owasp-atlanta",
        subdir: "june",
        localPath: "conferences/owasp/owasp-atlanta/2025/june",
        type: "conference",
        date: "2025-06-15",
        featured: true
    },
    {
        id: "owasp-cairo-2025",
        name: "OWASP Cairo",
        displayName: "OWASP Cairo - AI, Security, and Hacking Tools",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "AI, Security, and Hacking Tools",
        path: "owasp/owasp-cairo",
        subdir: "july",
        localPath: "conferences/owasp/owasp-cairo/2025/july",
        type: "conference",
        date: "2025-07-19",
        featured: true
    },
    {
        id: "isc2-2025",
        name: "ISC2",
        displayName: "ISC2 - Behind the Prompt",
        year: "2025",
        icon: "fas fa-certificate",
        description: "Behind the Prompt: Exposing and Mitigating the Top LLM Vulnerabilities",
        path: "isc2",
        subdir: "july",
        localPath: "conferences/isc2/2025/july",
        type: "conference",
        date: "2025-07-20",
        featured: true
    },
    {
        id: "offbyonesecurity-2025",
        name: "Off By One Security",
        displayName: "Building Offensive Security Agents",
        year: "2025",
        icon: "fas fa-bug",
        description: "Building and Deploying Offensive Security Agents with Dreadnode",
        path: "offbyonesecurity",
        subdir: "july",
        localPath: "conferences/offbyonesecurity/2025/july",
        type: "conference",
        date: "2025-07-25",
        featured: true
    },
    {
        id: "bugcrowd-bugboss-2025",
        name: "BugCrowd",
        displayName: "BugCrowd BugBoss v3 Show n Tell",
        year: "2025",
        icon: "fas fa-bug",
        description: "BugCrowd Bugboss v3 Show and Tell",
        path: "bugcrowd",
        subdir: "july/bugboss",
        localPath: "conferences/bugcrowd/2025/july/bugboss",
        type: "conference",
        date: "2025-07-10",
        featured: true
    },
    {
        id: "bugcrowd-rhic-2025",
        name: "BugCrowd",
        displayName: "BugCrowd x Rhode Island College RHIC",
        year: "2025",
        icon: "fas fa-bug",
        description: "BugCrowd x Dreadnode Crucible: Rhode Island College Cyber Range",
        path: "bugcrowd",
        subdir: "july/rhic",
        localPath: "conferences/bugcrowd/2025/july/rhic",
        type: "conference",
        date: "2025-07-15",
        featured: true
    },
    {
        id: "defcon-2025",
        name: "DEFCON",
        displayName: "DEFCON Bug Bounty Village",
        year: "2025",
        icon: "fas fa-skull-crossbones",
        description: "Misaligned: AI Jailbreaking Panel with Basi Team Six (BT6) & Jason Haddix",
        path: "defcon",
        subdir: "august/bb_village",
        localPath: "conferences/defcon/2025/august/bb_village",
        type: "conference",
        date: "2025-08-10",
        featured: true
    },
    {
        id: "promptorgtfo-2025",
        name: "PromptorGTFO",
        displayName: "PromptorGTFO 2025",
        year: "2025",
        icon: "fas fa-terminal",
        description: "Deploying Offensive AI with Modular Agents",
        path: "promptorgtfo",
        subdir: "august",
        localPath: "conferences/promptorgtfo/2025/august",
        type: "conference",
        date: "2025-08-20",
        featured: true
    },
    {
        id: "owasp-llm-apps-march-2025",
        name: "OWASP LLM Apps",
        displayName: "OWASP LLM Apps - Sandboxing AI Models",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps - Ep.4",
        path: "owasp/owasp-llm-apps",
        subdir: "march",
        localPath: "conferences/owasp/owasp-llm-apps/2025/march",
        type: "conference",
        date: "2025-03-01",
        featured: true
    },
    {
        id: "owasp-gen-ai-summit-2025",
        name: "OWASP Gen AI Summit",
        displayName: "Gen AI Application Security & Risk Summit",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "The Stochastic Shall Inherit the Earth (But Let's Secure It First)",
        path: "owasp/owasp-llm-apps",
        subdir: "october",
        localPath: "conferences/owasp/owasp-llm-apps/2025/october",
        type: "conference",
        date: "2025-10-15",
        featured: true
    },
    {
        id: "rsa-2025",
        name: "RSA Conference",
        displayName: "RSA USA Conference 2025",
        year: "2025",
        icon: "fas fa-lock",
        description: "OWASP AI Security Summit — Safeguarding GenAI & Agentic Apps",
        path: "rsa-usa",
        subdir: "april",
        localPath: "conferences/rsa-usa/2025/april",
        type: "conference",
        date: "2025-04-15",
        featured: true
    },
    {
        id: "owasp-toronto-sept-2025",
        name: "OWASP Toronto",
        displayName: "OWASP Toronto - Caido Power User",
        year: "2025",
        icon: "fas fa-shield-virus",
        description: "Becoming a Caido Power User: From Recon to Root",
        path: "owasp/owasp-toronto",
        subdir: "september",
        localPath: "conferences/owasp/owasp-toronto/2025/september",
        type: "conference",
        date: "2025-09-17",
        featured: true
    },
    {
        id: "bugcrowd-edprotect-2025",
        name: "BugCrowd",
        displayName: "EdProtect: Edtech Security Symposium",
        year: "2025",
        icon: "fas fa-bug",
        description: "Bug Bounty Student Training at UC Berkeley",
        path: "bugcrowd",
        subdir: "september/edprotect",
        localPath: "conferences/bugcrowd/2025/september/edprotect",
        type: "conference",
        date: "2025-09-20",
        featured: true
    },
    {
        id: "bugcrowd-rit-2025",
        name: "BugCrowd",
        displayName: "RITSEC - LLM AI AppSec Workshop",
        year: "2025",
        icon: "fas fa-bug",
        description: "LLM AI Application Security hacking presentation and workshop",
        path: "bugcrowd",
        subdir: "september/rit",
        localPath: "conferences/bugcrowd/2025/september/rit",
        type: "conference",
        date: "2025-09-25",
        featured: true
    },
    {
        id: "bugcrowd-ut-2025",
        name: "BugCrowd",
        displayName: "University of Texas - Austin",
        year: "2025",
        icon: "fas fa-bug",
        description: "BugCrowd College Program Educational Event",
        path: "bugcrowd",
        subdir: "october/ut",
        localPath: "conferences/bugcrowd/2025/october/ut",
        type: "conference",
        date: "2025-10-05",
        featured: true
    },
    {
        id: "bugcrowd-wraven-2025",
        name: "BugCrowd",
        displayName: "WRAVEN x BugCrowd",
        year: "2025",
        icon: "fas fa-bug",
        description: "A Bug Hunter's Journey from CTFs to Cash",
        path: "bugcrowd",
        subdir: "october/wraven",
        localPath: "conferences/bugcrowd/2025/october/wraven",
        type: "conference",
        date: "2025-10-10",
        featured: true
    },
    {
        id: "bugcrowd-cnu-2025",
        name: "BugCrowd",
        displayName: "CNU CyberClub",
        year: "2025",
        icon: "fas fa-bug",
        description: "Prompt to Pwn: Offensive AI Security",
        path: "bugcrowd",
        subdir: "october/cnu",
        localPath: "conferences/bugcrowd/2025/october/cnu",
        type: "conference",
        date: "2025-10-15",
        featured: true
    },
    {
        id: "bugcrowd-merritt-2025",
        name: "BugCrowd",
        displayName: "Merritt College",
        year: "2025",
        icon: "fas fa-bug",
        description: "Shifting to the Bug Bounty Hunter's Methodology",
        path: "bugcrowd",
        subdir: "october/merritcollege",
        localPath: "conferences/bugcrowd/2025/october/merritcollege",
        type: "conference",
        date: "2025-10-20",
        featured: false
    },
    {
        id: "bugcrowd-umbc-2025",
        name: "BugCrowd",
        displayName: "UMBC CyberDawgs",
        year: "2025",
        icon: "fas fa-bug",
        description: "BugCrowd College Program Educational Event",
        path: "bugcrowd",
        subdir: "november/umbc",
        localPath: "conferences/bugcrowd/2025/november/umbc",
        type: "conference",
        date: "2025-11-01",
        featured: false
    },
    {
        id: "bugcrowd-unb-2025",
        name: "BugCrowd",
        displayName: "University of New Brunswick",
        year: "2025",
        icon: "fas fa-bug",
        description: "BugCrowd College Program Educational Event",
        path: "bugcrowd",
        subdir: "november/unb",
        localPath: "conferences/bugcrowd/2025/november/unb",
        type: "conference",
        date: "2025-11-10",
        featured: false
    },
    {
        id: "cyber-toronto-2025",
        name: "CyberToronto",
        displayName: "CyberToronto 2025",
        year: "2025",
        icon: "fas fa-users",
        description: "Community Leaders Panel - Advancing Cybersecurity",
        path: "cyber-toronto",
        subdir: "december",
        localPath: "conferences/cyber-toronto/2025/december",
        type: "conference",
        date: "2025-12-01",
        featured: true
    },
    {
        id: "taico-2026",
        name: "TAICO",
        displayName: "TAICO - Toronto AI and Cybersecurity",
        year: "2026",
        icon: "fas fa-brain",
        description: "First TAICO meetup of 2026 featuring Q&A and lightning talks",
        path: "taico",
        subdir: "february",
        localPath: "conferences/taico/2026/february",
        type: "conference",
        date: "2026-02-15",
        featured: true
    }
];

// Podcast data
const podcasts = [
    {
        id: "bare-knuckles-2025",
        name: "Bare Knuckles and Brass Tacks",
        year: "2025",
        icon: "fas fa-fist-raised",
        description: "Discussion about AI and ML security",
        path: "bareknuckles_and_brass_tacks",
        type: "podcast",
        date: "2025-01-15",
        featured: true
    },
    {
        id: "chai-chat-2023",
        name: "ChAI Chat Podcast",
        year: "2023",
        icon: "fas fa-mug-hot",
        description: "Conversations on AI ethics and security challenges",
        path: "chai_chat_podcast",
        type: "podcast",
        date: "2023-09-15",
        featured: true
    },
    {
        id: "f5-devcentral-2023",
        name: "F5 DevCentral",
        year: "2023",
        icon: "fas fa-server",
        description: "Technical discussions on API security and AI integration",
        path: "f5_dev_central",
        type: "podcast",
        date: "2023-10-01",
        featured: true
    },
    {
        id: "mlops-community-2023",
        name: "MLOps Community",
        year: "2023",
        icon: "fas fa-cogs",
        description: "Exploring the intersection of MLOps and security",
        path: "mlops_community/2023/november",
        type: "podcast",
        date: "2023-11-15",
        featured: true
    },
    {
        id: "owasp-llm-apps-2024",
        name: "OWASP LLM Apps Podcast",
        year: "2024",
        icon: "fas fa-shield-virus",
        description: "Security considerations for LLM applications",
        path: "owasp/owasp-llm-apps-podcast",
        type: "podcast",
        date: "2024-03-01",
        featured: true
    },
    {
        id: "software-testing-2024",
        name: "Software Testing & Quality Talks",
        year: "2024",
        icon: "fas fa-check-circle",
        description: "Testing methodologies for AI systems",
        path: "software_testing_and_quality_talks",
        type: "podcast",
        date: "2024-05-15",
        featured: true
    },
    {
        id: "synack-2023",
        name: "Synack Podcast",
        year: "2023",
        icon: "fas fa-bug",
        description: "Ethical hacking and AI security vulnerabilities",
        path: "synack",
        type: "podcast",
        date: "2023-08-01",
        featured: true
    },
    {
        id: "boring-appsec-2025",
        name: "The Boring AppSec Podcast",
        year: "2025",
        icon: "fas fa-shield-alt",
        description: "AI Security Deep Dive - Modern AI attack vectors",
        path: "the_boring_appsec_podcast",
        type: "podcast",
        date: "2025-03-01",
        featured: true
    }
];

// Publication data
const publications = [
    {
        id: "bugcrowd-author-profile",
        title: "Bugcrowd Author Profile - Ads Dawson",
        publisher: "BugCrowd",
        description: "Complete collection of published articles on AI security, red teaming, and vulnerability research.",
        url: "https://www.bugcrowd.com/blog/author/ads-dawson/",
        icon: "fas fa-user-edit",
        year: "2025",
        type: "publication",
        date: "2025-01-01",
        featured: true
    },
    {
        id: "arxiv-maif-2025",
        title: "arXiv:2511.15097 - MAIF: Enforcing AI Trust and Provenance",
        publisher: "arXiv",
        description: "Academic paper on enforcing AI trust and provenance through an artifact-centric agentic paradigm.",
        url: "https://arxiv.org/abs/2511.15097",
        icon: "fas fa-file-alt",
        year: "2025",
        type: "publication",
        date: "2025-11-20",
        featured: true
    },
    {
        id: "arxiv-airtbench-2025",
        title: "arXiv:2506.14682 - AIRTBench: AI Red Teaming Capabilities",
        publisher: "arXiv",
        description: "AI red teaming benchmark for evaluating language models' ability to autonomously discover vulnerabilities.",
        url: "https://arxiv.org/abs/2506.14682",
        icon: "fas fa-file-alt",
        year: "2025",
        type: "publication",
        date: "2025-06-15",
        featured: true
    },
    {
        id: "dreadnode-turtle-2025",
        title: "AI Red Teaming Case Study: Claude 3.7 Sonnet Solves the Turtle Challenge",
        publisher: "Dreadnode",
        description: "Research where AI models crushed a cybersecurity challenge that 94% of human hackers fail.",
        url: "https://dreadnode.io/blog/ai-red-teaming-case-study-claude-sonnet-solves-turtle",
        icon: "fas fa-skull",
        year: "2025",
        type: "publication",
        date: "2025-08-01",
        featured: true
    },
    {
        id: "dreadnode-airtbench-2025",
        title: "Do LLM Agents Have AI Red Team Capabilities?",
        publisher: "Dreadnode",
        description: "Introduction to AIRTBench, an AI red teaming framework testing LLMs against CTF challenges.",
        url: "https://dreadnode.io/blog/ai-red-team-benchmark",
        icon: "fas fa-skull",
        year: "2025",
        type: "publication",
        date: "2025-07-01",
        featured: true
    },
    {
        id: "arxiv-automation-2024",
        title: "arXiv:2504.19855 - The Automation Advantage in AI Red Teaming",
        publisher: "arXiv",
        description: "Academic paper on automated approaches to AI security testing",
        url: "https://arxiv.org/abs/2504.19855",
        icon: "fas fa-file-alt",
        year: "2024",
        type: "publication",
        date: "2024-04-20",
        featured: true
    },
    {
        id: "inside-mind-hacker-2024",
        title: "Inside the Mind of a Hacker 2024 Edition",
        publisher: "BugCrowd",
        description: "Analysis of hacker motivations, methods, and impact in the evolving security landscape",
        url: "https://www.bugcrowd.com/blog/inside-the-mind-of-a-hacker-2024-edition/",
        icon: "fas fa-bug",
        year: "2024",
        type: "publication",
        date: "2024-12-01",
        featured: true
    },
    {
        id: "hacker-spotlight-2023",
        title: "Hacker Spotlight: Ads Dawson",
        publisher: "BugCrowd",
        description: "Profile highlighting journey, methodologies, and contributions to security research",
        url: "https://www.bugcrowd.com/blog/hacker-spotlight-ads-dawson/",
        icon: "fas fa-bug",
        year: "2023",
        type: "publication",
        date: "2023-10-01",
        featured: true
    },
    {
        id: "cohere-state-ai-security",
        title: "The State of AI Security",
        publisher: "Cohere",
        description: "An in-depth look at current AI security challenges",
        url: "https://cohere.com/blog/the-state-of-ai-security",
        icon: "fas fa-brain",
        year: "2023",
        type: "publication",
        date: "2023-06-01",
        featured: true
    },
    {
        id: "cohere-steve-wilson",
        title: "Straight talk on AI security with Exabeam's Steve Wilson",
        publisher: "Cohere",
        description: "Interview discussing AI security challenges and solutions",
        url: "https://cohere.com/blog/straight-talk-on-ai-security-with-exabeams-steve-wilson",
        icon: "fas fa-brain",
        year: "2023",
        type: "publication",
        date: "2023-07-01",
        featured: false
    },
    {
        id: "cohere-gen-ai-changed",
        title: "How generative AI has changed security",
        publisher: "Cohere",
        description: "Analysis of the security landscape in the era of generative AI",
        url: "https://cohere.com/blog/how-generative-ai-has-changed-security-2",
        icon: "fas fa-brain",
        year: "2023",
        type: "publication",
        date: "2023-08-01",
        featured: false
    },
    {
        id: "cohere-enterprise-ai",
        title: "Enterprise AI security: Deploying LLM applications safely",
        publisher: "Cohere",
        description: "Guidelines for secure enterprise LLM deployment",
        url: "https://cohere.com/blog/enterprise-ai-security-deploying-llm-applications-safely",
        icon: "fas fa-brain",
        year: "2023",
        type: "publication",
        date: "2023-09-01",
        featured: false
    },
    {
        id: "mission-impossible-2025",
        title: "What Mission Impossible taught us about AI: The hacker roots of a face swap",
        publisher: "BugCrowd",
        description: "Is Tom Cruise the original deep fake hacker?",
        url: "https://www.bugcrowd.com/blog/what-mission-impossible-taught-us-about-ai-the-hacker-roots-of-a-face-swap/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-02-01",
        featured: true
    },
    {
        id: "hacked-big-leagues-2025",
        title: "How I hacked my way to the big leagues",
        publisher: "BugCrowd",
        description: "Breaking things for fun and profit - Thought Leadership",
        url: "https://www.bugcrowd.com/blog/how-i-hacked-my-way-to-the-big-leagues-fat-bounties-interviews-on-nasdaq-and-advisory-boards/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-03-01",
        featured: true
    },
    {
        id: "rigging-system-2025",
        title: "Rigging the system: The art of AI exploits",
        publisher: "BugCrowd",
        description: "Leveraging agents, crafting exploits, and mining the hidden gems of AI security",
        url: "https://www.bugcrowd.com/blog/rigging-the-system-the-art-of-ai-exploits/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-04-01",
        featured: true
    },
    {
        id: "hacking-dspy-2025",
        title: "Hacking AI applications: In the trenches with DSPy",
        publisher: "BugCrowd",
        description: "An in-depth exploration of automated AI red teaming using DSPy",
        url: "https://www.bugcrowd.com/blog/hacking-llm-applications-in-the-trenches-with-dspy/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-05-01",
        featured: true
    },
    {
        id: "hacking-llm-2025",
        title: "Hacking LLM applications: A meticulous hacker's two cents",
        publisher: "BugCrowd",
        description: "Insights into vulnerabilities specific to LLM applications",
        url: "https://www.bugcrowd.com/blog/hacking-llm-applications-a-meticulous-hackers-two-cents/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-06-01",
        featured: true
    },
    {
        id: "hacking-sidekick-2025",
        title: "A low-cost hacking sidekick: Baby steps to using offensive AI agents",
        publisher: "BugCrowd",
        description: "Guide to leveraging AI for ethical hacking",
        url: "https://www.bugcrowd.com/blog/a-low-cost-hacking-sidekick-baby-steps-to-using-offensive-ai-agents/",
        icon: "fas fa-bug",
        year: "2025",
        type: "publication",
        date: "2025-07-01",
        featured: true
    },
    {
        id: "ai-native-llm-security",
        title: "AI Native LLM Security",
        publisher: "Packt Publishing",
        description: "A comprehensive guide exploring adversarial AI attacks and security challenges",
        url: "https://www.packtpub.com/en-ca/product/ai-native-llm-security-9781836203742",
        icon: "fas fa-book",
        year: "2025",
        type: "publication",
        date: "2025-12-01",
        featured: true
    },
    {
        id: "lakera-report-2024",
        title: "Lakera 2024 GenAI Security Readiness Report",
        publisher: "Lakera",
        description: "Contributing advisor to the Lakera 2024 GenAI Security Readiness Report",
        url: "https://lakera-marketing-public.s3.eu-west-1.amazonaws.com/Lakera_AI_Global_GenAI_Security_Readiness_Report.pdf",
        icon: "fas fa-shield-alt",
        year: "2024",
        type: "publication",
        date: "2024-12-01",
        featured: true
    },
    {
        id: "lakera-report-2025",
        title: "Lakera 2025 GenAI Security Readiness Report",
        publisher: "Lakera",
        description: "Contributing advisor to the Lakera 2025 GenAI Security Readiness Report",
        url: "https://www.lakera.ai/genai-security-report-2025",
        icon: "fas fa-shield-alt",
        year: "2025",
        type: "publication",
        date: "2025-01-15",
        featured: true
    },
    {
        id: "owasp-top-10-llm",
        title: "OWASP Top 10 for LLM Applications",
        publisher: "OWASP",
        description: "Contributing author to the OWASP Top 10 for LLM Applications guide",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        icon: "fas fa-shield-virus",
        year: "2023",
        type: "publication",
        date: "2023-08-01",
        featured: true
    }
];

// Volunteering data
const volunteering = [
    {
        id: "caido-ambassador",
        title: "Hacker Ambassador",
        organization: "Caido",
        description: "Hacker/community ambassador contributing feature and enhancement development work, custom plugins.",
        sector: "Science & Technology",
        date: "2024 – Present",
        dateStart: "2024-01-01",
        icon: "fas fa-shield-alt",
        year: "2024",
        url: "https://caido.io/",
        type: "volunteering",
        featured: true
    },
    {
        id: "bugcrowd-advisory",
        title: "Hacker Advisory Board Member",
        organization: "Bugcrowd",
        description: "Representing the global hacker community on Bugcrowd's Hacker Advisory Board.",
        sector: "Science & Technology",
        date: "Nov 2024 – Present",
        dateStart: "2024-11-01",
        icon: "fas fa-bug",
        year: "2024",
        url: "https://www.bugcrowd.com/blog/what-is-bugcrowds-hacker-advisory-board/",
        type: "volunteering",
        featured: true
    },
    {
        id: "mitre-ai-wg",
        title: "Member – Artificial Intelligence Working Group",
        organization: "MITRE",
        description: "Contributing to AI security standards and working group initiatives.",
        sector: "Science & Technology",
        date: "Jul 2024 – Present",
        dateStart: "2024-07-01",
        icon: "fas fa-brain",
        year: "2024",
        url: "https://cwe.mitre.org/community/working_groups.html",
        type: "volunteering",
        featured: true
    },
    {
        id: "owasp-llm-lead",
        title: "Technical Lead & Founding Member",
        organization: "OWASP Top 10 for LLM Applications",
        description: "Led the project from inception to becoming an OWASP Flagship.",
        sector: "Science & Technology",
        date: "May 2023 – Present",
        dateStart: "2023-05-01",
        icon: "fas fa-shield-virus",
        year: "2023",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        type: "volunteering",
        featured: true
    }
];

// Television data
const television = [
    {
        id: "nasdaq-tradetalks-2025",
        name: "NASDAQ TradeTalks",
        year: "2025",
        icon: "fas fa-chart-line",
        description: "The Ever-Changing Landscape of AI Safety",
        path: "nasdaq-tradetalks",
        date: "2025-01-15",
        videoUrl: "https://www.youtube.com/watch?v=kWJyrbWsRNk",
        type: "television",
        featured: true
    }
];

// Zone configuration
const zones = {
    conference: {
        name: "Conference Zone",
        color: "#3b82f6", // Blue
        icon: "fas fa-microphone-alt",
        description: "Security conferences and speaking engagements"
    },
    podcast: {
        name: "Podcast Zone",
        color: "#a855f7", // Purple
        icon: "fas fa-podcast",
        description: "Podcast appearances and interviews"
    },
    publication: {
        name: "Publication Zone",
        color: "#22c55e", // Green
        icon: "fas fa-book",
        description: "Articles, papers, and publications"
    },
    volunteering: {
        name: "Volunteer Zone",
        color: "#f97316", // Orange
        icon: "fas fa-hands-helping",
        description: "Community involvement and volunteering"
    },
    television: {
        name: "TV Zone",
        color: "#ef4444", // Red
        icon: "fas fa-tv",
        description: "Television appearances"
    }
};

// Get featured content (most recent from each category)
function getFeaturedContent() {
    const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);
    
    return {
        conferences: conferences.filter(c => c.featured).sort(sortByDate).slice(0, 8),
        podcasts: podcasts.filter(p => p.featured).sort(sortByDate).slice(0, 5),
        publications: publications.filter(p => p.featured).sort(sortByDate).slice(0, 8),
        volunteering: volunteering.filter(v => v.featured),
        television: television.filter(t => t.featured)
    };
}

// Get random featured item from a zone
function getRandomFeaturedItem(zoneType) {
    const featured = getFeaturedContent();
    const items = featured[zoneType];
    if (!items || items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
}

// Get content by ID
function getContentById(id) {
    const allContent = [...conferences, ...podcasts, ...publications, ...volunteering, ...television];
    return allContent.find(item => item.id === id);
}

// Get all content for archive view
function getAllContent() {
    return {
        conferences: conferences.sort((a, b) => new Date(b.date) - new Date(a.date)),
        podcasts: podcasts.sort((a, b) => new Date(b.date) - new Date(a.date)),
        publications: publications.sort((a, b) => new Date(b.date) - new Date(a.date)),
        volunteering: volunteering.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)),
        television: television.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
}

// Filter content by year
function filterByYear(content, year) {
    if (year === 'all') return content;
    return content.filter(item => item.year === year);
}

// Search content
function searchContent(query, contentType = 'all') {
    const allContent = getAllContent();
    const searchIn = contentType === 'all' ? 
        [...allContent.conferences, ...allContent.podcasts, ...allContent.publications, ...allContent.volunteering, ...allContent.television] :
        allContent[contentType];
    
    const lowerQuery = query.toLowerCase();
    return searchIn.filter(item => {
        const text = `${item.name || item.title} ${item.description} ${item.organization || item.publisher || ''}`.toLowerCase();
        return text.includes(lowerQuery);
    });
}

// Export for ES modules and global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        conferences,
        podcasts,
        publications,
        volunteering,
        television,
        zones,
        getFeaturedContent,
        getRandomFeaturedItem,
        getContentById,
        getAllContent,
        filterByYear,
        searchContent
    };
}

// Global access for browser
if (typeof window !== 'undefined') {
    window.ContentData = {
        conferences,
        podcasts,
        publications,
        volunteering,
        television,
        zones,
        getFeaturedContent,
        getRandomFeaturedItem,
        getContentById,
        getAllContent,
        filterByYear,
        searchContent
    };
}
