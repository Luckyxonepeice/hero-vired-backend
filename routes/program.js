const route = require("express").Router();
const pool = require("../db");

route.get("/get-faculty", async (req, res) => {
  let result = null;

  if (req.query.id) {
    const id = req.query.id;

    try {
      //const program = await pool.query(`SELECT * FROM programs where program_id = ${id}`);
      const faculty = await pool.query(
        `SELECT * FROM faculty where faculty_id = ${id}`
      );

      result = faculty.rows;
    } catch (err) {
      res.json({
        Error: "Error on Retreival of Programs",
      });
    }
  } else {
    try {
      const faculty = await pool.query("SELECT * FROM faculty");
      result = faculty.rows;
      //faculty = await pool.query(`SELECT * FROM programFaculty where program_id = ${id}`);
    } catch (err) {
      res.json({
        Error: "Error on Retreival of Programs",
      });
    }
  }
  res.send(result);
});

route.post("/create-programs", async (req, res)=>{

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
    program_id: _, // Use an underscore or any variable name you won't use
  } = req.body;

  const queryText = `
  INSERT INTO programs (
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
        result:"Succesfully Created Program"
    })
  }catch (err) {
    console.log(err);
    res.json({ Error: "Error while Creating Program" });
  }

})
route.get("/get-programs", async (req, res) => {
  let result = null;

  //console.log(req.query)

  if (req.query.id) {
    const id = req.query.id;

    try {
      const program = await pool.query(
        `SELECT * FROM programs WHERE program_id = ${id}`
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
      const program = await pool.query("SELECT * FROM programs");
      result = {
        program: program.rows,
      };
      //faculty = await pool.query(`SELECT * FROM programFaculty where program_id = ${id}`);
    } catch (err) {
      res.json({
        Error: "Error on Retreival of Programs",
      });
    }
  }
  res.json(result);
});

route.get("/get-program", async (req, res) => {
    const id = req.query.id;

    try {
      const program = await pool.query(
        `SELECT * FROM programs WHERE program_id = ${id}`
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
  res.json(result);
});

route.post("/update-program", async (req, res) => {


  const {
    program_id,
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
        UPDATE programs 
        SET 
            name = $1,
            price = $2,
            domain = $3,
            program_type = $4,
            registrations_status = $5,
            description = $6,
            placement_assurance = $7,
            image_url = $8,
            university_name = $9,
            learning_hours = $10,
            duration = $11,
            certificate_diploma = $12,
            eligibility_criteria = $13
        WHERE program_id = ${program_id};
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
    await pool.query(queryText, values);

    await pool.query(
      `DELETE FROM programFaculty where program_id=${program_id}`
    );

    faculty.forEach(async (element) => {
      const queryText = 'INSERT INTO programFaculty (program_id, faculty_id) VALUES ($1, $2)';
      const queryValues = [program_id, element];
    
      await pool.query(queryText, queryValues);
    });

    res.json({
        result:"Succesfully Updated"
    })
  }catch (err) {
    res.json({ Error: "Error while Updating" });
  }


});

route.delete("/delete-program/:program_id", async (req, res) => {
  const id = req.params.program_id;

  try {
    await pool.query(`DELETE FROM programs WHERE program_id=${id}`);
    await pool.query(`DELETE FROM programFaculty WHERE program_id=${id}`)
    res.json({ result: "Deleted Successfully" });
  } catch (err) {
    res.status(505).json({
      Error: "Error on Deletion of Programs",
    });
  }
});


module.exports = route;
