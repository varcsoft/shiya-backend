import axios from 'axios';
import crypto from 'crypto';
class PasswordSecurityService {
  constructor() {
    this.hibpApiUrl = 'https://api.pwnedpasswords.com/range/';
  }

  /**
   * Check if a password has been compromised using the Have I Been Pwned API
   * @param {string} password - The password to check
   * @returns {Promise<{isCompromised: boolean, timesFound: number}>}
   */
  async checkPasswordSecurity(password) {
    try {
      // Generate SHA-1 hash of the password
      const sha1Hash = crypto.createHash('sha1')
        .update(password)
        .digest('hex')
        .toUpperCase();

      // Split hash into prefix and suffix for k-anonymity
      const prefix = sha1Hash.slice(0, 5);
      const suffix = sha1Hash.slice(5);

      // Query the HIBP API with the prefix
      const response = await axios.get(`${this.hibpApiUrl}${prefix}`);
      const hashes = response.data.split('\n');

      // Search for our hash suffix in the response
      for (const hash of hashes) {
        const [hashSuffix, count] = hash.split(':');
        if (hashSuffix.trim() === suffix) {
          return {
            isCompromised: true,
            timesFound: parseInt(count)
          };
        }
      }

      return {
        isCompromised: false,
        timesFound: 0
      };

    } catch (error) {
      throw new Error('Failed to check password security: ' + error.message);
    }
  }
}

module.exports = PasswordSecurityService;
