import {default as getTeam} from './getTeam'
import {default as createTeam} from './createTeam'
import {default as addUserToTeam} from './addUserToTeam'
import {default as addCollaboratorToRepo} from './addCollaboratorToRepo'
import {default as getCollaboratorsForRepo} from './getCollaboratorsForRepo'
import {default as removeUserFromOrganizations} from './removeUserFromOrganizations'
import {default as removeUserFromOrganization} from './removeUserFromOrganization'

/**
* NOTE: this service's functions are exported the way they are to enable
* certain stubbing functionality functionality for testing that relies on the
* way the module is cached and later required by dependent modules.
*/

export default {
  getTeam,
  createTeam,
  addUserToTeam,
  addCollaboratorToRepo,
  getCollaboratorsForRepo,
  removeUserFromOrganization,
  removeUserFromOrganizations,
}
