// DeployActions.tsx
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export default function DeployActions({
    selectedService,
    selectedRepo,
    appName,
    selectedPlan,
}: any) {
    const disabled =
        !selectedService || !selectedRepo || !appName || !selectedPlan

    function handleDeploy() {
        const payload = {
            service: selectedService,
            repo: selectedRepo,
            appName,
            plan: selectedPlan,
        }

        console.log("Deploy payload:", payload)
        // call API here
    }

    return (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="ghost">Cancel</Button>

            <Button size="lg" disabled={disabled} onClick={handleDeploy}>
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
            </Button>
        </div>
    )
}
