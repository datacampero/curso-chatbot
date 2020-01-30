'use strict'

module.exports = function setupParking (ParkingModel) {
  async function createOrUpdate (parking) {
    const cond = {
      where: {
        id: parking.id
      }
    }

    const existingParking = await ParkingModel.findOne(cond)

    if (existingParking) {
      const updated = await ParkingModel.update(parking, cond)
      return updated ? ParkingModel.findOne(cond) : existingParking
    }

    const result = await ParkingModel.create(parking)
    return result.toJSON()
  }

  function findById (id) {
    return ParkingModel.findById(id)
  }

  function findAll () {
    return ParkingModel.findAll()
  }

  return {
    createOrUpdate,
    findById,
    findAll
  }
}
