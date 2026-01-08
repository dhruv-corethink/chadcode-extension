import { useCallback, useState, useEffect, useRef } from "react"
import { useExtensionState } from "../../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../../utils/validate"
import { vscode } from "../../../utils/vscode"
import { Tab, TabContent } from "../../common/Tab"
import { useAppTranslation } from "../../../i18n/TranslationContext"
import { ButtonPrimary } from "../common/ButtonPrimary"
import ApiOptions from "../../settings/ApiOptions"

/**
 * ChadCode Extension - Welcome View
 *
 * Simplified welcome view with only API key authentication.
 * No OAuth or device auth flow - just enter your API key and start.
 */
const WelcomeView = () => {
	const {
		apiConfiguration,
		currentApiConfigName,
		setApiConfiguration,
		uriScheme,
	} = useExtensionState()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()
	const { t } = useAppTranslation()
	const pendingActivation = useRef<string | null | undefined>(null)

	// Listen for state updates to activate profile after save completes
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			// When we receive a state update and have a pending activation, activate the profile
			if (message.type === "state" && pendingActivation.current) {
				const profileToActivate = pendingActivation.current
				pendingActivation.current = null
				// Activate the profile now that it's been saved
				vscode.postMessage({ type: "loadApiConfiguration", text: profileToActivate })
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	const handleSubmit = useCallback(() => {
		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		// Mark that we want to activate this profile after save completes
		pendingActivation.current = currentApiConfigName
		// Save the configuration - activation will happen when state update is received
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	// Check if API key is configured
	const hasApiKey = apiConfiguration?.apiKey && apiConfiguration.apiKey.startsWith("sk_")

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				{/* ChadCode Welcome Header */}
				<div className="text-center mb-4">
					<h2 className="text-xl font-bold mb-2">Welcome to ChadCode</h2>
					<p className="text-vscode-descriptionForeground">
						Enter your ChadCode API key to get started.
					</p>
				</div>

				{/* API Configuration */}
				<ApiOptions
					fromWelcomeView
					apiConfiguration={apiConfiguration || {}}
					uriScheme={uriScheme}
					setApiConfigurationField={(field, value) => setApiConfiguration({ [field]: value })}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
					hideChadCodeButton
				/>

				{/* Start Button - only enabled when API key is set */}
				<ButtonPrimary onClick={handleSubmit} disabled={!hasApiKey}>
					{hasApiKey ? t("welcome:start") : "Enter API Key to Start"}
				</ButtonPrimary>
			</TabContent>
		</Tab>
	)
}

export default WelcomeView
