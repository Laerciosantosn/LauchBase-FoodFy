const express =  require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)

server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

// express.urlencoded RESPONSAVEL POR FAZER FUNCIONAR O REQ.BODY
server.use(express.urlencoded({ extended: true }))
// === CONFIGURAÇÕES DO STILO ONDE FICARA AS IMG, STYLE.CSS E ARQUIVOS JS ETC. ===
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

// === CONFIGURAÇÕES DO TEPLATE ENGINE ===
server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express : server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function(){
    console.log('Server is running')
})