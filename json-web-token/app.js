const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())

const user = {
    username: 'Ada',
    password: 'pwd123',
    role: 'admin'
}

function auth(request, response, next) {
    const token = request.headers.authorization.replace('Bearer ', '');

    try {
        const data = jwt.verify(token, 'a1b1c1');

        console.log(data);
        request.username = data.username;

        next();
    } catch (error) {
        response.json({ success: false, error: 'You do not have permission' });
    }
}

app.post('/api/user/login', (request, response) => {
    const body = request.body;

    if (body.username === user.username && 
        body.password === user.password) {
        const token = jwt.sign({ username: user.username }, 'a1b1c1', {
            expiresIn: 600 // Går ut om 10 min
        });

        response.json({ success: true, token: token });
    }
});

app.get('/api/user/account', auth, (request, response) => {
    response.json({ success: true, user: request.username });
});

app.listen(PORT, () => {
  console.log('Server started')
})