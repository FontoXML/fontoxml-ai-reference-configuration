import { Button, Flex, Toast } from 'fds/components';
import type { FC } from 'react';

import t from 'fontoxml-localization/src/t';

type Props = {
	onCancelClick(): void;
	onDeleteClick(): void;
};

const AiSidebarRemoveConfirmationForm: FC<Props> = ({
	onCancelClick,
	onDeleteClick,
}) => {
	return (
		<Flex flexDirection="column" spaceSize="m">
			<Toast
				icon="warning"
				connotation="warning"
				content={t('All chat history will be permanently deleted')}
			/>
			<Flex flexDirection="row" spaceSize="l" justifyContent="flex-end">
				<Button label={t('Cancel')} onClick={onCancelClick} />
				<Button
					type="warning"
					label={t('Delete')}
					onClick={onDeleteClick}
				/>
			</Flex>
		</Flex>
	);
};

export default AiSidebarRemoveConfirmationForm;
