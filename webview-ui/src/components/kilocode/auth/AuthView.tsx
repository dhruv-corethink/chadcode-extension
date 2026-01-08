import { useEffect } from "react"
import { Tab, TabContent } from "../../common/Tab"

interface AuthViewProps {
	returnTo?: "chat" | "settings"
	profileName?: string
}

/**
 * CoreThink Extension - Auth View
 *
 * This view is no longer needed for API key authentication.
 * It automatically redirects to settings.
 */
const AuthView: React.FC<AuthViewProps> = ({ returnTo = "settings" }) => {
	// Redirect to settings immediately since we use API key auth
	useEffect(() => {
		window.postMessage({
			type: "action",
			action: "settingsButtonClicked",
		}, "*")
	}, [returnTo])

	return (
		<Tab>
			<TabContent className="flex flex-col items-center justify-center min-h-screen p-6">
				<p className="text-vscode-descriptionForeground">
					Redirecting to settings...
				</p>
			</TabContent>
		</Tab>
	)
}

export default AuthView
