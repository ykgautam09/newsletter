const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const dotenv =require('dotenv')
dotenv.config()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function (req, res) {
    var fname = req.body.fname
    var lname = req.body.lname
    var email = req.body.email

    var jsonfile = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                }
            }

        ]
    }
    var jsonData = JSON.stringify(jsonfile)

    var option = {
        url: process.env.MAILCHIMP_URL,
        method: 'POST',
        headers: {
            'authorization': process.env.AUTHOURIZATION,
        },
        body: jsonData,
    }

    request(option, function (error, response, body) {
        if (error)
            res.sendFile(__dirname+'/failure.html')
            else{
        if (response.statusCode === 200)
            res.sendFile(__dirname+'/success.html')
        else
            res.sendFile(__dirname+'/failure.html')
            }
    })

})

app.post('/failure',function(req,res){
    res.redirect('/')
})



app.listen(process.env.PORT || 3000, function () {
    console.log('server running at port 3000')
})
