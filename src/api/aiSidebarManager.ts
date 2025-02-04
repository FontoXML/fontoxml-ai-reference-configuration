import readOnlyBlueprint from 'fontoxml-blueprints/src/readOnlyBlueprint';
import selectionManager from 'fontoxml-selection/src/selectionManager';
import evaluateXPathToString from 'fontoxml-selectors/src/evaluateXPathToString';
import xq from 'fontoxml-selectors/src/xq';
import Notifier from 'fontoxml-utils/src/Notifier';
import generateUUID from 'fontoxml-uuid-generator/src/generateUUID';

import aiConnector from '../connector/aiConnector';
import type {
	AiHistory,
	AiHistoryWithId,
	AiSidebarState,
	PreconfiguredPrompt,
	PromptId,
	PromptResponse,
} from '../types';

class AiSidebarManager {
	/**
	 * The current state of the sidebar. Needs to be modified through the
	 * "_setState" method to ensure the "stateChangeNotifier" is called.
	 */
	private _state: AiSidebarState = 'idle';

	/**
	 * A list of preconfigured prompts which will be displayed as chips which
	 * help users to quickly get started with writing prompts.
	 */
	private _preconfiguredPrompts: PreconfiguredPrompt[] = [];

	private _lastChangedPromptId: PromptId;

	// Contains the initial send prompt and their responses (not responses of other prompts)
	// We can use this to render the front end AI cards.
	private _promptResponses: PromptResponse[] = [];

	// Contains all the send prompts + responses. We use this to communicate with
	// the backend, which requires all the history.
	private _allAiHistoryWithId: AiHistoryWithId[] = [];

	public stateChangeNotifier: Notifier = new Notifier();

	public promptResponsesChangedNotifier: Notifier = new Notifier();

	/**
	 * Sets the list of preconfigured prompts. Call this function in the
	 * install.ts file. This cannot be done dynamically, unless a notifier
	 * is added for it and the UI adapted to listen for changes to this list.
	 *
	 * @param prompts An array of preconfigured prompts to add.
	 */
	public setPreconfiguredPrompts(prompts: PreconfiguredPrompt[]): void {
		this._preconfiguredPrompts = prompts;
	}

	/**
	 * Returns the list of preconfigured prompts.
	 *
	 * @returns An array of preconfigured prompts.
	 */
	public getPreconfiguredPrompts(): PreconfiguredPrompt[] {
		return this._preconfiguredPrompts;
	}

	/**
	 * Sets the state of the sidebar. Does not do anything if the state to set
	 * is equal to the current state. Fires the stateChangeNotifier when the
	 * state changed.
	 *
	 * @param state The state to set.
	 */
	private _setState(state: AiSidebarState): void {
		if (this._state === state) {
			return;
		}

		this._state = state;
		this.stateChangeNotifier.executeCallbacks();
	}

	/**
	 * Return the current state of the sidebar. This method is used to get the
	 * current state of the sidebar when the stateChangeNotifier fires.
	 *
	 * @returns The current state of the sidebar.
	 */
	public getState(): AiSidebarState {
		return this._state;
	}

	/**
	 * Set the last changed prompt ID. This data is used to correctly update the
	 * AiSidebarCard component.
	 *
	 * @param promptId The ID of the prompt that was most recently changed.
	 */
	private _setLastChangedPromptId(promptId: PromptId): void {
		if (this._lastChangedPromptId === promptId) {
			return;
		}

		this._lastChangedPromptId = promptId;
	}

	/**
	 * Returns the ID of the last changed prompt.
	 *
	 * @returns The ID of the prompt that was most recently changed.
	 */
	public getLastChangedPromptId(): PromptId {
		return this._lastChangedPromptId;
	}

	/**
	 * Helper method to check if there are any responses. This is used to
	 * conditionally render parts of the sidebar, depending on wether there are
	 * or aren't any responses.
	 *
	 * @returns True if there are responses.
	 */
	public hasPromptResponses(): boolean {
		return this._promptResponses.length !== 0;
	}

	/**
	 * Returns a copy of all the prompt responses in reverse order.
	 *
	 * @returns A copy of all prompt responses in reverse order.
	 */
	public getResponses(): PromptResponse[] {
		return this._promptResponses.slice().reverse();
	}

	/**
	 * Internal helper method for tracking prompt responses.
	 *
	 * @param promptId The ID of the prompt.
	 * @param historyPrompt The history of the prompt to record.
	 */
	private _registerHistoryPrompt(
		promptId: PromptId,
		historyPrompt: AiHistory
	): void {
		const existingPrompt = this._promptResponses.find(
			(promptResponse) => promptResponse.id === promptId
		);

		if (existingPrompt === undefined) {
			// None found, create a new one
			const promptResponse: PromptResponse = {
				id: promptId,
				history: [historyPrompt],
			};

			this._promptResponses.push(promptResponse);
		} else {
			// Found one, add the given prompt as a retry
			existingPrompt.history.push(historyPrompt);
		}

		this._setLastChangedPromptId(promptId);
	}

	/**
	 * Helper to add the newest response for a given prompt ID to the all
	 * history array.
	 *
	 * @param promptId The prompt ID.
	 * @param aiHistory The data to add for the given prompt ID.
	 */
	private _addResponseToAllAiHistory(
		promptId: PromptId,
		aiHistory: AiHistory
	): void {
		this._allAiHistoryWithId.unshift({ id: promptId, history: aiHistory });
	}

	/**
	 * Performs the POST call to the ai-assistant/generate CMS endpoint and
	 * handles the bookkeeping of registering the response and updating states.
	 *
	 * @param id            The prompt ID for which to perform the generate call.
	 * @param writtenPrompt The prompt as written by a user.
	 * @param context       The context provided for the prompt.
	 */
	private async _generateAndRegisterPromptResponse(
		id: PromptId,
		writtenPrompt: string,
		context: string
	): Promise<void> {
		this._setState('loading');

		// We don't need the IDs for the request, just the history.
		const allAiHistoryWithoutId = this._allAiHistoryWithId.map(
			(aiHistoryWithId) => aiHistoryWithId.history
		);

		try {
			const response = await aiConnector.generate(
				writtenPrompt,
				allAiHistoryWithoutId,
				context
			);

			const history: AiHistory = {
				request: {
					prompt: writtenPrompt,
					contextContent: context,
				},
				response,
			};

			this._registerHistoryPrompt(id, history);
			this._addResponseToAllAiHistory(id, history);

			this.promptResponsesChangedNotifier.executeCallbacks();
			this._setState('idle');
		} catch (_error: unknown) {
			this._setState('errored');
		}
	}

	/**
	 * Fires a generate request for a new prompt. Will use the current selection
	 * as context for the given prompt.
	 *
	 * @param prompt The written prompt to send to the AI assistant.
	 */
	public async generateResponseForPrompt(
		writtenPrompt: string
	): Promise<void> {
		const id = generateUUID();
		const queryVariables = {
			startContainer: selectionManager.getStartContainer(),
			startOffset: selectionManager.getStartOffset(),
			endContainer: selectionManager.getEndContainer(),
			endOffset: selectionManager.getEndOffset(),
		};
		const promptContext = evaluateXPathToString(
			xq`fonto:curated-text-in-range($startContainer, $startOffset, $endContainer, $endOffset)`,
			null,
			readOnlyBlueprint,
			queryVariables
		);

		await this._generateAndRegisterPromptResponse(
			id,
			writtenPrompt,
			promptContext
		);
	}

	/**
	 * "Retries" the prompt with the given ID by sending a new generate request
	 * for that prompt. This will not update the context content or prompt.
	 *
	 * @param id The ID of the prompt to retry.
	 */
	public async generateResponseForExistingPrompt(
		id: PromptId
	): Promise<void> {
		const promptObject = this._promptResponses.find(
			(promptResponse) => promptResponse.id === id
		);

		const request = promptObject.history[0].request;
		const writtenPrompt = request.prompt;
		const promptContext = request.contextContent;

		const initialPromptResponse = this._promptResponses.find(
			(promptResponse) => promptResponse.id === id
		);
		if (!initialPromptResponse) {
			this._setState('errored');
		}

		await this._generateAndRegisterPromptResponse(
			id,
			writtenPrompt,
			promptContext
		);
	}

	/**
	 * Resets the conversation history. Returns the sidebar to its initial state.
	 */
	public resetConversation(): void {
		this._promptResponses = [];
		this._allAiHistoryWithId = [];

		this._setState('idle');

		this.promptResponsesChangedNotifier.executeCallbacks();
	}

	/**
	 * Removes the prompt with the given ID from the conversation history.
	 *
	 * @param promptId The ID of the prompt to remove.
	 */
	public removePromptById(promptId: PromptId): void {
		// Remove the initial prompt
		const promptIndex = this._promptResponses.findIndex(
			(promptResponse) => promptResponse.id === promptId
		);
		this._promptResponses.splice(promptIndex, 1);

		// Remove all history and retries for the initial prompt
		this._allAiHistoryWithId = this._allAiHistoryWithId.filter(
			(aiHistoryWithId) => promptId !== aiHistoryWithId.id
		);

		this.promptResponsesChangedNotifier.executeCallbacks();
	}
}

export default new AiSidebarManager();
