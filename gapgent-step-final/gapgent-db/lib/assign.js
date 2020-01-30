'use strict'

module.exports = function setupAssign (AssignModel, UserModel, ParkingModel) {
  async function createOrUpdate (assignment) {
    const cond = {
      where: {
        id: assignment.id
      }
    }

    const existingAssignment = await AssignModel.findOne(cond)

    if (existingAssignment) {
      const updated = await AssignModel.update(assignment, cond)
      return updated ? AssignModel.findOne(cond) : existingAssignment
    }

    const result = await AssignModel.create(assignment)
    return result.toJSON()
  }

  async function createAssignment (assignment) {
    const existingAssignment =  await findOneByParking(assignment.slot, assignment.assign_date)
    const cond = {
      where: {
        id: existingAssignment.id
      }
    }

    console.log(existingAssignment)

    if (existingAssignment) {
      const updated = await AssignModel.update(assignment, cond)
      return updated ? AssignModel.findOne(cond) : existingAssignment
    }
  }

  function findById (id) {
    return AssignModel.findById(id)
  }

  async function findByDateAndSpot (assign_date, slot) {
    return AssignModel.findAll({
      attributes: ['id'],
      include: [{
        attributes: [],
        model: ParkingModel,
        where: {
          slot
        }
      }],
      where: {
        assign_date,
        userId: {
          $eq: null
        }
      },
      raw: true
    })
  }

  function findUnassigned ({startDate, endDate}) {
    return AssignModel.findAll({
      attributes: ['id', 'assign_date'],
      include: [{
        attributes: [['slot', 'spot']],
        model: ParkingModel
      }],
      where: {
        assign_date: {
          $between: [new Date(startDate), new Date(endDate)]
        },
        userId: {
          $eq: null
        }
      },
      raw: true
    })
  }

  async function findUserAndSpot (assign_date, license_plate) {
    return AssignModel.findAll({
      attributes: ['id'],
      include: [{
        attributes: [['slot', 'spot']],
        model: ParkingModel
      }, {
        attributes: [['name', 'username']],
        model: UserModel,
        where: {
          license_plate
        }
      }],
      where: {
        assign_date
      },
      raw: true
    })
  }

  async function findBySpot (slot) {
    return AssignModel.findAll({
      attributes: ['id'],
      include: [{
        attributes: [],
        model: ParkingModel,
        where: {
          slot
        }
      }],
      where: {
        userId: {
          $eq: null
        }
      },
      raw: true
    })
  }

  function findAll () {
    return AssignModel.findAll()
  }
  
  async function findOneByParking (slot, assign_date) {
    return AssignModel.findOne({
      attributes: ['id'],
      include: [{
        attributes: [['id', 'parking-id']],
        model: ParkingModel,
        where: {
          slot
        }
      }],
      where: {
        assign_date
      },
      raw: true
    })
  }

  return {
    createOrUpdate,
    findById,
    findByDateAndSpot,
    findUnassigned,
    findUserAndSpot,
    findBySpot,
    createAssignment,
    findAll
  }
}
