// @flow

const isEmpty = value => value === undefined || value === null || value === ''
const join = rules => (value, data) =>
  rules.map(rule => rule(value, data)).filter(error => !!error)[0]

export function email(value: string) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (
    !isEmpty(value) &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
  ) {
    return 'Invalid email address'
  }
  return null
}

export function required(value: string) {
  if (isEmpty(value)) {
    return 'Required'
  }
  return null
}

export function minLength(min: number) {
  return (value: string) => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`
    }
    return null
  }
}

export function maxLength(max: number) {
  return (value: string) => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`
    }
    return null
  }
}

export function integer(value: number) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer'
  }
  return null
}

export function oneOf(enumeration: Array<string>) {
  return (value: string) => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`
    }
    return null
  }
}

export function match(field: string) {
  return (value: string | number, data: {}) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match'
      }
    }
    return null
  }
}

export function createValidator(rules: {}) {
  return (data: {} = {}) => {
    const errors = {}
    Object.keys(rules).forEach(key => {
      // concat enables both functions and arrays of functions
      const rule = join([].concat(rules[key]))
      const error = rule(data[key], data)
      if (error) {
        errors[key] = error
      }
    })
    return errors
  }
}
