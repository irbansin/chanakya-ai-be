import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import LangChainService from "./services/langchain.service";
import questions from "./db/questions.json";
import answers from "./db/answers.json";
import fs from "fs";
import cors from "cors";

//For env File
dotenv.config();

const langchain = new LangChainService();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Chanakya");
});

app.get("/questions", (req: Request, res: Response) => {
  res.send(questions);
});

app.get("/answers", (req: Request, res: Response) => {
  res.send(answers);
});

app.post("/ask-question", async (req: Request, res: Response) => {
  await langchain.getAnswer(req.body.question).then((result) => {
    let question = { question: req.body.question };
    updateQuestionsJson(question);

    let answer = { answer: JSON.stringify(result) };
    updateAnswersJson(answer);

    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

function updateQuestionsJson(que: { question: string }) {
  let allQuestions: Array<{ question: string }> = [...questions];
  allQuestions.push(que);
  let json = JSON.stringify(allQuestions);

  fs.writeFile("./db/questions.json", json, "utf8", (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote Questions file");
    }
  });
  console.log(JSON.stringify(questions));
}

function updateAnswersJson(que: { answer: string }) {
  let allanswers: Array<{ answer: string }> = [...answers];
  allanswers.push(que);
  let json = JSON.stringify(allanswers);

  fs.writeFile("./db/answers.json", json, "utf8", (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote Answers file");
    }
  });
  console.log(JSON.stringify(answers));
}
