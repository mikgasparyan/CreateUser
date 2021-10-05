const express = require('express');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const PORT = 3000

const app = express(); 
function start(){  
    try{
         mongoose.connect('mongodb+srv://mika:mika123@cluster0.ffkp0.mongodb.net/todos', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('Server has been started...');
        })
    } catch(e){
        console.log(e);
    }
}
start();
const db = mongoose.connection;
db.once('open', () =>{
    console.log('Kpav');
});

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: {
        required: true,
        type: String,
        minlength: 3,
        maxlength: 50
    }
})

const user1 = mongoose.model(
    'myUser', userSchema
)

app.use(express.json());

app.post('/users', (req, res) =>{

    const user = new user1({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });

    try{
        user.save()
        }
        
        catch(e){
            console.log(e);
        }
        
        

        res.send('Success!');
})


app.get('/users', (req, res) =>{
    user1.find({}, (err, users) =>{
        if(err){
            throw new Error(err.name);
        } 
        res.send(users)});
})


app.delete("/users/:userId",function(req,res){
        user1.findByIdAndRemove(req.params.userId,function(err){ 
    user1.find({},function(err,doc){
      res.send('deleted');
     });
    });
   });


app.get('/users/:searchBy', async (req, res) =>{
    try{
        const user = await user1.findById(req.params.searchBy)
        if(!user)
        return res.status(404).send()
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e.message)
    }
})   

app.put('/users/:searchByValue', async (req, res) => {
    try{
        const user = await user1.findByIdAndUpdate(req.params.searchByValue, req.body)
        if(!user)
        return res.status(404).send();
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e.message)
    }
})



