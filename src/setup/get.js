export default function handler(req, res, next) {
  res.send(200, 'Hello World')
  next()
}