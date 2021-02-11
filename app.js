const express =require("express"); 
const bodyParser= require("body-parser");
const request = require("request");
const https =require("https");
const port = process.env.PORT || 3000; 

const app = express(); 
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

app.post("/", (req,res)=>{
    const name = req.body.name;
    const email = req.body.address;

    const data ={
        members : [
            {
                email_address : email,
                status: "subscribed",
                merge_fields:{
                    FNAME: name
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url ='https://us1.api.mailchimp.com/3.0/lists/f027d4be30'
    const options ={
        method:'POST', 
        auth:'dalideco:b56e1e04da09431c61bf20bde64b6275-us1'

    }
    const myReq=https.request(url, options, response =>{
        if(response.statusCode ==200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname +"/fail.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data))
        })
    })
    myReq.write(jsonData);
    myReq.end();
    
})
app.post("/fail",(req, res)=>{
    res.redirect("/");
})

app.listen(port, ()=>{
    console.log("server started at "+port);
})

//API KEY 
// b56e1e04da09431c61bf20bde64b6275-us1

//list id 
//f027d4be30