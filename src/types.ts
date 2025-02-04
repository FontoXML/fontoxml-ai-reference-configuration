/**
 * A preconfigured prompt. The label is shown in the chips and dropdown menu.
 * The prompt is what ends up in the prompt text input.
 */
export type PreconfiguredPrompt = {
	label: string;
	prompt: string;
};

/**
 * Reflects the state of the sidebar. "Idle" is its initial and default state.
 * "Loading" is used from sending a request and receiving a response. "Error" is
 * used when an error occurred while generating a response.
 */
export type AiSidebarState = 'errored' | 'idle' | 'loading';

/**
 * The responses that can be returned by the AI backend.
 *
 * Note: The case in which both "generatedContent" and "message" are null is not
 * supported.
 */
export type AiGenerateResponse =
	| { generatedContent: null; message: string }
	| { generatedContent: string; message: null }
	| { generatedContent: string; message: string };

/**
 * The data associated to and stored for all prompts.
 */
type AiGenerateRequestData = {
	prompt: string;
	contextContent?: string;
};

/**
 * The ID of a prompt.
 */
export type PromptId = string;

/**
 * A single prompt, reflected by a single card in the sidebar. The "history"
 * property is a list of requests and responses. These are kept to allow users
 * to browse through all retries.
 */
export type PromptResponse = {
	id: PromptId;
	history: AiHistory[];
};

/**
 * A single pair of request and response information.
 */
export type AiHistory = {
	request: AiGenerateRequestData;
	response: AiGenerateResponse;
};

/**
 * A wrapper type to associate an ID with a prompt's history. This data
 * structure is used to simplify communication with the AI backend.
 */
export type AiHistoryWithId = {
	id: PromptId;
	history: AiHistory;
};

/**
 * The state of a card, used to reflect its state while and after retrying the
 * prompt.
 */
export type CardState = 'errored' | 'idle' | 'loading';
