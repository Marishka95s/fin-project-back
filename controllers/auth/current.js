const current = async(req, res) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: req.user
    }
  })
}

module.exports = current
