import { describe, expect, it } from 'bun:test'
import { capitalize } from './helpers'

describe('Helpers tests', () => {
  it('Capitalize', () => {
    expect(capitalize('test')).toBe('Test')
    expect(capitalize('TEST')).toBe('TEST')
    expect(capitalize('')).toBe('')
  })
})
