import _ from 'lodash'

export const arrayWrap = x => {
  if (_.isArray(x)) {
    return x
  }
  if (_.isNil(x)) {
    return []
  }
  return [x]
}
