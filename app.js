const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const port = 4000
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/learn-graphql', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify : false
}, () => {console.log('connected to db')})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql : true
}));

app.listen(port, () => {
    console.log(`API is running at port = ${port}`)
});