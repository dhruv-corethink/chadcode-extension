/**
 * ChadCode Provider Settings Component
 *
 * Settings component for ChadCode Extension.
 * Includes API key input and model selection.
 */

import React, { memo, useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui"

// ChadCode available models - must match backend
const CORETHINK_MODELS = [
	{ value: "chadcode", label: "ChadCode Default", description: "Balanced performance and capability" },
	{ value: "chadcode-fast", label: "ChadCode Fast", description: "Optimized for speed" },
	{ value: "chadcode-pro", label: "ChadCode Pro", description: "Maximum capability" },
]

interface ChadCodeProps {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: <K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => void
}

export const ChadCode = memo(({ apiConfiguration, setApiConfigurationField }: ChadCodeProps) => {
	const { t } = useAppTranslation()

	const handleApiKeyChange = useCallback(
		(e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e.target as HTMLInputElement)?.value || ""
			setApiConfigurationField("apiKey", value)
		},
		[setApiConfigurationField],
	)

	const handleModelChange = useCallback(
		(value: string) => {
			setApiConfigurationField("apiModelId", value)
		},
		[setApiConfigurationField],
	)

	const selectedModel = apiConfiguration?.apiModelId || "chadcode"

	return (
		<div className="flex flex-col gap-4">
			{/* ChadCode API Key */}
			<div className="flex flex-col gap-1">
				<VSCodeTextField
					value={apiConfiguration?.apiKey || ""}
					type="password"
					onInput={handleApiKeyChange}
					placeholder="sk_..."
					style={{ width: "100%" }}
					data-testid="chadcode-api-key"
				>
					<label className="block font-medium mb-1">ChadCode API Key</label>
				</VSCodeTextField>
				<p className="text-sm text-vscode-descriptionForeground mt-1">
					Enter your ChadCode API key. API keys start with <code>sk_</code>.
				</p>
				<p className="text-sm text-vscode-descriptionForeground">
					You can also set the <code>CORETHINK_API_KEY</code> environment variable.
				</p>
			</div>

			{/* Model Selection */}
			<div className="flex flex-col gap-1">
				<label className="block font-medium mb-1">Model</label>
				<Select value={selectedModel} onValueChange={handleModelChange}>
					<SelectTrigger className="w-full" data-testid="chadcode-model-select">
						<SelectValue placeholder="Select a model" />
					</SelectTrigger>
					<SelectContent>
						{CORETHINK_MODELS.map((model) => (
							<SelectItem key={model.value} value={model.value}>
								<div className="flex flex-col">
									<span>{model.label}</span>
									<span className="text-xs text-vscode-descriptionForeground">{model.description}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Info Box */}
			<div className="p-3 rounded bg-vscode-textBlockQuote-background border border-vscode-textBlockQuote-border">
				<p className="text-sm font-medium mb-2">ChadCode Extension</p>
				<p className="text-sm text-vscode-descriptionForeground">
					This extension uses ChadCode as the AI backend. All requests are sent to the ChadCode API.
				</p>
			</div>
		</div>
	)
})

ChadCode.displayName = "ChadCode"
