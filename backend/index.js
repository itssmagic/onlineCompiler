const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./excecuteCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const app = express();

//middlware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Welcome to CodeZen Compiler");
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    res.status(500).json({ success: "false", message: "Empty code body" });
  }

  try {
    const filePath = await generateFile(language, code);
    
    if(language == "py")
    {
      const output = await executePy(filePath);
      res.send({ filePath, output });
    }
    else if(language == "cpp")
    {
      const output = await executeCpp(filePath);
      res.send({ filePath, output });
    }
    else if(language == "java")
    {
      const output = await executeJava(filePath);
      res.send({ filePath, output });
    }
    
    // const output = await executeCpp(filePath);
   
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
