import { OpenAI } from "langchain/llms/openai";
import { DocloaderService } from "./docloader.service";
import { azureOpenAiConfig } from "../openAi.config";

const llm = new OpenAI(azureOpenAiConfig);

export default class LangChainService {
  async getAnswer(question: string) {
    // return llm.predict(question);
    let docloader = new DocloaderService();
    let result = await docloader.getVector();
    return await result.similaritySearch(question, 1);
  }
}
