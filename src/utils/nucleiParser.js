/**
 * Parser per output Nuclei
 * Estrae tecnologie e vulnerabilità dal report Nuclei
 */

const SEVERITY_MAP = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
  info: 'info'
};

const TECH_PATTERNS = [
  /\[tech-detect:([^\]]+)\]\s*\[(\w+)\]\s*(.+)/i,
  /\[([^\]]*tech[^\]]*):([^\]]+)\]\s*\[(\w+)\]\s*(.+)/i
];

const VULN_PATTERNS = [
  /\[(cves|vulns|misconfig|jndi|injection|auth|osint):([^\]]+)\]\s*\[(\w+)\]\s*(.+)/i,
  /\[([^\]]*(?:cves|vulns|misconfig|jndi|injection|auth)[^\]]*):([^\]]+)\]\s*\[(\w+)\]\s*(.+)/i
];

export function parseNucleiOutput(content) {
  const lines = content.split('\n');
  const techStacks = [];
  const vulnerabilities = [];
  const seenTech = new Set();
  const seenVulns = new Set();

  lines.forEach((line) => {
    if (!line.trim()) return;

    // Parse tecnologie
    for (const pattern of TECH_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        const [, techName, level, description] = match;
        const version = extractVersion(description);
        const key = `${techName.toLowerCase()}-${version || ''}`;

        if (!seenTech.has(key)) {
          seenTech.add(key);
          techStacks.push({
            technology: cleanTechName(techName),
            version: version || '',
            category: getTechCategory(techName),
            notes: description.trim()
          });
        }
        return;
      }
    }

    // Parse vulnerabilità
    for (const pattern of VULN_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        const [, category, vulnId, severity, description] = match;
        
        if (!isValidSeverity(severity)) continue;

        const key = `${vulnId}-${severity}`;
        if (!seenVulns.has(key)) {
          seenVulns.add(key);
          
          const vuln = {
            title: formatVulnTitle(vulnId, description),
            description: description.trim(),
            severity: normalizeSeverity(severity),
            cve: extractCVE(description, vulnId),
            status: 'open',
            proof: '',
            remediation: getRemediationSuggestion(vulnId),
            affectedUrl: '',
            impact: getVulnImpact(vulnId, severity)
          };

          // Estrai CVSS se presente
          const cvssMatch = description.match(/cvss[:\s]+(\d+(?:\.\d+)?)/i);
          if (cvssMatch) {
            vuln.cvss = parseFloat(cvssMatch[1]);
          }

          vulnerabilities.push(vuln);
        }
        return;
      }
    }
  });

  return {
    techStacks,
    vulnerabilities,
    summary: {
      techCount: techStacks.length,
      vulnCount: vulnerabilities.length,
      criticalCount: vulnerabilities.filter(v => v.severity === 'critical').length,
      highCount: vulnerabilities.filter(v => v.severity === 'high').length
    }
  };
}

function extractVersion(text) {
  const versionMatch = text.match(/\(?\s*[vV]?(\d+(?:\.\d+)*)\s*\)?/);
  return versionMatch ? versionMatch[1] : '';
}

function cleanTechName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getTechCategory(techName) {
  const name = techName.toLowerCase();
  
  if (['apache', 'nginx', 'iis', 'lighthttp'].some(t => name.includes(t))) return 'server';
  if (['wordpress', 'drupal', 'joomla', 'magento', 'prestashop'].some(t => name.includes(t))) return 'cms';
  if (['node', 'express', 'django', 'laravel', 'rails', 'spring'].some(t => name.includes(t))) return 'framework';
  if (['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'].some(t => name.includes(t))) return 'database';
  if (['java', 'python', 'php', 'javascript', 'go', 'rust', 'c#'].some(t => name.includes(t))) return 'language';
  if (['cloudflare', 'akamai', 'cloudfront'].some(t => name.includes(t))) return 'cdn';
  if (['google', 'analytics'].some(t => name.includes(t))) return 'analytics';
  
  return 'other';
}

function isValidSeverity(severity) {
  return ['critical', 'high', 'medium', 'low', 'info'].includes(severity.toLowerCase());
}

function normalizeSeverity(severity) {
  return severity.toLowerCase();
}

function extractCVE(description, vulnId) {
  // Cerca CVE nel descrizione
  const cveMatch = description.match(/CVE-\d{4}-\d{4,}/i);
  if (cveMatch) return cveMatch[0];
  
  // Se vulnId contiene CVE
  if (vulnId.match(/CVE-\d{4}-\d{4,}/i)) {
    return vulnId.match(/CVE-\d{4}-\d{4,}/i)[0];
  }
  
  return '';
}

function formatVulnTitle(vulnId, description) {
  // Pulisci il vulnId
  let title = vulnId.replace(/-/g, ' ').toUpperCase();
  
  // Se la descrizione inizia con un titolo migliore, usala
  const descStart = description.split(/[.!?]/)[0].trim();
  if (descStart.length > 10 && descStart.length < 100) {
    title = descStart;
  }
  
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function getRemediationSuggestion(vulnId) {
  const id = vulnId.toLowerCase();
  
  const suggestions = {
    'sql-injection': 'Use prepared statements, input validation, and parameterized queries. Implement WAF rules.',
    'xss': 'Sanitize user input, encode output, use Content Security Policy (CSP), implement input validation.',
    'weak-auth': 'Implement strong authentication mechanisms, use MFA, enforce strong password policies.',
    'default-login': 'Change default credentials immediately, disable default accounts, implement access controls.',
    'missing-headers': 'Add security headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP).',
    'rce': 'Patch the system, disable vulnerable services, implement input validation and sandboxing.',
    'log4j': 'Update Log4j to version 2.17.0 or later, disable JNDI by default.',
    'csrf': 'Implement CSRF tokens, use SameSite cookie attribute, verify origin.',
    'cors': 'Configure CORS properly, avoid wildcard CORS policies, validate origins.',
    'path-traversal': 'Implement strict input validation, use allow-lists, avoid direct file access.'
  };
  
  for (const [key, suggestion] of Object.entries(suggestions)) {
    if (id.includes(key)) return suggestion;
  }
  
  return 'Investigate and remediate according to vulnerability details and security best practices.';
}

function getVulnImpact(vulnId, severity) {
  const id = vulnId.toLowerCase();
  
  if (severity === 'critical') {
    return 'Can lead to complete system compromise, data theft, or service disruption. Immediate action required.';
  }
  
  if (id.includes('rce') || id.includes('log4j')) {
    return 'Remote code execution allows attacker to execute arbitrary code on the server.';
  }
  
  if (id.includes('sql-injection')) {
    return 'Attacker can read, modify, or delete database contents. Potential unauthorized access.';
  }
  
  if (id.includes('xss')) {
    return 'Attacker can steal session cookies, perform actions on behalf of users, or redirect to malicious sites.';
  }
  
  if (id.includes('auth')) {
    return 'Weak authentication allows unauthorized access to accounts and sensitive data.';
  }
  
  if (severity === 'high') {
    return 'High severity vulnerability that can significantly impact security. Should be addressed urgently.';
  }
  
  if (severity === 'medium') {
    return 'Medium severity vulnerability that should be addressed in a timely manner.';
  }
  
  return 'Low severity issue that should be monitored and addressed when possible.';
}

export default {
  parseNucleiOutput
};