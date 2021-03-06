import fs from 'fs'
import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'
import Server from '../../server'
import Apikey from '../../tools/apikey'

chai.use(chaiHttp)
let invalidQuery = fs.readFileSync(__dirname + '/../../../mocks/query_templates/invalid_query.json', {encoding: 'utf8'})
let validQuery = fs.readFileSync(__dirname + '/../../../mocks/query_templates/valid_query.json', {encoding: 'utf8'})

//Server without authorize
config.useAuth = false
let server = new Server(config).test()

describe('QueryController without authorization', () => {
  describe('.get', () => {
    it('Should return 400 for invalid query', (done) => {
      chai.request(server)
        .get('/query/' + invalidQuery)
        .end((err, res) => {
          expect(res).to.have.status(400)
          server.close()
          done()
        })
    })
    it('Should return 200 with valid query', (done) => {
      chai.request(server)
        .get('/query/' + validQuery)
        .end((err, res) => {
          expect(res).to.have.status(200)
          server.close()
          done()
        })
    })
  })
})

//Server with token authorize
config.useAuth = true
let authserver = new Server(config).test()

describe('QueryController with authorization', () => {
  describe('.get', () => {
    it('Should return 401 without token', (done) => {
      chai.request(authserver)
        .get('/query/' + validQuery)
        .end((err, res) => {
          expect(res).to.have.status(401)
          server.close()
          done()
        })
    })
    it('Should return 200 with token', (done) => {
      let apikey = new Apikey()
      chai.request(authserver)
        .get('/query/' + validQuery)
        .set('X-API-KEY', apikey.readToken())
        .end((err, res) => {
          expect(res).to.have.status(200)
          server.close()
          done()
        })
    })
  })
})

