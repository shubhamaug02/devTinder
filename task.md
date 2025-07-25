- Mutiple Route handlers - Play with the Code
- next()
- next function and errors along with res.send()
- app.use("/route", rH, [rH2, rH3], rH4, rH5)
- What is a middleware? Why do we need it?
- How express JS handles requests works behind the scenes.
- Difference between app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/", (err,req,res,next) => {})

- Install moongoose library
- Connect to your application to the Database "Connection-url/devTiner"
- Call the connectDB function and connect to database before starting application on 7777
- Create a userSchema and user Model
- Create POST /signup API to add data to database
- Push some documents using API calls from the POSTMAN
- Error handling using try/catch

- JS object vs JSON (difference)
- Add the express.json middleware
- Make your signup api dynamic to receive data from the client
- User.findOne with duplicate email ids, which object returned
- API- Get user by email
- API- Feed API - GET /feed - get all the users from the database
- API- get users by ID
- Create a delete user API
- Difference between PATCH and PUT
- API - Update a user
- Explore the Mongoose Documentation for Model methods
- What are options in a Model/findOneAndUpdate method, explore more about it
- API - Update the user with emailId

- Explore schema type options from the mongoose documentation
- add required, unique, lowercase, min,minLength trim etc
- Add default
- Create a custom validate function for gender
- Improve the DB schema - PUT all appropriate validations on each field of Schema
- Add timestamps to the userSchema
- Add API level validation on Patch Request & Signup post api
- Data Sanitizing- Add API validation for each field
- Install validator
- Explore validator library function and use validator funcs for password, email and imageUrl
- NEVER TRUST req.body

- Validate data in signup API
- install bcrypt package
- Create password hash using bcrypt.hash & save the user's encrypted password.
- create login API
- compare password and throw errors if email or password is invalid

- install cookie parser
- just send a dummy cookie to user
- create GET /profile API and check if you get the cookie back
- install jsonwebtoken
- In login API, after email and password validation, create a JWT token and send it to user in a cookie
- read the cookies inside your profile API and find the loggedin user.
- userAuth Middleware
- Add the userAuth middleware in profile api and a new sendConnectionRequest API
- Set the expiry of JWT token and cookies to 7 days
- Create userSchema method to getJWT()
- Create UserSchema method to comparepassword(passwordInputByUser)

- Explore tinder APIs
- Create a list all API you can think of in Dev Tinder
- Group multiple routes under respective routers
- Read documentation for express.Router
- Create routes folder for managing auth,profile, request routers
- create authRouter, profileRouter, requestRouter
- Import these routers in app.js
- Create POST /logout API
- Create PATCH /profile/edit
- Create PATCH /profile/password API => forgot password API
- validate all data in every POST, PATCH apis

- Create Connection Request Schema
- Send Connection Request API
- Proper validation of Data
- Think about ALL corner cases
- $or query and $query in mongoose
- schema.pre("save") function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantages of creating?
- Read article about compound indexes
- ALWAYS THINK ABOUT CORNER CASES

- Write code with proper validation for POST /request/review/:status/:requestId
- Thought process - POST vs GET
- Read about ref and populate.
- create GET /users/requests/received with all the checks.
- Create GET /user/connections API

- Logic for GET /feed API
- Explore the $nin, $and, $ne and other query operators.
- Add pagination using skip and limit
