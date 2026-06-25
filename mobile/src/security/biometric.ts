import * as LocalAuthentication from 'expo-local-authentication';

/** True only if the device has biometric hardware AND the user has enrolled. */
export async function isBiometricAvailable(): Promise<boolean> {
  const [hw, enrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hw && enrolled;
}

/** Prompt for Face/Touch ID. Resolves true on success. */
export async function authenticate(): Promise<boolean> {
  const r = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Parite',
    fallbackLabel: 'Use passcode',
  });
  return r.success;
}
