const express =require("express"); 
const bodyParser= require("body-parser");
const request = require("request");
const https =require("https");
const port = process.env.PORT || 3000; 

const app = express(); 
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.get("/", (req, res)=>{
    res.render("index", {
        news:true
    })
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
    const url =`https://us1.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`
    const options ={
        method:'POST', 
        auth:`dalideco:${process.env.API_KEY}`

    }
    const myReq=https.request(url, options, response =>{
        res.render('index', {
            news:false,
            status: (response.statusCode===200),
        })
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

