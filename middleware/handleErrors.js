module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: "the id doesn't exist" })
  } else {
    response.status(500).end()
  }
}
