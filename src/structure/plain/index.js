import getIn from './getIn'
import setIn from './setIn'

const structure = {
  fromJS: value => value,
  getIn,
  merge: (state, payload) => ({ ...state, ...payload }),
  toJS: value => value,
  setIn
}

export default structure
