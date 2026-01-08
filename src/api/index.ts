import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"

import type { ProviderSettings, ModelInfo, ToolProtocol } from "@roo-code/types"

import { ApiStream } from "./transform/stream"

// ChadCode: Import only ChadCodeHandler - all other providers are disabled
import { ChadCodeHandler, isChadCodeMode, getChadCodeApiKey } from "./providers/chadcode"

// Legacy provider imports - kept for reference but not used
// import {
// 	GlamaHandler, AnthropicHandler, AwsBedrockHandler, CerebrasHandler,
// 	OpenRouterHandler, VertexHandler, AnthropicVertexHandler, OpenAiHandler,
// 	LmStudioHandler, GeminiHandler, OpenAiNativeHandler, DeepSeekHandler,
// 	MoonshotHandler, NanoGptHandler, MistralHandler, VsCodeLmHandler,
// 	UnboundHandler, RequestyHandler, HumanRelayHandler, FakeAIHandler,
// 	XAIHandler, GroqHandler, HuggingFaceHandler, ChutesHandler, LiteLLMHandler,
// 	VirtualQuotaFallbackHandler, GeminiCliHandler, SyntheticHandler,
// 	OVHcloudAIEndpointsHandler, SapAiCoreHandler, ClaudeCodeHandler,
// 	QwenCodeHandler, SambaNovaHandler, IOIntelligenceHandler, DoubaoHandler,
// 	ZAiHandler, FireworksHandler, RooHandler, FeatherlessHandler,
// 	VercelAiGatewayHandler, DeepInfraHandler, MiniMaxHandler, BasetenHandler,
// } from "./providers"
// import { KilocodeOpenrouterHandler } from "./providers/kilocode-openrouter"
// import { InceptionLabsHandler } from "./providers/inception"
// import { NativeOllamaHandler } from "./providers/native-ollama"

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export interface ApiHandlerCreateMessageMetadata {
	/**
	 * Task ID used for tracking and provider-specific features:
	 * - DeepInfra: Used as prompt_cache_key for caching
	 * - Roo: Sent as X-Roo-Task-ID header
	 * - Requesty: Sent as trace_id
	 * - Unbound: Sent in unbound_metadata
	 */
	taskId: string
	/**
	 * Current mode slug for provider-specific tracking:
	 * - Requesty: Sent in extra metadata
	 * - Unbound: Sent in unbound_metadata
	 */
	mode?: string
	suppressPreviousResponseId?: boolean
	/**
	 * Controls whether the response should be stored for 30 days in OpenAI's Responses API.
	 * When true (default), responses are stored and can be referenced in future requests
	 * using the previous_response_id for efficient conversation continuity.
	 * Set to false to opt out of response storage for privacy or compliance reasons.
	 * @default true
	 */
	store?: boolean
	// kilocode_change start
	/**
	 * ChadCode-specific: The project ID for the current workspace (derived from git origin remote).
	 * Used by ChadCodeOpenrouterHandler for backend tracking. Ignored by other providers.
	 * @kilocode-only
	 */
	projectId?: string
	// kilocode_change end
	/**
	 * Optional array of tool definitions to pass to the model.
	 * For OpenAI-compatible providers, these are ChatCompletionTool definitions.
	 */
	tools?: OpenAI.Chat.ChatCompletionTool[]
	/**
	 * Controls which (if any) tool is called by the model.
	 * Can be "none", "auto", "required", or a specific tool choice.
	 */
	tool_choice?: OpenAI.Chat.ChatCompletionCreateParams["tool_choice"]
	/**
	 * The tool protocol being used (XML or Native).
	 * Used by providers to determine whether to include native tool definitions.
	 */
	toolProtocol?: ToolProtocol
	/**
	 * Controls whether the model can return multiple tool calls in a single response.
	 * When true, parallel tool calls are enabled (OpenAI's parallel_tool_calls=true).
	 * When false (default), only one tool call is returned per response.
	 * Only applies when toolProtocol is "native".
	 */
	parallelToolCalls?: boolean
}

export interface ApiHandler {
	createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
		metadata?: ApiHandlerCreateMessageMetadata,
	): ApiStream

	getModel(): { id: string; info: ModelInfo }

	/**
	 * Counts tokens for content blocks
	 * All providers extend BaseProvider which provides a default tiktoken implementation,
	 * but they can override this to use their native token counting endpoints
	 *
	 * @param content The content to count tokens for
	 * @returns A promise resolving to the token count
	 */
	countTokens(content: Array<Anthropic.Messages.ContentBlockParam>): Promise<number>

	contextWindow?: number // kilocode_change: Add contextWindow property for virtual quota fallback
}

/**
 * Build API handler - ChadCode Extension
 *
 * This extension uses ChadCode as the ONLY AI provider.
 * All other providers have been disabled.
 *
 * Configuration is done via environment variable: CORETHINK_API_KEY
 */
export function buildApiHandler(configuration: ProviderSettings): ApiHandler {
	const { apiProvider, ...options } = configuration

	// Get API key from environment or options
	const apiKey = getChadCodeApiKey() || options.apiKey

	if (!apiKey) {
		console.warn(
			"[ChadCode] CORETHINK_API_KEY environment variable not set. " +
				"Please set it to your ChadCode API key (should start with 'sk_').",
		)
	}

	// Always return ChadCodeHandler - this is the only provider in ChadCode Extension
	// ChadCode uses OpenAI-compatible base URL, fallback to env var or default
	const apiBaseUrl = process.env.CORETHINK_API_URL || options.openAiBaseUrl

	return new ChadCodeHandler({
		apiKey,
		apiBaseUrl,
		apiModelId: options.apiModelId || "chadcode",
	})
}
