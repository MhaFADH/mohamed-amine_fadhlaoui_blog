import Alert from "@/web/components/ui/Alert"
import Link from "@/web/components/ui/Link"

const Success = ({ successMessage, redirectionMessage, redirection }) => (
  <div className="flex flex-col gap-4">
    <Alert>{successMessage}</Alert>
    <p>
      <Link href={redirection}>{redirectionMessage}</Link>
    </p>
  </div>
)

export default Success
