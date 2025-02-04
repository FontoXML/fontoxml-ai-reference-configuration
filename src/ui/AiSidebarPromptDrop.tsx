import { ButtonWithDrop, Drop, Menu, MenuItem } from 'fds/components';
import type { FC } from 'react';

import t from 'fontoxml-localization/src/t';

import aiSidebarManager from '../api/aiSidebarManager';

type Props = {
	onItemClick(string): void;
	isDisabled?: boolean;
};

const AiSidebarPromptDrop: FC<Props> = ({
	onItemClick,
	isDisabled = false,
}) => {
	const preconfiguredPrompts = aiSidebarManager.getPreconfiguredPrompts();

	return (
		<ButtonWithDrop
			label={t('Prompt ideas')}
			isDisabled={isDisabled}
			tooltipContent={t(
				'Choose from suggested ideas to generate content'
			)}
			renderDrop={() => (
				<Drop>
					<Menu>
						{preconfiguredPrompts.map((prompt, index) => (
							<MenuItem
								key={index}
								label={prompt.label}
								onClick={() => {
									onItemClick(prompt.prompt);
								}}
							/>
						))}
					</Menu>
				</Drop>
			)}
		/>
	);
};

export default AiSidebarPromptDrop;
