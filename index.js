require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn")
const PORT = 8080;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema")

const clientid = "450212971091-7m46d2q47tg2o823o3sg821g1est0iaj.apps.googleusercontent.com"
const clientsecret = "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"


app.use(cors({
    origin:"https://auth-client-seven.vercel.app",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));
app.use(express.json());

const sessionSecret = "hgsfrr2345";
// setup session
app.use(session({
    secret: sessionSecret,
    resave:false,
    saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            let user = await userdb.findOne({googleId:profile.id});

            if(!user){
                user = new userdb({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"https://auth-client-seven.vercel.app/dashboard",
    failureRedirect:"https://auth-client-seven.vercel.app/login"
}))

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://auth-client-seven.vercel.app");
    })
})

app.listen(PORT,()=>{
    console.log(`server start at port no ${PORT}`)
})
