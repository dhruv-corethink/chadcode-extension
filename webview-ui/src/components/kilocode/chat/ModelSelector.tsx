import type { ProviderSettings } from "@roo-code/types"

interface ModelSelectorProps {
	currentApiConfigName?: string
	apiConfiguration: ProviderSettings
	fallbackText: string
	virtualQuotaActiveModel?: { id: string; name: string }
}

export const ModelSelector = ({
	currentApiConfigName,
	apiConfiguration,
	fallbackText,
	virtualQuotaActiveModel,
}: ModelSelectorProps) => {
	// Always display "Corethink" - no model selection allowed
	return (
		<span className="text-xs text-vscode-descriptionForeground opacity-70 truncate">
			Corethink
		</span>
	)
}
