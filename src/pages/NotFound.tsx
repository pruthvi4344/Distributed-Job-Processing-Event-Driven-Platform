import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="The page you're looking for doesn't exist or was moved."
      action={
        <Link to="/">
          <Button variant="primary">Back to overview</Button>
        </Link>
      }
      className="py-32"
    />
  );
}
