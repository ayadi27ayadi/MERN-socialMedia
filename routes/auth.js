const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')

// REGISTER
// router.get('/register', async (req,res)=> {
//     const user = await new User({
//         username : "Ayadiiii",
//         email : "ayadiiii@gmail.com",
//         password : '123456',

//     })
//     await user.save();
//     res.send('OK')  
// })

router.post('/register', async (req,res)=> {
     
        try {
            // generate pasword
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            
            // create new user

            const newUser =  new User({
                username : req.body.username,
                email : req.body.email,
                password : hashedPassword,
        
            })

            // save user and response
            const user =  await newUser.save();
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    })


// LOGIN
router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json('email not found');
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(404).json('password not found');
        res.status(200).json(user)
    } catch (error) {
        //console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router