/**
 * ChadCode Provider Settings Component
 *
 * Settings component for ChadCode Extension.
 * Includes API key input, model selection, and model capability configuration.
 */

import React, { memo, useCallback, useState, useEffect } from "react"
import { VSCodeTextField, VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { Checkbox } from "vscrui"

import type { ProviderSettings, ModelInfo, ReasoningEffort } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, StandardTooltip } from "@src/components/ui"
import { ThinkingBudget } from "../ThinkingBudget"

// ChadCode available models - must match backend
const CORETHINK_MODELS = [
	{ value: "corethink", label: "Corethink" },
]

// Default model info for ChadCode
const chadcodeModelInfoDefaults: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 79000,
	supportsImages: true,
	supportsPromptCache: false,
	supportsNativeTools: true,
	inputPrice: 1.0,
	outputPrice: 1.0,
}

interface ChadCodeProps {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: <K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => void
}

export const ChadCode = memo(({ apiConfiguration, setApiConfigurationField }: ChadCodeProps) => {
	const { t } = useAppTranslation()

	const [customHeaders, setCustomHeaders] = useState<[string, string][]>(() => {
		const headers = (apiConfiguration as any)?.chadcodeHeaders || {}
		return Object.entries(headers)
	})

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

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K],
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	// Custom headers handlers
	const handleAddCustomHeader = useCallback(() => {
		setCustomHeaders((prev) => [...prev, ["", ""]])
	}, [])

	const handleUpdateHeaderKey = useCallback((index: number, newKey: string) => {
		setCustomHeaders((prev) => {
			const updated = [...prev]
			if (updated[index]) {
				updated[index] = [newKey, updated[index][1]]
			}
			return updated
		})
	}, [])

	const handleUpdateHeaderValue = useCallback((index: number, newValue: string) => {
		setCustomHeaders((prev) => {
			const updated = [...prev]
			if (updated[index]) {
				updated[index] = [updated[index][0], newValue]
			}
			return updated
		})
	}, [])

	const handleRemoveCustomHeader = useCallback((index: number) => {
		setCustomHeaders((prev) => prev.filter((_, i) => i !== index))
	}, [])

	// Update headers in config when local state changes
	useEffect(() => {
		const timer = setTimeout(() => {
			const headerObject = Object.fromEntries(customHeaders.filter(([k]) => k.trim() !== ""))
			setApiConfigurationField("chadcodeHeaders" as any, headerObject)
		}, 300)
		return () => clearTimeout(timer)
	}, [customHeaders, setApiConfigurationField])

	// Always use corethink model
	useEffect(() => {
		if (apiConfiguration?.apiModelId !== "corethink") {
			setApiConfigurationField("apiModelId", "corethink")
		}
	}, [apiConfiguration?.apiModelId, setApiConfigurationField])

	const selectedModel = "corethink"
	const customModelInfo = (apiConfiguration as any)?.chadcodeCustomModelInfo || chadcodeModelInfoDefaults

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
					data-testid="chadcode-api-key">
					<label className="block font-medium mb-1">Corethink API Key</label>
				</VSCodeTextField>
				<p className="text-sm text-vscode-descriptionForeground mt-1">
					Enter your Corethink API key. API keys start with <code>sk_</code>.
				</p>
				<p className="text-sm text-vscode-descriptionForeground">
					You can also set the <code>CORETHINK_API_KEY</code> environment variable.
				</p>
			</div>

			{/* Model Selection */}
			<div className="flex flex-col gap-1">
				<label className="block font-medium mb-1">Model</label>
				<Select value={selectedModel} defaultValue="corethink" onValueChange={handleModelChange}>
					<SelectTrigger className="w-full" data-testid="chadcode-model-select">
						<SelectValue placeholder="Corethink" />
					</SelectTrigger>
					<SelectContent>
						{CORETHINK_MODELS.map((model) => (
							<SelectItem key={model.value} value={model.value}>
								{model.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Custom Headers */}
			<div className="mb-2">
				<div className="flex justify-between items-center mb-2">
					<label className="block font-medium">{t("settings:providers.customHeaders")}</label>
					<StandardTooltip content={t("settings:common.add")}>
						<VSCodeButton appearance="icon" onClick={handleAddCustomHeader}>
							<span className="codicon codicon-add"></span>
						</VSCodeButton>
					</StandardTooltip>
				</div>
				{!customHeaders.length ? (
					<div className="text-sm text-vscode-descriptionForeground">
						{t("settings:providers.noCustomHeaders")}
					</div>
				) : (
					customHeaders.map(([key, value], index) => (
						<div key={index} className="flex items-center mb-2">
							<VSCodeTextField
								value={key}
								className="flex-1 mr-2"
								placeholder={t("settings:providers.headerName")}
								onInput={(e: any) => handleUpdateHeaderKey(index, e.target.value)}
							/>
							<VSCodeTextField
								value={value}
								className="flex-1 mr-2"
								placeholder={t("settings:providers.headerValue")}
								onInput={(e: any) => handleUpdateHeaderValue(index, e.target.value)}
							/>
							<StandardTooltip content={t("settings:common.remove")}>
								<VSCodeButton appearance="icon" onClick={() => handleRemoveCustomHeader(index)}>
									<span className="codicon codicon-trash"></span>
								</VSCodeButton>
							</StandardTooltip>
						</div>
					))
				)}
			</div>

			{/* Enable Reasoning Effort */}
			<div className="flex flex-col gap-1">
				<Checkbox
					checked={(apiConfiguration as any).enableReasoningEffort ?? false}
					onChange={(checked: boolean) => {
						setApiConfigurationField("enableReasoningEffort" as any, checked)
						if (!checked) {
							const { reasoningEffort: _, ...rest } = customModelInfo
							setApiConfigurationField("chadcodeCustomModelInfo" as any, rest)
						}
					}}>
					{t("settings:providers.setReasoningLevel")}
				</Checkbox>
				{!!(apiConfiguration as any).enableReasoningEffort && (
					<ThinkingBudget
						apiConfiguration={{
							...apiConfiguration,
							reasoningEffort: customModelInfo?.reasoningEffort,
						}}
						setApiConfigurationField={(field, value) => {
							if (field === "reasoningEffort") {
								setApiConfigurationField("chadcodeCustomModelInfo" as any, {
									...customModelInfo,
									reasoningEffort: value as ReasoningEffort,
								})
							}
						}}
						modelInfo={{
							...customModelInfo,
							supportsReasoningEffort: true,
						}}
					/>
				)}
			</div>

			{/* Model Capabilities Section */}
			<div className="flex flex-col gap-3">
				<div className="text-sm text-vscode-descriptionForeground whitespace-pre-line">
					{t("settings:providers.customModel.capabilities")}
				</div>

				{/* Max Output Tokens */}
				<div>
					<VSCodeTextField
						value={customModelInfo?.maxTokens?.toString() || chadcodeModelInfoDefaults.maxTokens?.toString() || ""}
						type="text"
						style={{
							borderColor: (() => {
								const value = customModelInfo?.maxTokens
								if (!value) return "var(--vscode-input-border)"
								return value > 0 ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)"
							})(),
						}}
						onInput={(e: any) => {
							const value = parseInt(e.target.value)
							setApiConfigurationField("chadcodeCustomModelInfo" as any, {
								...customModelInfo,
								maxTokens: isNaN(value) ? undefined : value,
							})
						}}
						placeholder={t("settings:placeholders.numbers.maxTokens")}
						className="w-full">
						<label className="block font-medium mb-1">{t("settings:providers.customModel.maxTokens.label")}</label>
					</VSCodeTextField>
					<div className="text-sm text-vscode-descriptionForeground">
						{t("settings:providers.customModel.maxTokens.description")}
					</div>
				</div>

				{/* Context Window Size */}
				<div>
					<VSCodeTextField
						value={customModelInfo?.contextWindow?.toString() || chadcodeModelInfoDefaults.contextWindow?.toString() || ""}
						type="text"
						style={{
							borderColor: (() => {
								const value = customModelInfo?.contextWindow
								if (!value) return "var(--vscode-input-border)"
								return value > 0 ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)"
							})(),
						}}
						onInput={(e: any) => {
							const value = parseInt(e.target.value)
							setApiConfigurationField("chadcodeCustomModelInfo" as any, {
								...customModelInfo,
								contextWindow: isNaN(value) ? chadcodeModelInfoDefaults.contextWindow : value,
							})
						}}
						placeholder={t("settings:placeholders.numbers.contextWindow")}
						className="w-full">
						<label className="block font-medium mb-1">{t("settings:providers.customModel.contextWindow.label")}</label>
					</VSCodeTextField>
					<div className="text-sm text-vscode-descriptionForeground">
						{t("settings:providers.customModel.contextWindow.description")}
					</div>
				</div>

				{/* Image Support */}
				<div>
					<div className="flex items-center gap-1">
						<Checkbox
							checked={customModelInfo?.supportsImages ?? chadcodeModelInfoDefaults.supportsImages}
							onChange={(checked: boolean) => {
								setApiConfigurationField("chadcodeCustomModelInfo" as any, {
									...customModelInfo,
									supportsImages: checked,
								})
							}}>
							<span className="font-medium">{t("settings:providers.customModel.imageSupport.label")}</span>
						</Checkbox>
						<StandardTooltip content={t("settings:providers.customModel.imageSupport.description")}>
							<i className="codicon codicon-info text-vscode-descriptionForeground" style={{ fontSize: "12px" }} />
						</StandardTooltip>
					</div>
					<div className="text-sm text-vscode-descriptionForeground pt-1">
						{t("settings:providers.customModel.imageSupport.description")}
					</div>
				</div>

				{/* Prompt Caching */}
				<div>
					<div className="flex items-center gap-1">
						<Checkbox
							checked={customModelInfo?.supportsPromptCache ?? false}
							onChange={(checked: boolean) => {
								setApiConfigurationField("chadcodeCustomModelInfo" as any, {
									...customModelInfo,
									supportsPromptCache: checked,
								})
							}}>
							<span className="font-medium">{t("settings:providers.customModel.promptCache.label")}</span>
						</Checkbox>
						<StandardTooltip content={t("settings:providers.customModel.promptCache.description")}>
							<i className="codicon codicon-info text-vscode-descriptionForeground" style={{ fontSize: "12px" }} />
						</StandardTooltip>
					</div>
					<div className="text-sm text-vscode-descriptionForeground pt-1">
						{t("settings:providers.customModel.promptCache.description")}
					</div>
				</div>

				{/* Input Price */}
				<div>
					<VSCodeTextField
						value={customModelInfo?.inputPrice?.toString() ?? chadcodeModelInfoDefaults.inputPrice?.toString() ?? ""}
						type="text"
						style={{
							borderColor: (() => {
								const value = customModelInfo?.inputPrice
								if (!value && value !== 0) return "var(--vscode-input-border)"
								return value >= 0 ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)"
							})(),
						}}
						onChange={(e: any) => {
							const value = parseFloat(e.target.value)
							setApiConfigurationField("chadcodeCustomModelInfo" as any, {
								...customModelInfo,
								inputPrice: isNaN(value) ? chadcodeModelInfoDefaults.inputPrice : value,
							})
						}}
						placeholder={t("settings:placeholders.numbers.inputPrice")}
						className="w-full">
						<div className="flex items-center gap-1">
							<label className="block font-medium mb-1">{t("settings:providers.customModel.pricing.input.label")}</label>
							<StandardTooltip content={t("settings:providers.customModel.pricing.input.description")}>
								<i className="codicon codicon-info text-vscode-descriptionForeground" style={{ fontSize: "12px" }} />
							</StandardTooltip>
						</div>
					</VSCodeTextField>
				</div>

				{/* Output Price */}
				<div>
					<VSCodeTextField
						value={customModelInfo?.outputPrice?.toString() || chadcodeModelInfoDefaults.outputPrice?.toString() || ""}
						type="text"
						style={{
							borderColor: (() => {
								const value = customModelInfo?.outputPrice
								if (!value && value !== 0) return "var(--vscode-input-border)"
								return value >= 0 ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)"
							})(),
						}}
						onChange={(e: any) => {
							const value = parseFloat(e.target.value)
							setApiConfigurationField("chadcodeCustomModelInfo" as any, {
								...customModelInfo,
								outputPrice: isNaN(value) ? chadcodeModelInfoDefaults.outputPrice : value,
							})
						}}
						placeholder={t("settings:placeholders.numbers.outputPrice")}
						className="w-full">
						<div className="flex items-center gap-1">
							<label className="block font-medium mb-1">{t("settings:providers.customModel.pricing.output.label")}</label>
							<StandardTooltip content={t("settings:providers.customModel.pricing.output.description")}>
								<i className="codicon codicon-info text-vscode-descriptionForeground" style={{ fontSize: "12px" }} />
							</StandardTooltip>
						</div>
					</VSCodeTextField>
				</div>

				{/* Reset to Defaults Button */}
				<button
					className="px-3 py-1.5 text-sm bg-vscode-button-secondaryBackground hover:bg-vscode-button-secondaryHoverBackground text-vscode-button-secondaryForeground rounded"
					onClick={() => setApiConfigurationField("chadcodeCustomModelInfo" as any, chadcodeModelInfoDefaults)}>
					{t("settings:providers.customModel.resetDefaults")}
				</button>
			</div>

			{/* Info Box */}
			<div className="p-3 rounded bg-vscode-textBlockQuote-background border border-vscode-textBlockQuote-border">
				<p className="text-sm font-medium mb-2">Corethink Extension</p>
				<p className="text-sm text-vscode-descriptionForeground">
					This extension uses Corethink as the AI backend. All requests are sent to the Corethink API.
				</p>
			</div>
		</div>
	)
})

ChadCode.displayName = "ChadCode"
