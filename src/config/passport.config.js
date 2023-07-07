import passport from 'passport';
import GithubStrategy from 'passport-github2';
import { createUser, getAll, getByEmail, updateUserPassword, getById } from '../dao/session.js';

const initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.9dccab98ad26d131',
        clientSecret: '34c3299f79ce775eddf6b3cd8e831b83a0bb8de2',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let userEmail = profile.emails[0].value;
            let user = await getByEmail(userEmail);
            if(!user){
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    email: userEmail,
                    password: "",
                    age: 20
                }
                let result = await createUser(newUser);
                done(null, result)
            }else{
                done(null, user)
            }
        } catch (error) {
            done(error)
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await getById(id);
        done(null, user);
    })
}

export default initializePassport;