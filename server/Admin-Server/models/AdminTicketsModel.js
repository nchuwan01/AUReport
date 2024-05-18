const { response } = require('express');
const client = require('../../util/db');

class AdminTicketsModel{
    
  getTicketByID = async (ticketID) =>{
  

    try{
      const query = `SELECT reports.description, reports.image, reports.location, reports.reportid, reports.title, reports.status,users.email FROM reports INNER JOIN users ON reports.userid = users.userid WHERE reports.reportid=$1`;

      let result = await client.query(query, [ticketID]);

      return result;

    }catch(error){
      console.log(error);
    }
 
 
 
  }

    getTickets = async (location, ticketStatus) =>{

        try 
        {
            let query = `Select * FROM reports where status=$1 ORDER BY "timestamp" DESC`;

            console.log(location);
            let result = "";

            if(location != "All")
            {
                query = `SELECT * FROM public.reports WHERE location[1]=$1 ORDER BY "timestamp" DESC`;

                if(ticketStatus != "all")
                {
                  query = `SELECT * FROM public.reports WHERE location[1]=$1 AND status=$2 ORDER BY "timestamp" DESC`;

                  result = await client.query(query, [location, ticketStatus]);
                }else {
                  result = await client.query(query, [location]);
                }
                

            }
            else {
              if(ticketStatus == "all")
              {
                let query = `Select * FROM reports ORDER BY "timestamp" DESC`;
                result= await client.query(query);

              }
              else {
                result= await client.query(query,[ticketStatus]);


              }
            

            }

           // console.log(result.rowCount);


            return result;

          } catch (error) {
            console.error('Error querying messages:', error.stack);
            throw error; // Re-throw the error to be caught by the caller
          }
    }

    getLocations= async()=>{
      try{
        const query = "SELECT SPLIT_PART(buildingname, ' ', 1) AS first_word, buildingname FROM buildings";        //console.log(data);
       // console.log(data.title, data.status, data.ticketId);
        let result = await client.query(query);
        console.log(result);
  
        return result;
  
      }catch(error){
        console.log(error);
      }
    }
    updateTicket=async (data)=>{
      try{
        const query = "UPDATE reports SET title=$1, status=$2, updated_at=current_timestamp WHERE reportid=$3"        //console.log(data);
       // console.log(data.title, data.status, data.ticketId);
        let result = await client.query(query, [data.title, data.status, data.ticketId]);
        console.log(result);
  
        return result;
  
      }catch(error){
        console.log(error);
      }
   
    }

    
}

module.exports = AdminTicketsModel;