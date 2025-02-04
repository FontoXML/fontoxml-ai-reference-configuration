import { Flex, Text } from 'fds/components';
import { applyCss } from 'fds/system';
import type { FC } from 'react';

import t from 'fontoxml-localization/src/t';

import AiSidebarPromptChips from './AiSidebarPromptChips';

const selectionCss = applyCss({
	backgroundColor: 'var(--fds-color-selection)',
});

type Props = {
	onChipClick(string): void;
	isDisabled?: boolean;
};

const AiSidebarOnboarding: FC<Props> = ({
	onChipClick,
	isDisabled = false,
}) => {
	return (
		<Flex flexDirection="column" spaceSize="m">
			<Text>
				{t('To get started, make a ')}
				<span {...selectionCss}>{t('selection')}</span>
				{t(' and choose a prompt or write your own.')}
			</Text>
			<AiSidebarPromptChips
				onChipClick={onChipClick}
				isDisabled={isDisabled}
			/>
		</Flex>
	);
};

export default AiSidebarOnboarding;
