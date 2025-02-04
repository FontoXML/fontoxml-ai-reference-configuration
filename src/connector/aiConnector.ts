import connectorsManager from 'fontoxml-configuration/src/connectorsManager';
import RequestData from 'fontoxml-connector/src/RequestData';

import type { AiGenerateResponse, AiHistory } from '../types';

class AiConnector {
	/**
	 * Generates an AI response, using the POST /generate CMS endpoint.
	 *
	 * @param prompt The prompt.
	 * @param history History of all the previous prompts in this session.
	 * @param context The selection we have in the editor.
	 */
	public async generate(
		prompt: string,
		history: AiHistory[],
		context?: string
	): Promise<AiGenerateResponse> {
		const requestData = new RequestData();

		requestData.setContentType('json');
		requestData.addPostParameters({
			context: connectorsManager.getCmsClient().createContext(),
			prompt,
			contextContent: context,
			history,
		});

		const result = await connectorsManager
			.getCmsClient()
			.sendRequest('POST', `/ai-assistant/generate`, requestData)
			.then((response) => {
				return response.body as AiGenerateResponse;
			});

		return result;
	}
}

const aiConnector = new AiConnector();

export default aiConnector;
