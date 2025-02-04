import type { OverrideRange } from 'fontoxml-base-flow/src/types';
import getNodeId from 'fontoxml-dom-identification/src/getNodeId';
import registerEditorSidebarTab from 'fontoxml-editor/src/registerEditorSidebarTab';
import t from 'fontoxml-localization/src/t';
import addTransform from 'fontoxml-operations/src/addTransform';
import selectionManager from 'fontoxml-selection/src/selectionManager';

import aiSidebarManager from './api/aiSidebarManager';
import AiSidebar from './ui/AiSidebar';

export default function install(): void {
	registerEditorSidebarTab({
		id: 'ai-reference-sidebar',
		icon: 'wand-magic-sparkles',
		label: t('Assistant'),
		size: 'l',
		tooltipContent: t('Write content with the help of AI'),
		Component: AiSidebar,
		priority: 10,
	});

	aiSidebarManager.setPreconfiguredPrompts([
		{ label: t('Summarize'), prompt: t('Summarize the selected content') },
		{ label: t('Elaborate'), prompt: t('Elaborate the selected content') },
		{ label: t('Improve'), prompt: t('Improve the selected content') },
		{ label: t('Simplify'), prompt: t('Simplify the selected content') },
	]);

	addTransform('setOverrideRangeToSelection', (stepData) => {
		const startContainer = selectionManager.getStartContainer();
		const startOffset = selectionManager.getStartOffset();
		const endContainer = selectionManager.getEndContainer();
		const endOffset = selectionManager.getEndOffset();

		if (startContainer === null || endContainer === null) {
			return stepData;
		}

		stepData.overrideRange = {
			startContainerNodeId: getNodeId(startContainer),
			startOffset,
			endContainerNodeId: getNodeId(endContainer),
			endOffset,
			selectionIsBackwards: false,
		} as OverrideRange;

		return stepData;
	});
}
