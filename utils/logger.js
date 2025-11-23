export default class Logger {
  static info(message) {
    console.log(`\x1b[36m[INFO]\x1b[0m ${message}`); // Cyan
  }

  static success(message) {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`); // Green
  }

  static warn(message) {
    console.log(`\x1b[33m[WARN]\x1b[0m ${message}`); // Yellow
  }

  static error(message) {
    console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`); // Red
  }

  static step(message) {
    console.log(`\n➡️  ${message}`); // Big arrow for steps
  }

  static done(message) {
    console.log(`✅ ${message}`);
  }
}
