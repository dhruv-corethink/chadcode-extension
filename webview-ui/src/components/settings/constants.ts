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

// ChadCode models - must match backend
export const CORETHINK_MODELS: Record<string, ModelInfo> = {
	chadcode: {
		maxTokens: 16384,
		contextWindow: 128000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "ChadCode Default - Balanced performance and capability",
	},
	"chadcode-fast": {
		maxTokens: 8192,
		contextWindow: 64000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "ChadCode Fast - Optimized for speed",
	},
	"chadcode-pro": {
		maxTokens: 32768,
		contextWindow: 200000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "ChadCode Pro - Maximum capability",
	},
}

export const MODELS_BY_PROVIDER: Partial<Record<ProviderName, Record<string, ModelInfo>>> = {
	chadcode: CORETHINK_MODELS,
}

// ChadCode is the only provider
export const PROVIDERS = [
	{ value: "chadcode", label: "ChadCode" },
]
