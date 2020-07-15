const mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    lists: [
        {
           items:[
               {
                   item: String,
                   quantity: Number
               }
           ],
           deliveryDate: String,
           status: 0 // 0 - free,1 - inProgress and 2 - fulfilled - push and pop from arrays 
        }
   ]
 });


const List = mongoose.model("List", listSchema);
module.exports = List;