import { describe, expect, it } from 'bun:test'
import { createUserDtoScheme } from './create-update.dto'

describe('User`s dtos tests', () => {
  it('Create user dto must have only a valid phoneNumber', () => {
    const validCUDto = {
      phoneNumber: '9211809476',
    }
    expect(() => createUserDtoScheme.parse(validCUDto)).not.toThrow()
  })

  it('Create user dto must throw if doesnt have phoneNumber', () => {
    const inlalidCUDto = {}
    expect(() => createUserDtoScheme.parse(inlalidCUDto)).toThrow()
  })

  it('Create user dto must throw with an invalid phoneNumber', () => {
    const inlalidCUDto = {
      phoneNumber: '921',
    }
    expect(() => createUserDtoScheme.parse(inlalidCUDto)).toThrow()
    inlalidCUDto.phoneNumber = '92118094769211809476'
    expect(() => createUserDtoScheme.parse(inlalidCUDto)).toThrow()
    inlalidCUDto.phoneNumber = '921180947a'
    expect(() => createUserDtoScheme.parse(inlalidCUDto)).toThrow()
  })
})
