import { Chip, ChipGroup } from 'fds/components';
import type { FC } from 'react';

import aiSidebarManager from '../api/aiSidebarManager';

type Props = {
	onChipClick(string): void;
	isDisabled?: boolean;
};

const AiSidebarPromptChips: FC<Props> = ({
	onChipClick,
	isDisabled = false,
}) => {
	const preconfiguredPrompts = aiSidebarManager.getPreconfiguredPrompts();

	return (
		<ChipGroup>
			{preconfiguredPrompts.map((prompt, index) => {
				return (
					<Chip
						key={index}
						label={prompt.label}
						onClick={() => {
							onChipClick(prompt.prompt);
						}}
						isDisabled={isDisabled}
					/>
				);
			})}
		</ChipGroup>
	);
};

export default AiSidebarPromptChips;
