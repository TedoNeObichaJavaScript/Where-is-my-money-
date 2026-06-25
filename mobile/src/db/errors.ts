/** Raised when the hardware keystore is unavailable, so the DB can't be opened. */
export class SecureStorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Secure storage is unavailable on this device; cannot access encrypted data.');
    this.name = 'SecureStorageUnavailableError';
    this.cause = cause;
  }
}
