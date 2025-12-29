import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentEmployerDetails } from "../server/employers.queries";

const ProfileCompletion = async () => {
  const currentUserStatus = await getCurrentEmployerDetails();

  if (currentUserStatus?.status) return null;
  return (
    <div className="flex flex-col gap-6">
      <Item variant="destructive">
        <ItemMedia variant="icon" className="bg-destructive">
          <ShieldAlertIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Incomplete Profile</ItemTitle>
          <ItemDescription className="text-white/80">
            You haven't completed your employer profile yet. Please complete
            your profile to post jobs and access all features.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="destructive" asChild>
            <Link href="/employer-dashboard/settings">Complete Profile</Link>
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
};

export default ProfileCompletion;
