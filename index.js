const express = require('express')
const parser = require('body-parser')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const axios = require('axios')
const userModel = require('./models/user.js')
const nodemailer = require('nodemailer')
const carouselModel = require('./models/carousel.js')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.connect("mongodb://127.0.0.1:27017/anime").then((success) => {
    app.listen(3000)
}).catch(e => console.log(e));

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server host
    port: 465, // Replace with your SMTP server port
    secure: true, // Use true if your server requires TLS encryption
    auth: {
          user: 'asawayoshanai1024@gmail.com', // Your Gmail email address
          pass: 'ofyrwfzkarzoggav' // Your Gmail password or app-specific password
      }
});


app.get('/carousel', async (req,res) => {
    let carousel = await carouselModel.find({})
    res.render('carousel.ejs', {carousel: carousel})
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})

app.get('/signup', (req,res) => {
    res.render('reg.ejs')
})

app.get('/admin', async (req,res) => {
    res.render('admin.ejs')
})

app.get('/usersList', async (req,res) => {
    let users = await userModel.find({})
    res.render('userList.ejs', {users: users})
})

app.get('/editCarousel', async(req,res) => {
    let carousel = await carouselModel.find({})
    res.render('editCarousel', {carousel: carousel})
})

app.post('/editCarousel', async (req,res) => {
    let carousel = await carouselModel.updateOne({_id:req.body.id}, {$set: {title: req.body.title, body: req.body.body, link: req.body.link}})
    res.redirect('/editCarousel')
})

app.post('/signup', async (req,res) => {
        req.body.password = bcrypt.hashSync(req.body.password, 5)
        let user = await userModel.create(req.body)
        console.log(req.body.email)
        const mail = await transporter.sendMail({
            from: "asawayoshanai1024@gmail.com", // sender address
            to: req.body.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          })
        res.redirect('login.ejs')
})

app.post('/login', async (req,res) => {
    let user = await userModel.findOne({login:req.body.login})
    if(await bcrypt.compare(req.body.password, user.password)){
        if(user.admin)
            res.redirect('/admin')
        else
            res.redirect('/carousel');
    }
    else{
        res.render('incorrect.ejs')
    }
    
})

app.get('/mangaList', async (req,res) => {
    let mangaList = await axios.get('https://mangaverse-api.p.rapidapi.com/manga/fetch?page=1&genres=Harem%2CFantasy&nsfw=true&type=all', {headers: {'X-RapidAPI-Key' : 'ea1a7ec716msh1aa665c41465141p15b61ejsnc237f44da746'}})
    mangaList = mangaList.data.data;
    res.render('mangaList.ejs', {mangaList:mangaList})
})

app.get('/animeList', async (req,res) => {
    let animeList = await axios.get('https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=Fullmetal&genres=Fantasy%2CDrama', {headers: {'X-RapidAPI-Key' : 'ea1a7ec716msh1aa665c41465141p15b61ejsnc237f44da746'}})
    animeList = animeList.data.data
    res.render('animeList.ejs', {animeList:animeList})
})

app.get('/animeNews', async (req,res) => {
    let animeNews = await axios.get('https://anime-news-net.p.rapidapi.com/api/news', {headers: {'X-RapidAPI-Key' : 'ea1a7ec716msh1aa665c41465141p15b61ejsnc237f44da746'}})
    animeNews = animeNews.data
    res.render('animeNews.ejs', {animeNews:animeNews})
})
