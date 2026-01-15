const r=require("express").Router();
const {send}=require("../controllers/contactController");
r.post("/",send);module.exports=r;