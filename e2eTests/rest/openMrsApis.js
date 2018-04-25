let I;

// Detaled description of each API found at:
// https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
module.exports = {

  _init() {
    const initApi = (packageLocation) => {
      const api = require(packageLocation)
      api._init()
      return api
    }

    this.person = initApi('./apis/person')
    this.user = initApi('./apis/user')
  },
}