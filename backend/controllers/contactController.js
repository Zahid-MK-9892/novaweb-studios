const Contact=require("../models/Contact");
exports.send=async(req,res)=>{
 await Contact.create(req.body);
 res.json({ok:true});
};