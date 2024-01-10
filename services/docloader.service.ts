import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { azureOpenAiConfig, openAiConfig } from "../openAi.config";
import textsplitter from "langchain/dist/text_splitter";

const loader = new DirectoryLoader("repository", {
  ".json": (path) => new JSONLoader(path, "/texts"),
  ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path, "text"),
  ".pdf": (path) => new PDFLoader(path),
});

export class DocloaderService {
  async getVector() {
    let docs = await loader.load();

    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(azureOpenAiConfig)
    );
    // const vectorStore = await MemoryVectorStore.fromDocuments(
    //   docs,
    //   new OpenAIEmbeddings(azureOpenAiConfig)
    // );
    return vectorStore;
  }
}
