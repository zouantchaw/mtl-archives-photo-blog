import Switcher from "@/components/Switcher";
import SwitcherItem from "@/components/SwitcherItem";
import IconFullFrame from "@/site/IconFullFrame";
import IconGrid from "@/site/IconGrid";
import IconMap from "@/site/IconMap";
import IconSearch from "@/site/IconSearch";
import { PATH_ADMIN_PHOTOS, PATH_GRID, PATH_MAP } from "@/site/paths";
import { BiLockAlt } from "react-icons/bi";
import { useAppState } from "@/state";
import { AnimatePresence, motion } from "framer-motion";
import { Binoculars } from "lucide-react";
import { MapResetButton } from "@/components/MapResetButton";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type SwitcherSelection =
  | "full-frame"
  | "grid"
  | "map"
  | "sets"
  | "admin";

interface ViewSwitcherProps {
  currentSelection?: SwitcherSelection;
  showAdmin?: boolean;
}

export default function ViewSwitcher({
  currentSelection,
  showAdmin,
}: ViewSwitcherProps) {
  const { setIsCommandKOpen } = useAppState();

  const isMapRoute = currentSelection === "map";

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Switcher>
        <SwitcherItem
          icon={<IconFullFrame />}
          href="/"
          active={currentSelection === "full-frame"}
          noPadding
        />
        <SwitcherItem
          icon={<IconGrid />}
          href={PATH_GRID}
          active={currentSelection === "grid"}
          noPadding
        />
        <SwitcherItem
          icon={<IconMap />}
          href={PATH_MAP}
          active={currentSelection === "map"}
          noPadding
        />
        {showAdmin && (
          <SwitcherItem
            icon={<BiLockAlt size={16} className="translate-y-[-0.5px]" />}
            href={PATH_ADMIN_PHOTOS}
            active={currentSelection === "admin"}
          />
        )}
      </Switcher>
      <AnimatePresence>
        {isMapRoute && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="ml-1 flex"
          >
            <Switcher type="borderless">
              <Suspense fallback={<Skeleton className="w-6 h-6" />}>
                <MapResetButton />
              </Suspense>
              <SwitcherItem
                icon={
                  <div className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Binoculars size={20} className="text-gray-600" />
                  </div>
                }
                onClick={() => {
                  // TODO: Implement binoculars functionality
                  console.log("Binoculars clicked");
                }}
                noPadding
              />
            </Switcher>
          </motion.div>
        )}
      </AnimatePresence>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch />}
          onClick={() => setIsCommandKOpen?.(true)}
        />
      </Switcher>
    </div>
  );
}