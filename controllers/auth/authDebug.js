const bcrypt = require("bcryptjs");

// Debug function to validate password hashing consistency
async function debugPasswordHashing() {
  const testPassword = "password123";

  // Test 1: Multiple hashes of the same password
  console.log("\nTest 1: Hash Consistency Check");
  const hash1 = await bcrypt.hash(testPassword, 10);
  const hash2 = await bcrypt.hash(testPassword, 10);

  console.log("Hash 1:", hash1);
  console.log("Hash 2:", hash2);
  console.log("Different hashes (expected):", hash1 !== hash2);

  // Test 2: Verify both hashes work with the original password
  console.log("\nTest 2: Hash Verification Check");
  const verify1 = await bcrypt.compare(testPassword, hash1);
  const verify2 = await bcrypt.compare(testPassword, hash2);

  console.log("Verify Hash 1:", verify1);
  console.log("Verify Hash 2:", verify2);

  // Test 3: Test wrong password
  console.log("\nTest 3: Invalid Password Check");
  const wrongPassword = "wrongpassword";
  const verifyWrong = await bcrypt.compare(wrongPassword, hash1);
  console.log("Wrong Password Check (should be false):", verifyWrong);

  return {
    hash1,
    hash2,
    verify1,
    verify2,
    verifyWrong
  };
}

// Function to check stored hash format
function validateHashFormat(hash) {
  // bcrypt hashes should:
  // 1. Be 60 characters long
  // 2. Start with $2b$ or $2a$
  // 3. Contain valid base-64 characters
  const isValidLength = hash.length === 60;
  const hasValidPrefix = hash.startsWith('$2b$') || hash.startsWith('$2a$');
  const hasValidChars = /^[A-Za-z0-9./\$]+$/.test(hash);

  return {
    isValid: isValidLength && hasValidPrefix && hasValidChars,
    details: {
      length: hash.length,
      expectedLength: 60,
      prefix: hash.substring(0, 4),
      validPrefix: hasValidPrefix,
      validChars: hasValidChars
    }
  };
}

// Export debugging functions
module.exports = {
  debugPasswordHashing,
  validateHashFormat
};