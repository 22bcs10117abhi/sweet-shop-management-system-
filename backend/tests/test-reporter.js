// Test results reporter
// Logs test results to test-output.log

export default function testReporter(results) {
  const fs = require('fs');
  const path = require('path');
  const logFile = path.join(__dirname, 'test-output.log');
  
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    totalTests: results.numTotalTests,
    passedTests: results.numPassedTests,
    failedTests: results.numFailedTests,
    duration: results.startTime
  };

  const logEntry = `
========================================
Test Run: ${timestamp}
========================================
Total Tests: ${summary.totalTests}
Passed: ${summary.passedTests}
Failed: ${summary.failedTests}
Duration: ${results.startTime}ms
========================================
`;

  fs.appendFileSync(logFile, logEntry);
  
  return results;
}

