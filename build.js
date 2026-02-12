const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, 'docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'data', 'content.json');

// Ensure the data directory exists
fs.ensureDirSync(path.dirname(OUTPUT_FILE));

// Main content object that will be converted to JSON
const content = {
  conferences: [],
  podcasts: [],
  publications: []
};

// Process conferences
const conferenceOrgs = [
  { id: "apidays", years: ["2023"] },
  { id: "apisec", years: ["2023"] },
  { id: "bugcrowd", subDirs: ["2025/july/bugboss", "2025/july/rhic", "2025/september/edprotect", "2025/september/rit", "2025/october/wraven", "2025/october/ut", "2025/october/cnu"], years: ["2025"] },
  { id: "dc604", years: ["2023"] },
  { id: "defcon", subPaths: [{path: "2025/august/bb_village", year: "2025"}] },
  { id: "in-cyber-forum", years: ["2024"] },
  { id: "interface", years: ["2023"] },
  { id: "isaca", years: ["2024"] },
  { id: "isc2", years: ["2025"] },
  { id: "lakera", subPaths: [{path: "december/2023", year: "2023"}, {path: "april/2024", year: "2024"}] },
  { id: "mako-lab", years: ["2023", "2024"] },
  { id: "mlopscommunity", years: ["2024"] },
  { id: "offbyonesecurity", subPaths: [{path: "2025/july", year: "2025"}] },
  { id: "owasp", subDirs: [{name: "owasp-cairo", years: ["2025"]}, {name: "owasp-toronto", subPaths: [{path: "2024/june", year: "2024"}, {path: "2025/march", year: "2025"}, {path: "2025/september", year: "2025"}]}, {name: "owasp-vancouver", years: ["2023"]}, {name: "owasp-atlanta", years: ["2025"]}, {name: "owasp-llm-apps", subPaths: [{path: "2025/march", year: "2025"}, {path: "2025/october", year: "2025"}]}] },
  { id: "rsa-usa", years: ["2024", "2025"] },
  { id: "taico", subPaths: [{path: "2026/february", year: "2026"}] }
];

// Map directory names to display names and icons
const contentMap = {
  "apidays": { name: "API Days", icon: "fas fa-cloud" },
  "apisec": { name: "APISec", icon: "fas fa-shield-alt" },
  "bugcrowd": { name: "BugCrowd", icon: "fas fa-bug" },
  "dc604": { name: "DC604", icon: "fas fa-users" },
  "defcon": { name: "DEFCON", icon: "fas fa-skull-crossbones" },
  "in-cyber-forum": { name: "In-Cyber Forum", icon: "fas fa-globe" },
  "interface": { name: "Interface", icon: "fas fa-code" },
  "isaca": { name: "ISACA", icon: "fas fa-certificate" },
  "isc2": { name: "ISC2", icon: "fas fa-certificate" },
  "lakera": { name: "Lakera AI", icon: "fas fa-shield-alt" },
  "mako-lab": { name: "Mako Lab", icon: "fas fa-flask" },
  "mlopscommunity": { name: "MLOps Community", icon: "fas fa-cogs" },
  "offbyonesecurity": { name: "Off By One Security", icon: "fas fa-bug" },
  "owasp": { name: "OWASP", icon: "fas fa-shield-virus" },
  "packt": { name: "Packt Publishing", icon: "fas fa-book" },
  "rsa-usa": { name: "RSA Conference", icon: "fas fa-lock" },
  "taico": { name: "TAICO", icon: "fas fa-brain" }
};

// Create conference entries
conferenceOrgs.forEach(org => {
  if (org.id === 'owasp' && org.subDirs) {
    org.subDirs.forEach(subDirObj => {
      const subDir = subDirObj.name || subDirObj;
      
      // Handle subPaths for owasp-toronto
      if (subDirObj.subPaths) {
        subDirObj.subPaths.forEach(subPath => {
          const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
          const orgPath = `${org.id}/${subDir}/${subPath.path}`;
          let orgName, description;

          if (subDir === 'owasp-llm-apps') {
            if (subPath.path.includes('march')) {
              orgName = 'OWASP LLM Apps Project';
              description = 'Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps';
            } else if (subPath.path.includes('october')) {
              orgName = 'Gen AI Application Security & Risk Summit';
              description = 'Breakout: The Stochastic Shall Inherit the Earth (But Let\'s Secure It First), Top 10 Risk for LLMs and GenAI';
            } else {
              orgName = 'OWASP LLM Apps Project';
              description = 'Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps';
            }
          } else {
            orgName = subDir.replace('owasp-', 'OWASP ').toUpperCase();
            // Add month-specific descriptions
            if (subPath.path.includes('march')) {
              description = 'How to Utilize AI in Offensive Security—An Intro to Offensive AI Tooling';
            } else if (subPath.path.includes('september')) {
              description = 'Becoming a Caido Power User: From Recon to Root';
            } else {
              description = 'Talks on AI/ML Security and LLM Application Safety';
            }
          }

          // Special ID handling for Gen AI Summit
          let confId = `${orgPath.replace(/\//g, '-')}`;
          if (subDir === 'owasp-llm-apps' && subPath.path.includes('october')) {
            confId = 'owasp-gen-ai-security-summit-2025';
          }

          content.conferences.push({
            id: confId,
            name: orgName,
            path: orgPath,
            year: subPath.year,
            icon: orgConfig.icon,
            description: description
          });
        });
      } else {
        // Handle regular years for other OWASP chapters
        const subDirYears = subDirObj.years || org.years;
        subDirYears.forEach(year => {
          const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
          const orgPath = `${org.id}/${subDir}`;
          let orgName, description;

          if (subDir === 'owasp-llm-apps') {
            orgName = 'OWASP LLM Apps Project';
            description = 'Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps';
          } else {
            orgName = subDir.replace('owasp-', 'OWASP ').toUpperCase();
            description = 'Talks on AI/ML Security and LLM Application Safety';
          }

          content.conferences.push({
            id: `${orgPath}-${year}`,
            name: orgName,
            path: orgPath,
            year: year,
            icon: orgConfig.icon,
            description: description
          });
        });
      }
    });
  } else if (org.id === 'bugcrowd' && org.subDirs) {
    org.subDirs.forEach(subDir => {
      org.years.forEach(year => {
        const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
        const orgPath = `${org.id}/${subDir}`;
        let orgName, description;

        if (subDir.includes('bugboss')) {
          orgName = 'BugBoss';
          description = 'BugCrowd Bugboss v3 Show and Tell';
        } else if (subDir.includes('rhic')) {
          orgName = 'RHIC';
          description = 'BugCrowd x Dreadnode Crucible: Rhode Island College Cyber Range';
        } else if (subDir.includes('edprotect')) {
          orgName = 'EdProtect';
          description = 'Bug Bounty Student Training by Bugcrowd at UC Berkeley';
        } else if (subDir.includes('rit')) {
          orgName = 'RITSEC Rochester Institute of Technology';
          description = 'LLM AI Application Security hacking presentation and workshop';
        } else if (subDir.includes('wraven')) {
          orgName = 'WRAVEN x BugCrowd';
          description = 'Bug Bounty Student Training by Bugcrowd';
        } else if (subDir.includes('ut')) {
          orgName = 'University of Texas - Austin';
          description = 'BugCrowd College Program Educational Event';
        } else if (subDir.includes('cnu')) {
          orgName = 'CNU CyberClub';
          description = 'BugCrowd College Program Educational Event';
        } else {
          orgName = subDir.toUpperCase();
          description = 'Talks on AI/ML Security and LLM Application Safety';
        }

        content.conferences.push({
          id: `${orgPath.replace(/\//g, '-')}-${year}`,
          name: orgName,
          path: orgPath,
          year: year,
          icon: orgConfig.icon,
          description: description
        });
      });
    });
  } else if (org.subPaths) {
    org.subPaths.forEach(subPath => {
      const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
      let description = "Talks on AI/ML Security and LLM Application Safety";

      // Special descriptions for conferences
      if (org.id === 'lakera') {
        if (subPath.year === '2023') {
          description = "How to Secure AI Applications: Lessons from OWASP's Top 10 for LLMs";
        } else if (subPath.year === '2024') {
          description = "Decoding OWASP Large Language Model Security Verification Standard (LLMSVS)";
        }
      } else if (org.id === 'defcon') {
        description = "Misaligned: AI Jailbreaking Panel with Basi Team Six (BT6) & Jason Haddix";
      } else if (org.id === 'taico') {
        description = "Toronto AI and Cybersecurity Organization - First meetup of 2026 featuring Q&A, steganography talk, and lightning talks";
      }

      content.conferences.push({
        id: `${org.id}-${subPath.year}`,
        name: orgConfig.name,
        path: `${org.id}/${subPath.path}`,
        year: subPath.year,
        icon: orgConfig.icon,
        description: description
      });
    });
  } else {
    org.years.forEach(year => {
      const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
      let description = "Talks on AI/ML Security and LLM Application Safety";

      // Special descriptions for specific conferences
      if (org.id === 'interface') {
        description = "Language AI Security at the API level - Avoiding Hacks, Injections and Breaches";
      } else if (org.id === 'isc2') {
        description = "Behind the Prompt: Exposing and Mitigating the Top LLM Vulnerabilities";
      } else if (org.id === 'lakera') {
        if (year === '2023') {
          description = "How to Secure AI Applications: Lessons from OWASP's Top 10 for LLMs";
        } else if (year === '2024') {
          description = "Decoding OWASP Large Language Model Security Verification Standard (LLMSVS)";
        }
      } else if (org.id === 'mlopscommunity') {
        description = "AI in Production - MLOps Security and Privacy Panel";
      }

      content.conferences.push({
        id: `${org.id}-${year}`,
        name: orgConfig.name,
        path: org.id,
        year: year,
        icon: orgConfig.icon,
        description: description
      });
    });
  }
});

// Process podcasts
const podcastPaths = [
  { path: 'podcasts/bareknuckles_and_brass_tacks', name: 'Bare Knuckles and Brass Tacks', icon: 'fas fa-fist-raised', year: '2024' },
  { path: 'podcasts/chai_chat_podcast', name: 'ChAI Chat Podcast', icon: 'fas fa-mug-hot', year: '2023' },
  { path: 'podcasts/f5_dev_central', name: 'F5 DevCentral', icon: 'fas fa-server', year: '2023' },
  { path: 'podcasts/mlops_community/2023/november', name: 'MLOps Community', icon: 'fas fa-cogs', year: '2023' },
  { path: 'podcasts/owasp/owasp-llm-apps-podcast', name: 'OWASP LLM Apps Podcast', icon: 'fas fa-shield-virus', year: '2024' },
  { path: 'podcasts/owasp/owasp-llm-apps-podcast', name: 'OWASP LLM Apps Podcast', icon: 'fas fa-shield-virus', year: '2025' },
  { path: 'podcasts/software_testing_and_quality_talks', name: 'Software Testing & Quality Talks', icon: 'fas fa-check-circle', year: '2024' },
  { path: 'podcasts/synack', name: 'Synack Podcast', icon: 'fas fa-bug', year: '2023' }
];

// Add podcast entries
podcastPaths.forEach(podcast => {
  let description = 'Discussion about AI and ML security';
  if (podcast.name.includes('MLOps')) {
    description = 'Exploring the intersection of MLOps and security';
  } else if (podcast.name.includes('ChAI')) {
    description = 'Conversations on AI ethics and security challenges';
  } else if (podcast.name.includes('OWASP')) {
    if (podcast.year === '2025') {
      description = 'Sandboxing AI Models with Dyana & OWASP Top 10 for LLM Apps - Ep.4';
    } else {
      description = 'Security considerations for LLM applications';
    }
  }

  content.podcasts.push({
    id: `${podcast.path.replace(/\//g, '-')}-${podcast.year}`,
    name: podcast.name,
    path: podcast.path,
    year: podcast.year,
    icon: podcast.icon,
    description: description
  });
});

// Process publications from README.md
const publications = [
  {
    id: "bugcrowd-author-profile",
    title: "Bugcrowd Author Profile - Ads Dawson",
    publisher: "BugCrowd",
    description: "Complete collection of all my published articles, research, and contributions on the Bugcrowd blog covering API and web application Hacking, AI security, red teaming, and vulnerability research.",
    url: "https://arxiv.org/abs/2506.14682",
    icon: "fas fa-bug",
    external: true,
    year: "2025"
  },
  {
    id: "arxiv-maif",
    title: "arXiv:2511.15097 - MAIF: Enforcing AI Trust and Provenance with an Artifact-Centric Agentic Paradigm",
    publisher: "arXiv",
    description: "Academic paper on enforcing AI trust and provenance through an artifact-centric agentic paradigm for robust AI system accountability.",
    url: "https://arxiv.org/abs/2511.15097",
    icon: "fas fa-file-alt",
    external: true,
    year: "2025"
  },
  {
    id: "arxiv-airtbench",
    title: "arXiv:2506.14682 - AIRTBench: Measuring Autonomous AI Red Teaming Capabilities in Language Models",
    publisher: "arXiv",
    description: "Academic paper on an AI red teaming benchmark for evaluating language models' ability to autonomously discover and exploit Artificial Intelligence and Machine Learning (AI/ML) security vulnerabilities.",
    url: "https://arxiv.org/abs/2506.14682",
    icon: "fas fa-file-alt",
    external: true,
    year: "2025"
  },
  {
  id: "dreadnode-ai-red-team-benchmark-case-study",
  title: "AI Red Teaming Case Study: Claude 3.7 Sonnet Solves the Turtle Challenge",
  publisher: "Dreadnode",
  description: "Ads reveals groundbreaking research where AI models crushed a cybersecurity challenge so brutal that 94% of human hackers fail—yet three frontier AIs (Claude, Gemini, and Llama) each cracked it using wildly different strategies, from Claude's methodical 9-minute persistence to Llama's lightning-fast 1-minute creative deception. Using their AIRTBench benchmark of 70 AI/ML security challenges and their Strikes evaluation platform, Ads demonstrates that these aren't just pattern-matching machines but genuine problem-solvers adapting under pressure, marking a pivotal moment where AI offensive capabilities have officially surpassed most human experts—and they're sharing the complete dataset so the security community can prepare for what's coming next.",
  url: "https://dreadnode.io/blog/ai-red-teaming-case-study-claude-sonnet-solves-turtle",
  icon: "fas fa-skull",
  year: "2025"
  },
  {
  id: "dreadnode-ai-red-team-benchmark",
  title: "Do LLM Agents Have AI Red Team Capabilities? We Built a Benchmark to Find Out",
  publisher: "Dreadnode",
  description: "We're excited to introduce AIRTBench, an AI red teaming framework that tests LLMs against AI/ML black-box capture-the-flag (CTF) challenges to see how they perform when attacking other AI systems. Think of it as a proving ground where models face the kind of adversarial scenarios they'd encounter in the wild, not just in carefully curated test suites.",
  url: "https://dreadnode.io/blog/ai-red-team-benchmark",
  icon: "fas fa-skull",
  year: "2025"
  },
  {
    id: "arxiv-ai-red-teaming",
    title: "arXiv:2504.19855 - The Automation Advantage in AI Red Teaming",
    publisher: "arXiv",
    description: "Academic paper on automated approaches to AI security testing",
    url: "https://arxiv.org/abs/2504.19855",
    icon: "fas fa-file-alt",
    external: true,
    year: "2024"
  },
  {
    id: "cohere-ai-security",
    title: "The State of AI Security",
    publisher: "Cohere",
    description: "An in-depth look at current AI security challenges",
    url: "https://cohere.com/blog/the-state-of-ai-security",
    icon: "fas fa-brain",
    external: true,
    year: "2023"
  },
  {
    id: "cohere-straight-talk",
    title: "Straight talk on AI security with Exabeam's Steve Wilson",
    publisher: "Cohere",
    description: "Interview discussing AI security challenges and solutions",
    url: "https://cohere.com/blog/straight-talk-on-ai-security-with-exabeams-steve-wilson",
    icon: "fas fa-brain",
    external: true,
    year: "2023"
  },
  {
    id: "cohere-gen-ai-changed-security",
    title: "How generative AI has changed security",
    publisher: "Cohere",
    description: "Analysis of the security landscape in the era of generative AI",
    url: "https://cohere.com/blog/how-generative-ai-has-changed-security-2",
    icon: "fas fa-brain",
    external: true,
    year: "2023"
  },
  {
    id: "cohere-enterprise-ai-security",
    title: "Enterprise AI security: Deploying LLM applications safely",
    publisher: "Cohere",
    description: "Guidelines for secure enterprise LLM deployment",
    url: "https://cohere.com/blog/enterprise-ai-security-deploying-llm-applications-safely",
    icon: "fas fa-brain",
    external: true,
    year: "2023"
  },
  {
    "id": "bugcrowd-hacked-my-way",
    "title": "How I hacked my way to the big leagues: Fat bounties, interviews on NASDAQ, and advisory boards",
    "publisher": "BugCrowd",
    "description": "Breaking things for fun and profit - Though Leadership",
    "url": "https://www.bugcrowd.com/blog/how-i-hacked-my-way-to-the-big-leagues-fat-bounties-interviews-on-nasdaq-and-advisory-boards/",
    "icon": "fas fa-bug",
    "external": true,
    "year": "2025"
  },
  {
    "id": "bugcrowd-agents-rigging",
    "title": "Rigging the system: The art of AI exploits",
    "publisher": "BugCrowd",
    "description": "Leveraging agents, crafting exploits, and mining the hidden gems of AI security",
    "url": "https://www.bugcrowd.com/blog/rigging-the-system-the-art-of-ai-exploits/",
    "icon": "fas fa-bug",
    "external": true,
    "year": "2025"
  },
  {
    id: "bugcrowd-airt-dspy",
    title: "Hacking AI applications: In the trenches with DSPy",
    publisher: "BugCrowd",
    description: "An in-depth exploration of automated AI red teaming using DSPy",
    url: "https://www.bugcrowd.com/blog/hacking-llm-applications-in-the-trenches-with-dspy/",
    icon: "fas fa-bug",
    external: true,
    year: "2025"
  },
  {
    id: "bugcrowd-hacking-llm",
    title: "Hacking LLM applications: A meticulous hacker's two cents",
    publisher: "BugCrowd",
    description: "Insights into vulnerabilities specific to LLM applications",
    url: "https://www.bugcrowd.com/blog/hacking-llm-applications-a-meticulous-hackers-two-cents/",
    icon: "fas fa-bug",
    external: true,
    year: "2025"
  },
  {
    id: "bugcrowd-hacking-sidekick",
    title: "A low-cost hacking sidekick: Baby steps to using offensive AI agents",
    publisher: "BugCrowd",
    description: "Guide to leveraging AI for ethical hacking",
    url: "https://www.bugcrowd.com/blog/a-low-cost-hacking-sidekick-baby-steps-to-using-offensive-ai-agents/",
    icon: "fas fa-bug",
    external: true,
    year: "2025"
  },
  {
    id: "packt-llm-security-handbook",
    title: "LLM Security Handbook - Chapter 8: Mitigating LLM Risks",
    publisher: "Packt Publishing",
    description: "Strategies and techniques for mitigating risks in LLM applications",
    url: "/packt/llm_sec_handbook/chapter_8_mitigating_llm_risks-strategies_techniques",
    icon: "fas fa-book",
    year: "2024"
  },
  {
    id: "owasp-top-10-llm",
    title: "OWASP Top 10 for LLM Applications",
    publisher: "OWASP",
    description: "Contributing author to the OWASP Top 10 for LLM Applications guide",
    url: "/owasp/owasp-llm-apps",
    icon: "fas fa-shield-virus",
    year: "2023"
  }
];

// Add publication entries
content.publications = publications;

// Write the content to a JSON file - ensure it's valid JSON without comments
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(content, null, 2));

// Also create a backup copy with a different name to test
fs.writeFileSync(
  path.join(path.dirname(OUTPUT_FILE), 'content-fixed.json'),
  JSON.stringify(content, null, 2)
);

console.log(`Content JSON written to ${OUTPUT_FILE}`);
console.log(`Found ${content.conferences.length} conferences`);
console.log(`Found ${content.podcasts.length} podcasts`);
console.log(`Found ${content.publications.length} publications`);
