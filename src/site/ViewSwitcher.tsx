import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import IconFullFrame from '@/site/IconFullFrame';
import IconGrid from '@/site/IconGrid';
import { PATH_ADMIN_PHOTOS, PATH_GRID, PATH_MAP } from '@/site/paths';
import { BiLockAlt } from 'react-icons/bi';
import { useAppState } from '@/state';
import IconSearch from './IconSearch';
import { TbMap } from 'react-icons/tb';
import IconMap from './IconMap';

export type SwitcherSelection = 'full-frame' | 'grid' | 'map' | 'sets' | 'admin';

export default function ViewSwitcher({
  currentSelection,
  showAdmin,
}: {
  currentSelection?: SwitcherSelection
  showAdmin?: boolean
}) {
  const { setIsCommandKOpen } = useAppState();

  return (
    <div className="flex gap-1 sm:gap-2">
      <Switcher>
        <SwitcherItem
          icon={<IconFullFrame />}
          href="/"
          active={currentSelection === 'full-frame'}
          noPadding
        />
        <SwitcherItem
          icon={<IconGrid />}
          href={PATH_GRID}
          active={currentSelection === 'grid'}
          noPadding
        />
        <SwitcherItem
          icon={<IconMap />}
          href={PATH_MAP}
          active={currentSelection === 'map'}
          noPadding
        />
        {showAdmin &&
          <SwitcherItem
            icon={<BiLockAlt size={16} className="translate-y-[-0.5px]" />}
            href={PATH_ADMIN_PHOTOS}
            active={currentSelection === 'admin'}
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch />}
          onClick={() => setIsCommandKOpen?.(true)}
        />
      </Switcher>
    </div>
  );
}
