import { setupServer } from 'msw/node'
import { rest } from 'msw'

const djangoUrl = 'http://127.0.0.1:8000'

const adminUser = {
    "url": "http://localhost:8000/profile/1/",
    "user_id": 1,
    "username": "admin",
    "email": "admin@bca.com",
    "first_name": "Nonya",
    "last_name": "Buisness",
    "wallet": "0x8Aa46fcE750074e2c31fA2AF8651C73C179E5bED",
    "birthday": "2000-09-08",
    "publicProfile": true
}

const sampleToken = { "token": "2585aa96ef430d0f5c229a4c64fb91cbb96e8841" }

const handleTokenReq = rest.post(`${djangoUrl}/api-token-auth/`, (req, res, ctx) => {
    return res(ctx.json(sampleToken));
})

const handleProfileUnameReq = rest.get(`${djangoUrl}/profile/uname/admin/`, (req, res, ctx) => {
    return res(ctx.json(adminUser));
})

const handleCreateUser = rest.post(`${djangoUrl}/newuser/`, (req, res, ctx) => {
    return res(ctx.json(adminUser))
})


export const server = setupServer(handleTokenReq, handleProfileUnameReq, handleCreateUser);