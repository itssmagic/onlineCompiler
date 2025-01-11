const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./excecuteCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { generateInputFile } = require("./generateInputFile");
const app = express();


//middlware
app.use(cors({origin:["https://online-compiler-frotend-git-main-itssmagics-projects.vercel.app/",
  "https://online-compiler-frotend.vercel.app/",
  "https://online-compiler-frotend-jkl2229dm-itssmagics-projects.vercel.app/",
  "http://localhost:5173/"
]}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  // https://compiler-backend.codingmindset.tech
  return res.send("Welcome to CodeZen Compiler");
});

app.post("/run", async (req, res) => {
  const { language = "cpp",input, code } = req?.body;
  if (code === undefined) {
    return res.status(500).json({ success: "false", message: "Empty code body" });
  }
  
  try {
    const filePath = await generateFile(language, code);

    //for loop
    const inputPath = await generateInputFile(input);
    if(language == "py")
    {
      const output = await executePy(filePath, inputPath);
      return res.send({ filePath,inputPath, output });
    }
    else if(language == "cpp")
    {
      const output = await executeCpp(filePath, inputPath);
      return res.send({  output });
    }
    else if(language == "java")
    {
      const output = await executeJava(filePath, inputPath);
      return res.send({ filePath,inputPath, output });
    }
    
    // const output = await executeCpp(filePath);
   
  } catch (error) {
    console.log("error",error);
    return res.status(500).json({ error: error });
  }
});

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
