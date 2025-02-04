import {
	Block,
	Card,
	CompactStateMessage,
	Flex,
	Label,
	Text,
} from 'fds/components';
import type { FdsPaddingSize } from 'fds/types';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import t from 'fontoxml-localization/src/t';

import aiSidebarManager from '../api/aiSidebarManager';
import type { CardState, PromptResponse } from '../types';
import AiSidebarCardToolbar from './AiSidebarCardToolbar';

type Props = {
	onRetryFinished(element: HTMLElement | null): void;
	promptResponse: PromptResponse;
};

const AiSidebarCard: FC<Props> = ({ onRetryFinished, promptResponse }) => {
	// Keeps track of the retry loading state
	const [cardState, setCardState] = useState<CardState>('idle');

	const [indexOfVisibleResponse, setIndexOfVisibleResponse] =
		useState<number>(0);

	const { visiblePrompt, visibleMessage, visibleContent } = useMemo(() => {
		const selectedHistory = promptResponse.history[indexOfVisibleResponse];

		return {
			visiblePrompt: selectedHistory.request.prompt,
			visibleMessage: selectedHistory.response.message,
			visibleContent: selectedHistory.response.generatedContent,
		};
	}, [indexOfVisibleResponse, promptResponse.history]);

	// Used for the navigator in the card's toolbar.
	const numberOfResponses = useMemo(() => {
		const lastChangedPromptId = aiSidebarManager.getLastChangedPromptId();
		const promptIdOfCard = promptResponse?.id;

		const numberOfResponses = promptResponse.history.length;

		// Do not update visible index if another card is updated.
		if (promptIdOfCard && lastChangedPromptId === promptIdOfCard) {
			// Set the latest response as visible in the card.
			setIndexOfVisibleResponse(numberOfResponses - 1);
		}

		return numberOfResponses;
	}, [promptResponse.history.length, promptResponse?.id]);

	const onNextButtonClick = useCallback(() => {
		if (indexOfVisibleResponse < numberOfResponses - 1) {
			setIndexOfVisibleResponse(indexOfVisibleResponse + 1);
		}
	}, [indexOfVisibleResponse, numberOfResponses]);

	const onPreviousButtonClick = useCallback(() => {
		if (indexOfVisibleResponse > 0) {
			setIndexOfVisibleResponse(indexOfVisibleResponse - 1);
		}
	}, [indexOfVisibleResponse]);

	const onRemoveButtonClick = useCallback(() => {
		aiSidebarManager.removePromptById(promptResponse.id);
	}, [promptResponse.id]);

	const ref = useRef<HTMLElement | null>(null);

	// Generates a new response from the AI which adds a extra response in the card.
	const onRetryButtonClick = useCallback(() => {
		setCardState('loading');

		void aiSidebarManager
			.generateResponseForExistingPrompt(promptResponse.id)
			.then(
				() => {
					setCardState('idle');
				},
				() => {
					setCardState('errored');
				}
			)
			.finally(() => {
				onRetryFinished(ref.current);
			});
	}, [onRetryFinished, promptResponse.id]);

	const isPrevButtonDisabled = useMemo(
		() => indexOfVisibleResponse === 0,
		[indexOfVisibleResponse]
	);

	const isNextButtonDisabled = useMemo(
		() => indexOfVisibleResponse === numberOfResponses - 1,
		[indexOfVisibleResponse, numberOfResponses]
	);

	const isThisCardLoading = useMemo(
		() => cardState === 'loading',
		[cardState]
	);

	const messagePadding = useMemo<FdsPaddingSize>(() => ({ left: 'l' }), []);

	return (
		// The block here prevents the Card from being squashed
		<Block flex="none" ref={ref}>
			<Card>
				<Flex spaceSize="m" flexDirection="column">
					<Label colorName="text-muted-color" isItalic>
						<Block
							applyCss={{
								borderLeft:
									'solid 2px var(--fds-color-text-muted-color)',
								margin: '8px 8px 8px 16px',
								'overflow-wrap': 'break-word',
								padding: '0 0 0 8px',
								'text-wrap': 'wrap',
							}}
						>
							{visiblePrompt}
						</Block>
					</Label>
					{isThisCardLoading && (
						<CompactStateMessage
							message={t('Generating response...')}
							visual="spinner"
						/>
					)}
					{!isThisCardLoading && visibleMessage && (
						<Flex paddingSize={messagePadding}>
							<Text>
								<i> {`"${visibleMessage}"`} </i>
							</Text>
						</Flex>
					)}
					{!isThisCardLoading && visibleContent && (
						<Text>{visibleContent}</Text>
					)}
					{!isThisCardLoading && (
						<AiSidebarCardToolbar
							nextButtonDisabled={isNextButtonDisabled}
							onNextButtonClick={onNextButtonClick}
							prevButtonDisabled={isPrevButtonDisabled}
							onPrevButtonClick={onPreviousButtonClick}
							indexOfVisibleResponse={indexOfVisibleResponse}
							numberOfResponses={numberOfResponses}
							onRetryButtonClick={onRetryButtonClick}
							contentToPaste={visibleContent}
							onRemoveButtonClick={onRemoveButtonClick}
						/>
					)}
				</Flex>
			</Card>
		</Block>
	);
};

export default AiSidebarCard;
