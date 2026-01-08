import {
	type ProviderName,
	type ModelInfo,
} from "@roo-code/types"

/**
 * CoreThink Extension - Provider Constants
 *
 * This extension uses CoreThink as the ONLY provider.
 * All other providers have been removed.
 */

// CoreThink models - must match backend
export const CORETHINK_MODELS: Record<string, ModelInfo> = {
	corethink: {
		maxTokens: 16384,
		contextWindow: 128000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "CoreThink Default - Balanced performance and capability",
	},
	"corethink-fast": {
		maxTokens: 8192,
		contextWindow: 64000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "CoreThink Fast - Optimized for speed",
	},
	"corethink-pro": {
		maxTokens: 32768,
		contextWindow: 200000,
		supportsImages: true,
		supportsPromptCache: false,
		description: "CoreThink Pro - Maximum capability",
	},
}

export const MODELS_BY_PROVIDER: Partial<Record<ProviderName, Record<string, ModelInfo>>> = {
	corethink: CORETHINK_MODELS,
}

// CoreThink is the only provider
export const PROVIDERS = [
	{ value: "corethink", label: "CoreThink" },
]
