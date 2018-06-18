import fs from 'fs'
import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import Server from '../../server'
import settings from '../../../config/settings.json'
import Apikey from '../../tools/apikey'

chai.use(chaiHttp)

//Server without authorize
settings.useAuth = false
let server = new Server(settings).test()

//Server with token authorize
settings.useAuth = true
let authserver = new Server(settings).test()

let invalidQuery = fs.readFileSync(__dirname + '/../../../mocks/query_templates/invalid_query.json', {encoding: 'utf8'})
let validQuery = fs.readFileSync(__dirname + '/../../../mocks/query_templates/valid_query.json', {encoding: 'utf8'})

describe('QueryController', () => {
  describe('.get', () => {
    it('Should return 400 for invalid query', function () {
      chai.request(server)
        .get('/query/' + invalidQuery)
        .end((err, res) => {
          expect(res).to.have.status(400)
          server.close()
        })
    })
    it('Should return 200 with valid query', function () {
      chai.request(server)
        .get('/query/' + validQuery)
        .end((err, res) => {
          expect(res).to.have.status(200)
          server.close()
        })
    })
    it('Should return 401 without token using authorization', function () {
      chai.request(authserver)
        .get('/query/' + validQuery)
        .end((err, res) => {
          expect(res).to.have.status(401)
          server.close()
        })
    })
    it('Should return 200 with token using authorization', function () {
      let apikey = new Apikey()
      chai.request(authserver)
        .get('/query/' + validQuery)
        .set('X-API-KEY', apikey.readToken())
        .end((err, res) => {
          expect(res).to.have.status(200)
          server.close()
        })
    })
  })
})