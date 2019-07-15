import getIn from './getIn'
import { Structure } from '../../types'

const structure: Structure = {
  fromJS: value => value,
  getIn,
  merge: (state, payload) => ({ ...state, ...payload })
}

export default structure
