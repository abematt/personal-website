import React from 'react';

// Define all technical terms you want to highlight
export const techTerms = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'C', 'Java',
  
  // Frameworks & Libraries
  'React', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
  'SWR', 'TanStack Query', 'shadcn/ui', 'iron-session', 'Celery',
  'Hugging.js', 'HuggingFace.js', 'Winston', 'MUI DataGrid',
  
  // Cloud & DevOps
  'AWS', 'S3', 'Lambda', 'SQS', 'SNS', 'CloudWatch',
  'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions',
  
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  
  // AI/ML
  'NLP', 'Machine Learning', 'ML', 'AI', 'Few-Shot Learning',
  'Atlas Models', 'OpenAI', 'Sentiment Analysis',
  
  // Testing
  'Playwright', 'Jest', 'Cypress',
  
  // Other
  'REST API', 'GraphQL', 'WebSockets', 'HIPAA' ,'Github', 'Dockerized', 'REST', 'Agile'
];

// Function to highlight technical terms in a text
export function highlightTechTerms(text: string) {
  let result = [];
  let lastIndex = 0;
  
  // Create a regex pattern from all tech terms
  const pattern = new RegExp(`\\b(${techTerms.join('|').replace(/\./g, '\\.')})\\b`, 'g');
  
  // Find all matches
  let match;
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    
    // Add the highlighted term
    result.push(
      <span key={match.index} className="text-blue-400 font-medium">
        {match[0]}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  return result;
} 