const mongoose = require( "mongoose" );
const DB = "mongodb://localhost:27017/taskManagementdb"

mongoose.connect( DB, {} ).then( () => {
    console.log("successfully connected with db")
 } ).catch( (err) =>{
    console.log("error in connection with db" + err)
})