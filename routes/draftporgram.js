const route = require("express").Router();
const pool = require("../db");

route.get("/get-draftprogram", async (req, res) => {

    let result = null;
  
    //console.log(req.query)
  
    if (req.query.id) {
      const id = req.query.id;
  
      try {
        const program = await pool.query(
          `SELECT * FROM programsdraft WHERE program_id = ${id}`
        );
        const faculty = await pool.query(
          `SELECT * FROM programFaculty WHERE program_id = ${id}`
        );
  
        result = {
          program: program.rows,
          faculty: faculty.rows,
        };
      } catch (err) {
        res.json({
          Error: "Error on Retreival of Programs",
        });
      }
    } else {
  
      try {
        const program = await pool.query("SELECT * FROM programsdraft");
        result = {
          program: program.rows,
        };
        //faculty = await pool.query(`SELECT * FROM programFaculty where program_id = ${id}`);
      } catch (err) {
        res.json({
          Error: "Error on Retreival of Draft-Programs",
        });
      }
    }
    res.json(result);
  
  }); 
  
  route.post('/create-draftprogram',async(req,res)=>{
  
    const {
      name,
      price,
      domain,
      program_type,
      registrations_status,
      description,
      placement_assurance,
      image_url,
      university_name,
      learning_hours,
      duration,
      certificate_diploma,
      eligibility_criteria,
      faculty,
    } = req.body;
  
    const queryText = `
    INSERT INTO programsdraft (
      name, price, domain, program_type, registrations_status,
      description, placement_assurance, image_url, university_name,
      learning_hours, duration, certificate_diploma, eligibility_criteria
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING *;
  `;
  
    const values = [
      name,
      price,
      domain,
      program_type,
      registrations_status,
      description,
      placement_assurance,
      image_url,
      university_name,
      learning_hours,
      duration,
      certificate_diploma,
      eligibility_criteria,
    ];
  
    try {
        const tmp  = await pool.query(queryText, values);

        const p_id = tmp.rows[0].program_id;
    
        faculty.forEach(async (element) => {
          const queryText = 'INSERT INTO programFaculty (program_id, faculty_id) VALUES ($1, $2)';
          const queryValues = [p_id, element];
        
          await pool.query(queryText, queryValues);
        });
  
      res.json({
          result:"Succesfully Created DraftProgram"
      })
    }catch (err) {
      res.json({ Error: "Error while Creating DraftProgram" });
    }
  
  
  })
  
  route.delete("/delete-draftprogram", async (req, res) => {
    
    const id = req.params.id;
  
    try {
      await pool.query(`DELETE FROM programsdraft WHERE program_id=${id}`);
      await pool.query(`DELETE FROM programFaculty WHERE program_id=${id}`)

      res.json({ result: "Deleted Successfully" });
    } catch (err) {
      res.status(404).json({
        Error: "Error on Deletion of Draft-Programs",
      });
    }
    
  });

  module.exports = route;
