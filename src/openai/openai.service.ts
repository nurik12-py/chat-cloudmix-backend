import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateCompletion(prompt: string): Promise<string> {
    const completion = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return completion.data.choices[0].message.content;
  }
}
