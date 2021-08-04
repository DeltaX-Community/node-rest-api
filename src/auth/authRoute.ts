import { Router } from 'express'
import * as jwt from "jsonwebtoken"

const router = Router();

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

interface TokenType {
    id: number
    username: string;
    scopes: string[];
}


const users = [
    {
        id: 1,
        username: 'john',
        password: 'password123admin',
        scopes: ['admin']
    }, {
        id: 2,
        username: 'anna',
        password: 'password123member',
        scopes: ['member']
    }
]

let refreshTokens: string[] = [];


router.post('/login', (req, res) => {
    // read username and password from request body
    const { username, password } = req.body;
    console.log(req.body);


    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({
            id: user.id,
            username: user.username,
            scopes: user.scopes
        } as TokenType, accessTokenSecret, { expiresIn: '20m' });

        const refreshToken = jwt.sign({
            id: user.id
        }, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});



router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    var x = jwt.verify(token, refreshTokenSecret, { ignoreExpiration: false, complete: true }) as jwt.Jwt;
    const user = users.find(u => { return u.id === x.payload["id"] });

    if (user) {
        const accessToken = jwt.sign({
            id: user.id,
            username: user.username,
            scopes: user.scopes
        } as TokenType, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    }
    else {
        res.sendStatus(403);
    }
});


const scopes = ["admin"]

router.post('/secureTest', (req, res) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"];

    console.log(req.body, req.query, req.headers)
    console.log("token", token)
    if (!token) {
        res.json(new Error("No token provided"));
    }

    jwt.verify(token, accessTokenSecret, (err: any, decoded: any | TokenType) => {
        if (err || !decoded) {
            res.json(err || "Not decoded");
        } else {
            console.log("decoded", decoded)
            // Check if JWT contains all required scopes
            for (let scope of scopes) {
                if (!decoded.scopes.includes(scope)) {
                    res.json(new Error("JWT does not contain required scope."));
                }
            }
            res.json(decoded);
        }
    });
});


router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("Logout successful");
});

export default router;


