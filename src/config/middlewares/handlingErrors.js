/** @format */

module.exports = [
  (req, res, next) => {
    res.status(404).json({
      status: 404,
      message: '404 not found',
    })
  },
  (err, req, res, next) => {
    res.status(err.status || 500).json(err)
  },
]
