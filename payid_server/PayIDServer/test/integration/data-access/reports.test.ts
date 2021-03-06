import 'mocha'
import { assert } from 'chai'

import {
  getAddressCounts,
  getPayIdCount,
} from '../../../src/data-access/reports'
import { seedDatabase } from '../../helpers/helpers'

describe('Data Access - getPayIdCounts()', function (): void {
  before(async function () {
    await seedDatabase()
  })

  it('getAddressCounts - Returns a result per by unique network and environment', async function () {
    const results = await getAddressCounts()
    const expected = [
      {
        paymentNetwork: 'ACH',
        environment: null,
        count: 2,
      },
      {
        paymentNetwork: 'BTC',
        environment: 'MAINNET',
        count: 1,
      },
      {
        paymentNetwork: 'BTC',
        environment: 'TESTNET',
        count: 3,
      },
      {
        paymentNetwork: 'INTERLEDGER',
        environment: 'TESTNET',
        count: 1,
      },
      {
        paymentNetwork: 'XRPL',
        environment: 'MAINNET',
        count: 2,
      },
      {
        paymentNetwork: 'XRPL',
        environment: 'TESTNET',
        count: 6,
      },
    ]
    assert.deepEqual(results, expected)
  })

  it('getPayIdCount - Returns a count of PayIDs', async function () {
    const payIdCount = await getPayIdCount()
    const expectedPayIdCount = 11

    assert.strictEqual(payIdCount, expectedPayIdCount)
  })
})
