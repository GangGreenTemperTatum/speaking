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
  { id: "dc604", years: ["2023"] },
  { id: "in-cyber-forum", years: ["2024"] },
  { id: "isaca", years: ["2024"] },
  { id: "mako-lab", years: ["2023", "2024"] },
  { id: "owasp", subDirs: ["owasp-toronto", "owasp-vancouver", "owasp-atlanta"], years: ["2023", "2024", "2025"] },
  { id: "rsa-usa", years: ["2024", "2025"] }
];

// Map directory names to display names and icons
const contentMap = {
  "apidays": { name: "API Days", icon: "fas fa-cloud" },
  "apisec": { name: "APISec", icon: "fas fa-shield-alt" },
  "dc604": { name: "DC604", icon: "fas fa-users" },
  "in-cyber-forum": { name: "In-Cyber Forum", icon: "fas fa-globe" },
  "isaca": { name: "ISACA", icon: "fas fa-certificate" },
  "lakera": { name: "Lakera", icon: "fas fa-robot" },
  "mako-lab": { name: "Mako Lab", icon: "fas fa-flask" },
  "mlopscommunity": { name: "MLOps Community", icon: "fas fa-brain" },
  "owasp": { name: "OWASP", icon: "fas fa-shield-virus" },
  "packt": { name: "Packt Publishing", icon: "fas fa-book" },
  "rsa-usa": { name: "RSA Conference", icon: "fas fa-lock" }
};

// Create conference entries
conferenceOrgs.forEach(org => {
  if (org.id === 'owasp' && org.subDirs) {
    org.subDirs.forEach(subDir => {
      org.years.forEach(year => {
        const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };
        const orgPath = `${org.id}/${subDir}`;
        const orgName = subDir.replace('owasp-', 'OWASP ').toUpperCase();

        content.conferences.push({
          id: `${orgPath}-${year}`,
          name: orgName,
          path: orgPath,
          year: year,
          icon: orgConfig.icon,
          description: "Talks on AI/ML Security and LLM Application Safety"
        });
      });
    });
  } else {
    org.years.forEach(year => {
      const orgConfig = contentMap[org.id] || { name: org.id, icon: "fas fa-microphone-alt" };

      content.conferences.push({
        id: `${org.id}-${year}`,
        name: orgConfig.name,
        path: org.id,
        year: year,
        icon: orgConfig.icon,
        description: "Talks on AI/ML Security and LLM Application Safety"
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
    description = 'Security considerations for LLM applications';
  }

  content.podcasts.push({
    id: podcast.path.replace(/\//g, '-'),
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
