import {default as addCollaboratorToApp} from './addCollaboratorToApp'
import {default as getCollaboratorsForApp} from './getCollaboratorsForApp'
import {default as removeCollaboratorFromApps} from './removeCollaboratorFromApps'
import {default as removeCollaboratorFromApp} from './removeCollaboratorFromApp'

/**
* NOTE: this service's functions are exported the way they are to enable
* certain stubbing functionality functionality for testing that relies on the
* way the module is cached and later required by dependent modules.
*/

export default {
  addCollaboratorToApp,
  getCollaboratorsForApp,
  removeCollaboratorFromApp,
  removeCollaboratorFromApps,
}
