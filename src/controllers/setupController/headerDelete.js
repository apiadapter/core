import errors from 'restify-errors'
import mongoose from 'mongoose'
import Header from '../../dal/entities/headers/headerModel'

const ObjectId = mongoose.Types.ObjectId

module.exports = function handler(req, res, next) {
  Header.findOne({_id: ObjectId(req.params.headerId)}, function(err, header) {
    if (err) {
      return next(
        new errors.InvalidContentError(err.errors.name.message),
      )
    }
    else {
      let data = Object.assign({}, data, {_id: ObjectId(req.params.headerId), updated: new Date(), deleted: true})
      header = Object.assign(header, data)
      header.save(function (err, item) {
        if (err) {
          return next(
            new errors.InvalidContentError(err.errors.name.message),
          )
        }
        else {
          res.send(202)
          next()
        }
      })
    }
  })
}