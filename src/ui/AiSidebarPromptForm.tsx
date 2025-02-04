import { Button, Flex, Form, TextInput, Toast } from 'fds/components';
import type { FdsOnKeyDownCallback } from 'fds/types';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import useManagerState from 'fontoxml-fx/src/useManagerState';
import t from 'fontoxml-localization/src/t';

import aiSidebarManager from '../api/aiSidebarManager';
import AiSidebarOnboarding from './AiSidebarOnboarding';
import AiSidebarPromptDrop from './AiSidebarPromptDrop';

type Props = {
	showOnboarding: boolean;
};

const AiSidebarPromptForm: FC<Props> = ({ showOnboarding }) => {
	const [promptInputValue, setPromptInputValue] = useState('');

	const isGenerateButtonDisabled = useMemo(
		() => promptInputValue.length === 0,
		[promptInputValue]
	);

	const { isLoadingState, isErroredState } = useManagerState(
		aiSidebarManager.stateChangeNotifier,
		() => {
			const state = aiSidebarManager.getState();
			return {
				isLoadingState: state === 'loading',
				isErroredState: state === 'errored',
			};
		}
	);

	const onSubmit = useCallback(() => {
		if (isLoadingState) {
			return;
		}
		void aiSidebarManager.generateResponseForPrompt(promptInputValue);

		setPromptInputValue('');
	}, [isLoadingState, promptInputValue]);

	const onPromptInputKeydown = useCallback<FdsOnKeyDownCallback>(
		(event) => {
			if (isLoadingState || isGenerateButtonDisabled) {
				return;
			}

			if (event.key === 'Enter') {
				onSubmit();
			}
		},
		[isGenerateButtonDisabled, isLoadingState, onSubmit]
	);

	const inputRef = useRef(null);

	const onPreconfiguredPromptClick = useCallback(
		(value) => {
			if (isLoadingState) {
				return;
			}

			setPromptInputValue(value);

			setTimeout(() => {
				if (inputRef === null) {
					return;
				}

				if (inputRef.current === undefined) {
					return;
				}

				// Wait a few miliseconds till the drop is closed and then focus the input
				inputRef.current.focus();
			}, 50);
		},
		[isLoadingState, setPromptInputValue, inputRef]
	);

	return (
		<Flex flexDirection="column" spaceSize="l">
			{showOnboarding && (
				<AiSidebarOnboarding
					onChipClick={onPreconfiguredPromptClick}
					isDisabled={isLoadingState}
				/>
			)}
			{isErroredState && (
				<Toast
					icon="fas fa-times-square"
					connotation="error"
					content={t(
						'Something went wrong, please try again at a later moment!'
					)}
				/>
			)}
			<Form>
				<TextInput
					placeholder={t(
						'Ask AI anything or choose from prompt ideas…'
					)}
					value={promptInputValue}
					onChange={setPromptInputValue}
					onKeyDown={onPromptInputKeydown}
					tooltipContent={t('Type your query here')}
					ref={inputRef}
					isDisabled={isLoadingState}
				/>
			</Form>
			<Flex
				flexDirection="row"
				spaceSize="l"
				justifyContent="space-between"
			>
				{!showOnboarding && (
					<AiSidebarPromptDrop
						onItemClick={onPreconfiguredPromptClick}
						isDisabled={isLoadingState}
					/>
				)}

				<Button
					type="primary"
					label={isLoadingState ? t('Generating...') : t('Generate')}
					icon={isLoadingState ? 'spinner' : ''}
					isDisabled={
						isLoadingState ? false : isGenerateButtonDisabled
					}
					isSelected={isLoadingState}
					onClick={onSubmit}
					tooltipContent={
						isLoadingState ? null : t('Generate content')
					}
				/>
			</Flex>
		</Flex>
	);
};

export default AiSidebarPromptForm;
