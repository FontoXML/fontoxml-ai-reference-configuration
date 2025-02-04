import { Button, Flex, Text, VerticalSeparationLine } from 'fds/components';
import type { FdsOnClickCallback } from 'fds/types';
import type { FC } from 'react';
import { useMemo } from 'react';

import FxOperationButton from 'fontoxml-fx/src/FxOperationButton';
import useManagerState from 'fontoxml-fx/src/useManagerState';
import t from 'fontoxml-localization/src/t';

import aiSidebarManager from '../api/aiSidebarManager';

type Props = {
	nextButtonDisabled: boolean;
	onNextButtonClick: FdsOnClickCallback;
	prevButtonDisabled: boolean;
	onPrevButtonClick: FdsOnClickCallback;
	indexOfVisibleResponse: number;
	numberOfResponses: number;
	onRetryButtonClick: FdsOnClickCallback;
	contentToPaste: string;
	onRemoveButtonClick: FdsOnClickCallback;
};

const AiSidebarCardToolbar: FC<Props> = ({
	nextButtonDisabled,
	onNextButtonClick,
	prevButtonDisabled,
	onPrevButtonClick,
	indexOfVisibleResponse,
	numberOfResponses,
	onRetryButtonClick,
	contentToPaste,
	onRemoveButtonClick,
}) => {
	const hasGeneratedContent = useMemo(() => {
		return !!contentToPaste;
	}, [contentToPaste]);

	// Get sidebar loading state to disable retry buttons when a request is in progress
	const { isLoadingState } = useManagerState(
		aiSidebarManager.stateChangeNotifier,
		() => {
			const state = aiSidebarManager.getState();
			return {
				isLoadingState: state === 'loading',
			};
		}
	);

	return (
		<Flex spaceSize="s" alignItems="center" flexDirection="row">
			{numberOfResponses > 1 && (
				<>
					<Button
						type="transparent"
						icon="chevron-left"
						onClick={onPrevButtonClick}
						isDisabled={prevButtonDisabled}
						tooltipContent={t('Previous')}
					/>
					<Text colorName="text-muted-color">
						{indexOfVisibleResponse + 1} / {numberOfResponses}
					</Text>
					<Button
						type="transparent"
						icon="chevron-right"
						onClick={onNextButtonClick}
						isDisabled={nextButtonDisabled}
						tooltipContent={t('Next')}
					/>
					<VerticalSeparationLine size="calc(100% - 0.5rem)" />
				</>
			)}

			<Flex flex="1" spaceSize="s">
				<FxOperationButton
					icon="arrow-left"
					label=""
					operationData={{
						text: contentToPaste,
					}}
					operationName="insert-ai-generated-content"
					isDisabled={!hasGeneratedContent}
					type="transparent"
				/>
				<Button
					icon="repeat"
					onClick={onRetryButtonClick}
					isDisabled={isLoadingState}
					tooltipContent={t('Try again')}
					type="transparent"
				/>
				<Button
					icon="trash-can"
					onClick={onRemoveButtonClick}
					isDisabled={isLoadingState}
					tooltipContent={t('Delete chat')}
					type="transparent"
				/>
			</Flex>
		</Flex>
	);
};

export default AiSidebarCardToolbar;
