const fs = require('fs');
const path = require('path');

const screens = [
  { file: 'landing.html', route: 'page.tsx' },
  { file: 'admin.html', route: 'admin/page.tsx' },
  { file: 'family.html', route: 'family/page.tsx' },
  { file: 'role.html', route: 'role/page.tsx' },
  { file: 'volunteer.html', route: 'volunteer/page.tsx' },
  { file: 'login.html', route: 'login/page.tsx' },
];

screens.forEach(screen => {
  const htmlPath = path.join('/tmp', screen.file);
  if (!fs.existsSync(htmlPath)) {
    console.log(`Skipping ${screen.file}, not found.`);
    return;
  }
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract content inside <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    html = bodyMatch[1];
  }
  
  // Escape backticks and dollars for template literal
  const escapedHtml = html.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  const componentContent = `import React from 'react';

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />;
}
`;

  const destPath = path.join('src/app', screen.route);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, componentContent);
  console.log(`Created ${destPath}`);
});
