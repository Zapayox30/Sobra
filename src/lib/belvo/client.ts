/**
 * Belvo API Client — Scaffold
 *
 * This module provides the foundation for integrating with the Belvo API
 * to connect users' Peruvian bank accounts (BCP, Interbank, BBVA, Scotiabank).
 *
 * PREREQUISITES (before this works):
 * 1. Sign up at https://belvo.com and get API credentials
 * 2. Add to .env.local:
 *    - BELVO_SECRET_ID=your_secret_id
 *    - BELVO_SECRET_PASSWORD=your_secret_password
 *    - BELVO_API_URL=https://sandbox.belvo.com (or https://api.belvo.com for production)
 * 3. Install the Belvo SDK: npm install belvo
 * 4. Configure webhook URL in Belvo dashboard
 *
 * FLOW:
 * 1. User clicks "Connect Bank" → frontend calls /api/belvo/link-token
 * 2. Belvo Link widget opens → user authenticates with their bank
 * 3. Widget returns a link_id → frontend calls /api/belvo/connect with the link_id
 * 4. Backend saves the connection and fetches initial data
 * 5. Periodic sync via /api/belvo/sync
 */

export interface BelvoConfig {
  secretId: string
  secretPassword: string
  apiUrl: string
}

export function getBelvoConfig(): BelvoConfig {
  const secretId = process.env.BELVO_SECRET_ID
  const secretPassword = process.env.BELVO_SECRET_PASSWORD
  const apiUrl = process.env.BELVO_API_URL || 'https://sandbox.belvo.com'

  if (!secretId || !secretPassword) {
    throw new Error(
      'Belvo credentials not configured. Add BELVO_SECRET_ID and BELVO_SECRET_PASSWORD to .env.local'
    )
  }

  return { secretId, secretPassword, apiUrl }
}

/**
 * Supported Peruvian bank institution codes in Belvo.
 * These are the fiscal_id values used by Belvo.
 */
export const PERU_BANK_INSTITUTIONS = {
  bcp: 'bcp_pe_retail',
  interbank: 'interbank_pe_retail',
  bbva: 'bbva_pe_retail',
  scotiabank: 'scotiabank_pe_retail',
  banbif: 'banbif_pe_retail',
  mibanco: 'mibanco_pe_retail',
} as const

export type PeruBankKey = keyof typeof PERU_BANK_INSTITUTIONS

/**
 * Placeholder for Belvo API calls.
 * In production, these would use the Belvo SDK or REST API.
 */
export const belvoApi = {
  /**
   * Create a link token for the Belvo Link widget.
   * The frontend uses this to initialize the widget.
   */
  async createLinkToken(_institution: string): Promise<{ access_token: string }> {
    // TODO: Implement with Belvo SDK
    // const belvo = new Belvo(config.secretId, config.secretPassword, config.apiUrl)
    // await belvo.connect()
    // const response = await belvo.widgetToken.create({ institution })
    throw new Error('Belvo integration not yet configured. Add API credentials to .env.local')
  },

  /**
   * Register a bank link after user authenticates via widget.
   */
  async registerLink(_linkId: string): Promise<{ id: string; institution: string; status: string }> {
    // TODO: Implement
    // const link = await belvo.links.detail(linkId)
    throw new Error('Belvo integration not yet configured')
  },

  /**
   * Fetch accounts for a connected link.
   */
  async fetchAccounts(_linkId: string): Promise<unknown[]> {
    // TODO: Implement
    // return await belvo.accounts.list(linkId)
    throw new Error('Belvo integration not yet configured')
  },

  /**
   * Fetch transactions for a connected link.
   */
  async fetchTransactions(
    _linkId: string,
    _dateFrom: string,
    _dateTo: string
  ): Promise<unknown[]> {
    // TODO: Implement
    // return await belvo.transactions.list(linkId, dateFrom, dateTo)
    throw new Error('Belvo integration not yet configured')
  },

  /**
   * Fetch balances for a connected link.
   */
  async fetchBalances(_linkId: string): Promise<unknown[]> {
    // TODO: Implement
    // return await belvo.balances.list(linkId)
    throw new Error('Belvo integration not yet configured')
  },
}
