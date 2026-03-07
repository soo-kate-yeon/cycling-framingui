import { isAuthenticated } from './state.js';

export class AuthRequiredError extends Error {
  constructor() {
    super(
      'Authentication required. Run `framingui-mcp login` to authenticate, or set FRAMINGUI_API_KEY environment variable.'
    );
    this.name = 'AuthRequiredError';
  }
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    throw new AuthRequiredError();
  }
}
