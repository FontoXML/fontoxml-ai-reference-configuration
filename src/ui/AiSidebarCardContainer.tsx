import { Flex } from 'fds/components';
import type { FC } from 'react';
import { useCallback, useRef, useState } from 'react';

import useManagerState from 'fontoxml-fx/src/useManagerState';

import aiSidebarManager from '../api/aiSidebarManager';
import AiSidebarCard from './AiSidebarCard';

const AiSidebarCardContainer: FC = () => {
	const [numberOfResponses, setNumberOfResponses] = useState<number>(0);

	const ref = useRef<HTMLElement | null>(null);

	const scrollToTop = useCallback(() => {
		if (ref && ref.current) {
			ref.current.scrollTo(0, 0);
		}
	}, [ref]);

	const promptResponses = useManagerState(
		aiSidebarManager.promptResponsesChangedNotifier,
		() => {
			const responses = aiSidebarManager.getResponses();

			// Scroll the new response into view, if any
			if (responses.length > numberOfResponses) {
				scrollToTop();
			}

			setNumberOfResponses(responses.length);
			return responses;
		}
	);

	const handleRetryFinished = useCallback((element: HTMLElement) => {
		if (element === null) {
			return;
		}
		element.scrollIntoView();
	}, []);

	return (
		<Flex
			flex="1"
			flexDirection="column"
			isScrollContainer={true}
			ref={ref}
			spaceSize="l"
		>
			{promptResponses.map((promptResponse) => {
				return (
					<AiSidebarCard
						key={promptResponse.id}
						promptResponse={promptResponse}
						onRetryFinished={handleRetryFinished}
					/>
				);
			})}
		</Flex>
	);
};

export default AiSidebarCardContainer;
