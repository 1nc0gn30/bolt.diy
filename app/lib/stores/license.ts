import { atom } from 'nanostores';

export const kProLicense = 'zoth_pro_licensed';
export const kLicenseKey = 'zoth_license_key';

export const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/cNiaEWaEldKo6Tm1C0fw40D';
export const SOLANA_RECEIVER = 'GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK';
export const BITCOIN_RECEIVER = 'bc1p2dr247zklh8pnffak0ew7m82u2w8gx25ys28x7aavr95z674ydzsfw500t';
export const DEPAY_INTEGRATION_ID = '428790dd-7ad1-407c-8ecf-c048c77a4cb8';

export const isProLicensedStore = atom<boolean>(initLicenseStore());
export const isPaywallModalOpenStore = atom<boolean>(false);
export const isActivationModalOpenStore = atom<boolean>(false);

function initLicenseStore(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check URL parameters for instant return activation
  try {
    const params = new URLSearchParams(window.location.search);

    if (params.get('licensed') === 'true' || params.get('session_id')) {
      localStorage.setItem(kProLicense, 'true');
      localStorage.setItem(kLicenseKey, params.get('session_id') || 'STRIPE_ACTIVATED');

      return true;
    }

    return localStorage.getItem(kProLicense) === 'true';
  } catch {
    return false;
  }
}

export function activateLicense(key: string = 'ACTIVE_KEY'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(kProLicense, 'true');
    localStorage.setItem(kLicenseKey, key);
  }

  isProLicensedStore.set(true);
  isPaywallModalOpenStore.set(false);
  isActivationModalOpenStore.set(false);
}

export function openPaywall(): void {
  isPaywallModalOpenStore.set(true);
}

export function closePaywall(): void {
  isPaywallModalOpenStore.set(false);
}

export function openActivationModal(): void {
  isActivationModalOpenStore.set(true);
}

export function closeActivationModal(): void {
  isActivationModalOpenStore.set(false);
}

export function openDePayCheckout(): void {
  if (typeof window !== 'undefined') {
    const win = window as any;

    if (win.DePayWidgets && win.DePayWidgets.Payment) {
      try {
        win.DePayWidgets.Payment({
          accept: [
            {
              blockchain: 'solana',
              token: '11111111111111111111111111111111', // SOL native
              receiver: SOLANA_RECEIVER,
            },
            {
              blockchain: 'solana',
              token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
              receiver: SOLANA_RECEIVER,
            },
          ],
          amount: {
            currency: 'USD',
            fix: 19.0,
          },
          integration: DEPAY_INTEGRATION_ID,
          confirmed: () => {
            activateLicense('DEPAY_SOLANA_VERIFIED');
          },
        });
        return;
      } catch (e) {
        console.error('Failed to launch DePay widget:', e);
      }
    }

    // Fallback: Copy Solana address to clipboard with prompt
    navigator.clipboard.writeText(SOLANA_RECEIVER).then(() => {
      alert(
        `Solana payment receiver copied to clipboard:\n\n${SOLANA_RECEIVER}\n\nSend $19 in SOL or USDC, then enter your transaction signature in the License Key prompt to activate.`,
      );
      openActivationModal();
    });
  }
}
