'use strict'

module.exports = function setupUser (UserModel) {
  async function createOrUpdate (user) {
    const cond = {
      where: {
        id: user.id
      }
    }

    const existingUser = await UserModel.findOne(cond)

    if (existingUser) {
      const updated = await UserModel.update(user, cond)
      return updated ? UserModel.findOne(cond) : existingUser
    }

    const result = await UserModel.create(user)
    return result.toJSON()
  }

  function findById (id) {
    return UserModel.findById(id)
  }

  async function findByLicensePlate (license_plate) {
    return UserModel.findOne({
      attributes: ['id', 'name'],
      where: {
        license_plate
      },
      raw: true
    })
  }

  function findAll () {
    return UserModel.findAll()
  }

  return {
    createOrUpdate,
    findById,
    findByLicensePlate,
    findAll
  }
}
