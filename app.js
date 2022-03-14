let db
const express = require("express")
const app = express()
const df = require('dotenv').config()
const port = process.env.PORT || 5000
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const mongourl = "mongodb+srv://test:123@cluster0.qy83a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const mongourl = "mongodb://localhost:27017/lenskart"
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.status(200).send('welcome to lenskart api')
})
app.get('/brands',(req,res)=>{
    db.collection('brand name').find().toArray((err,result)=>{
        if(err) throw err
        res.status(200).send(result)
    })
})
app.get('/glass/:id',(req,res)=>{
    const {id} = req.params
    const oId = new mongo.ObjectId(id)
    db.collection('glasses data').find({"_id":oId}).toArray((err,result)=>{
        if(err) throw err
        res.status(200).send(result)
    })
})

// getting data on the bases of brand id
app.get('/brand/:id',(req,res)=>{
    let {id} = req.params
    let {cId,fType,fShape} = req.query
    // console.log(`req came with id  ${typeof(id)}`)
    let query ={"technical.brand_id":id}
    if (fType&fShape&cId){
        query= {"technical.brand_id":id, "technical.ftype_id":fType,"technical.fshape_id":fShape,"category_id":cId}
    }
    else if (fType&fShape){
        query= {"technical.brand_id":id, "technical.ftype_id":fType,"technical.fshape_id":fShape}

    }
    else if (fType&cId){
        query= {"technical.brand_id":id,"technical.ftype_id":fType, "category_id":cId}
    }
    else if (fShape&cId){
        query= {"technical.brand_id":id,"technical.fshape_id":fShape,"category_id":cId}
    }
    else if (fType){
        query= {"technical.brand_id":id, "technical.ftype_id":fType}

    }
    else if (cId){
        query= {"technical.brand_id":id, "category_id":cId}
    }
    else if (fShape){
        query= {"technical.brand_id":id,"technical.fshape_id":fShape}
    }
      
    db.collection('glasses data').find(query).toArray((err,result)=>{
        if(err) throw err
        res.status(200).send(result)
    })
})

// getting data on the bases of category id
app.get('/category/:id',(req,res)=>{
    let {id} = req.params
    let {bId,fType,fShape} = req.query
    // console.log(`req came with id  ${typeof(id)}`)
    let query ={"category_id":id}
    if (fType&fShape&bId){
        query= {"category_id":id, "technical.ftype_id":fType,"technical.fshape_id":fShape,"technical.brand_id":bId}
    }
    else if (fType&fShape){
        query= {"category_id":id, "technical.ftype_id":fType,"technical.fshape_id":fShape}

    }
    else if (fType&bId){
        query= {"category_id":id,"technical.ftype_id":fType,  "technical.brand_id":bId}
    }
    else if (fShape&bId){
        query= {"category_id":id,"technical.fshape_id":fShape, "technical.brand_id":bId}
    }
    else if (fType){
        query= {"category_id":id, "technical.ftype_id":fType}

    }
    else if (bId){
        query= {"category_id":id, "technical.brand_id":bId}
    }
    else if (fShape){
        query= {"category_id":id,"technical.fshape_id":fShape}
    }
      
    db.collection('glasses data').find(query).toArray((err,result)=>{
        if(err) throw err
        res.status(200).send(result)
    })
})

// api for posting order
app.post('/placeorder/glasses',(req,res)=>{
    db.collection('orders').insert(req.body,(err,result)=>{
        if (err) throw err 
        res.send(result)
    })

})
// api for posting order
app.delete('/deleteOrder/:id',(req,res)=>{
    let oId = mongo.ObjectId(req.params.id)
    db.collection('orders').remove({"_id":oId},(err,result) =>{
        if(err) throw err;
        res.send(result)
    })

})

app.put('/updateOrder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id)
    let status = req.query.status?req.query.status:'Pending'
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":status,
            "bank_name":req.body.bank_name,
            "bank_status":req.body.bank_status
        }},(err,result)=>{
            if(err) throw err;
            res.send(`Status Updated to ${status}`)
        }
    )
})

MongoClient.connect(mongourl,(err,connection)=>{
    if (err) throw err 
    db = connection.db('lenskart')
    app.listen(port,()=>{
        console.log(`app is running on port ${port}`)
    }) 
})

