import { Button, Flex, SidebarHeader } from 'fds/components';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import useManagerState from 'fontoxml-fx/src/useManagerState';
import t from 'fontoxml-localization/src/t';

import aiSidebarManager from '../api/aiSidebarManager';
import AiSidebarCardContainer from './AiSidebarCardContainer';
import AiSidebarPromptForm from './AiSidebarPromptForm';
import AiSidebarRemoveConfirmationForm from './AiSidebarRemoveConfirmationForm';

const AiSidebar: FC = () => {
	const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
		useState<boolean>(false);

	const onResetButtonClick = useCallback(() => {
		setIsWaitingForConfirmation(true);
	}, []);

	const shouldShowCards = useManagerState(
		aiSidebarManager.promptResponsesChangedNotifier,
		() => {
			return aiSidebarManager.hasPromptResponses();
		}
	);

	const onCancelClick = useCallback(() => {
		setIsWaitingForConfirmation(false);
	}, [setIsWaitingForConfirmation]);

	const onDeleteClick = useCallback(() => {
		setIsWaitingForConfirmation(false);

		aiSidebarManager.resetConversation();
	}, [setIsWaitingForConfirmation]);

	return (
		<Flex flex="1" flexDirection="column" spaceSize="m">
			<SidebarHeader
				title={t('AI writing assistant')}
				button={
					shouldShowCards ? (
						<Button
							type="transparent"
							icon="trash-can"
							onClick={onResetButtonClick}
							tooltipContent={t('Delete all chat history')}
							isSelected={isWaitingForConfirmation}
						/>
					) : undefined
				}
			/>

			{isWaitingForConfirmation && (
				<AiSidebarRemoveConfirmationForm
					onCancelClick={onCancelClick}
					onDeleteClick={onDeleteClick}
				/>
			)}
			<AiSidebarPromptForm showOnboarding={!shouldShowCards} />
			{shouldShowCards && <AiSidebarCardContainer />}
		</Flex>
	);
};

export default AiSidebar;
