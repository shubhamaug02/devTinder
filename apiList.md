# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
 the above 2 clubbed in POST /request/send/:status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
 the above 2 clubbed in POST /request/send/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /feed - Gets you the profile other users on your platform

Status: ignored, interested, accepted, rejected