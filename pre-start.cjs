const { execSync } = require('child_process');

// Get git hash with fallback
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'no-git-info';
  }
};

let commitJson = {
  hash: JSON.stringify(getGitHash()),
  version: JSON.stringify(process.env.npm_package_version),
};

console.log(`
★═══════════════════════════════════════★
       Z O T H   W E B G E N
    👑 Autonomous App Foundry 👑
★═══════════════════════════════════════★
`);
console.log('📍 Platform: NullAI Engine (v3.0.0)');
console.log('📍 Commit Hash:', commitJson.hash);
console.log('📍 Creator: Neal Frazier Tech (@1nc0gn30)');
console.log('★═══════════════════════════════════════★');
