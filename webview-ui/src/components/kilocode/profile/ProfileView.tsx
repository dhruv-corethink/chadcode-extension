import React from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { Tab, TabContent, TabHeader } from "@src/components/common/Tab"
import { Button } from "@src/components/ui"
import { ButtonPrimary } from "../common/ButtonPrimary"
import Logo from "../common/Logo"

interface ProfileViewProps {
	onDone: () => void
}

/**
 * ChadCode Extension - Profile View
 *
 * Simplified profile view for API key authentication.
 * Shows API key status and links to settings.
 */
const ProfileView: React.FC<ProfileViewProps> = ({ onDone }) => {
	const { apiConfiguration } = useExtensionState()

	const hasApiKey = apiConfiguration?.apiKey && apiConfiguration.apiKey.startsWith("sk_")

	const handleGoToSettings = () => {
		window.postMessage({
			type: "action",
			action: "settingsButtonClicked",
		}, "*")
	}

	return (
		<Tab>
			<TabHeader className="flex justify-between items-center">
				<h3 className="text-vscode-foreground m-0">Profile</h3>
				<Button onClick={onDone}>Done</Button>
			</TabHeader>
			<TabContent>
				<div className="h-full flex flex-col items-center justify-center p-6">
					<Logo />

					<h2 className="m-0 p-0 mb-4">ChadCode</h2>

					{hasApiKey ? (
						<>
							<div className="flex items-center gap-2 mb-4">
								<span className="codicon codicon-check text-green-500"></span>
								<span className="text-green-500">API Key Configured</span>
							</div>
							<p className="text-center text-vscode-descriptionForeground mb-4">
								Your ChadCode API key is set and ready to use.
							</p>
						</>
					) : (
						<>
							<div className="flex items-center gap-2 mb-4">
								<span className="codicon codicon-warning text-yellow-500"></span>
								<span className="text-yellow-500">No API Key</span>
							</div>
							<p className="text-center text-vscode-descriptionForeground mb-4">
								Enter your ChadCode API key in the settings to get started.
							</p>
						</>
					)}

					<div className="w-full max-w-xs">
						<ButtonPrimary onClick={handleGoToSettings}>
							{hasApiKey ? "Manage API Key" : "Enter API Key"}
						</ButtonPrimary>
					</div>
				</div>
			</TabContent>
		</Tab>
	)
}

export default ProfileView
