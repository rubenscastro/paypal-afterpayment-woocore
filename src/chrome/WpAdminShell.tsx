/**
 * The WordPress admin chrome — top bar + sidebar — wrapped around the merchant
 * track's wp-admin screens. Ported from the payments-settings base
 * (`styles.css` owns the visuals); the sidebar's WooCommerce submenu matches the
 * Figma merchant screens (Home · Orders · Customers · Reports · Settings ·
 * Status · Extensions), and the active submenu item is caller-controlled so the
 * Home tasklist highlights "Home" while the payment screens highlight "Settings".
 */
import type { ReactNode } from 'react';
import { Icon } from '@wordpress/ui';
import { home, plus, update, wordpress } from '@wordpress/icons';
import {
  DashboardIcon, PostsIcon, MediaIcon, PagesIcon, CommentsIcon,
  WooCommerceIcon, ProductsIcon, AnalyticsIcon, MarketingIcon,
  AppearanceIcon, PluginsIcon, UsersIcon,
  ToolsIcon, SettingsIcon, CollapseIcon,
} from '../SidebarIcons';

type WooSubItem = 'Home' | 'Orders' | 'Customers' | 'Reports' | 'Settings' | 'Status' | 'Extensions';

const WOO_SUBITEMS: WooSubItem[] = [
  'Home', 'Orders', 'Customers', 'Reports', 'Settings', 'Status', 'Extensions',
];

function NavItem( {
  icon, label, active = false, badge, small = false, children,
}: {
  icon?: React.ReactElement;
  label: string;
  active?: boolean;
  badge?: number;
  small?: boolean;
  children?: ReactNode;
} ) {
  return (
    <li>
      <a className={ `wp-nav-item${ active ? ' is-active' : '' }${ small ? ' is-small' : '' }` }>
        { icon && <span className="wp-nav-icon-wrap" aria-hidden>{ icon }</span> }
        <span className="wp-nav-label">{ label }</span>
        { badge !== undefined && <span className="wp-nav-badge">{ badge }</span> }
      </a>
      { children && <ul className="wp-sub">{ children }</ul> }
    </li>
  );
}

/** WooCommerce submenu items wired to a merchant screen. */
const SUB_TARGET: Partial< Record< WooSubItem, 'home' | 'payments' > > = {
  Home: 'home',
  Settings: 'payments',
};

function Sidebar( {
  activeSub,
  onSelectSub,
  homeBadge = 0,
}: {
  activeSub: WooSubItem;
  onSelectSub?: ( screen: 'home' | 'payments' ) => void;
  homeBadge?: number;
} ) {
  return (
    <aside className="wp-sidebar" role="navigation" aria-label="Main navigation">
      <ul className="wp-nav-list">
        <NavItem icon={ <DashboardIcon /> } label="Dashboard" />
        <NavItem icon={ <PostsIcon /> } label="Posts" />
        <NavItem icon={ <MediaIcon /> } label="Media" />
        <NavItem icon={ <PagesIcon /> } label="Pages" />
        <NavItem icon={ <CommentsIcon /> } label="Comments" />
        <NavItem icon={ <WooCommerceIcon /> } label="WooCommerce" active>
          { WOO_SUBITEMS.map( ( item ) => {
            const target = SUB_TARGET[ item ];
            const cls = `wp-sub-item${ item === activeSub ? ' is-active-sub' : '' }`;
            const badge = item === 'Home' && homeBadge > 0
              ? <span className="wp-sub-badge">{ homeBadge }</span>
              : null;
            return (
              <li key={ item }>
                { target && onSelectSub ? (
                  <button type="button" className={ cls } onClick={ () => onSelectSub( target ) }>{ item }{ badge }</button>
                ) : (
                  <a className={ cls }>{ item }{ badge }</a>
                ) }
              </li>
            );
          } ) }
        </NavItem>
        <NavItem icon={ <ProductsIcon /> } label="Products" />
        <NavItem icon={ <AnalyticsIcon /> } label="Payments" />
        <NavItem icon={ <AnalyticsIcon /> } label="Analytics" />
        <NavItem icon={ <MarketingIcon /> } label="Marketing" />
        <NavItem icon={ <AppearanceIcon /> } label="Appearance" />
        <NavItem icon={ <PluginsIcon /> } label="Plugins" />
        <NavItem icon={ <UsersIcon /> } label="Users" />
        <NavItem icon={ <ToolsIcon /> } label="Tools" />
        <NavItem icon={ <SettingsIcon /> } label="Settings" />
        <NavItem icon={ <CollapseIcon /> } label="Collapse menu" small />
      </ul>
    </aside>
  );
}

function TopBar( { siteName, onViewStore }: { siteName: string; onViewStore?: () => void } ) {
  return (
    <header className="wp-topbar" role="banner">
      <div className="wp-topbar-left">
        <a className="wp-topbar-logo" aria-label="WordPress">
          <Icon icon={ wordpress } size={ 20 } />
        </a>
        {/* The site-name node links to the storefront, like WP's admin bar. */}
        <a
          className="wp-topbar-node wp-topbar-node--link"
          role="button"
          tabIndex={ 0 }
          aria-label={ `Visit ${ siteName }` }
          onClick={ onViewStore }
          onKeyDown={ ( e ) => { if ( e.key === 'Enter' || e.key === ' ' ) { e.preventDefault(); onViewStore?.(); } } }
        >
          <Icon icon={ home } size={ 20 } />
          <span>{ siteName }</span>
        </a>
        <a className="wp-topbar-node wp-topbar-node--muted">
          <Icon icon={ update } size={ 20 } />
          <span>0</span>
        </a>
        <a className="wp-topbar-node">
          <Icon icon={ plus } size={ 20 } />
          <span>New</span>
        </a>
        <a className="wp-topbar-node">View Posts</a>
      </div>
      <span className="wp-topbar-howdy">Howdy, Admin</span>
    </header>
  );
}

export default function WpAdminShell( {
  activeSub = 'Settings',
  siteName = 'WooTesting',
  onSelectSub,
  onViewStore,
  homeBadge = 0,
  children,
}: {
  activeSub?: WooSubItem;
  siteName?: string;
  onSelectSub?: ( screen: 'home' | 'payments' ) => void;
  /** Clicking the site name in the top bar opens the storefront. */
  onViewStore?: () => void;
  /** Blue count badge on the WooCommerce → Home submenu item. */
  homeBadge?: number;
  children: ReactNode;
} ) {
  return (
    <div className="wp-admin">
      <TopBar siteName={ siteName } onViewStore={ onViewStore } />
      <Sidebar activeSub={ activeSub } onSelectSub={ onSelectSub } homeBadge={ homeBadge } />
      <main className="wp-main">{ children }</main>
    </div>
  );
}
