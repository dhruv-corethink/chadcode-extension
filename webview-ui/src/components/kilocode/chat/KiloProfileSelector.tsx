// kilocode_change - Profile selector hidden for ChadCode
interface ApiConfigMeta {
	id: string
	name: string
}

interface KiloProfileSelectorProps {
	currentConfigId: string
	currentApiConfigName?: string
	displayName: string
	listApiConfigMeta?: ApiConfigMeta[]
	pinnedApiConfigs?: Record<string, boolean>
	togglePinnedApiConfig: (configId: string) => void
	selectApiConfigDisabled?: boolean
	initiallyOpen?: boolean
}

export const KiloProfileSelector = ({
	currentConfigId,
	currentApiConfigName,
	displayName,
	listApiConfigMeta,
	pinnedApiConfigs,
	togglePinnedApiConfig,
	selectApiConfigDisabled = false,
	initiallyOpen = false,
}: KiloProfileSelectorProps) => {
	// Hidden - ChadCode uses only Corethink
	return null
}
