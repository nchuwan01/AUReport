
const express = require('express');
const AdminTicketRouter = express.Router();
const AdminTicketModel = require('./../models/AdminTicketsModel');
const sendEmail = require('../SendEmail/sendemail');
const data = new AdminTicketModel();

AdminTicketRouter.get("/location/getAllLocations", async(req, res) =>{
      const result = await data.getLocations();

      res.send(result.rows);
})

AdminTicketRouter.get("/location/ticket/:ticketID",  async (req,res) =>{
  console.log("It's here!")

    const result = await data.getTicketByID(req.params.ticketID);
   // console.log(result.rows);
    res.send(result.rows);
    
  })
AdminTicketRouter.post("/location/ticket/:ticketID",  async (req,res) =>{
  console.log(req.body[0].image)
  if(req.body[0].emailTo)
  {
    let sendMessage = await sendEmail(req.body[0].emailTo, req.body[0].subject, req.body[0].message, req.body[0].image);

  }
  else{
    console.log("Email not recieved!");
  }

  const result = await data.updateTicket(req.body[0]);
  res.send('recieved');
    // console.log("It's here!")
    //   const result = await data.getTicketByID(req.params.ticketID);
    //  // console.log(result.rows);
    //   res.send(result.rows);
      
    })


AdminTicketRouter.get("/location/:ticketLocation/:ticketStatus",  async (req,res) =>{
    // if(req.params.email)
    // {
    //   console.log("recieved email");
    //   sendEmail();
    // }
    // else 
    // {
    //   console.log("No email found");
    // }
    const result = await data.getTickets(req.params.ticketLocation, req.params.ticketStatus);

     //console.log(result.rows);
    res.send(result.rows);
    
  })

module.exports = AdminTicketRouter;
