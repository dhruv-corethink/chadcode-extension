import {
	type ProviderName,
	type ModelInfo,
} from "@roo-code/types"

/**
 * ChadCode Extension - Provider Constants
 *
 * This extension uses ChadCode as the ONLY provider.
 * All other providers have been removed.
 */

// Corethink models - must match backend
export const CORETHINK_MODELS: Record<string, ModelInfo> = {
	corethink: {
		maxTokens: 8192,
		contextWindow: 79000,
		supportsImages: true,
		supportsPromptCache: false,
		supportsNativeTools: true,
		inputPrice: 1.0,
		outputPrice: 1.0,
		description: "Corethink - AI coding assistant powered by Corethink",
	},
}

export const MODELS_BY_PROVIDER: Partial<Record<ProviderName, Record<string, ModelInfo>>> = {
	chadcode: CORETHINK_MODELS,
}

// Corethink is the only provider
export const PROVIDERS = [
	{ value: "chadcode", label: "Corethink" },
]
