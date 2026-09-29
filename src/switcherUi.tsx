/**
 * The switcher popover's menu primitives, shared by every iteration's settings
 * block so they all read as one menu: a section label, a rule, a radio row and
 * a toggle row.
 *
 * Whether a pick closes the popover is the caller's call, not the control's:
 * radios that swap one presentation for another usually close (you want to see
 * the result), radios you flip between to compare usually stay open.
 */
import type { ReactNode } from 'react';

export function SwitcherLabel( { children }: { children: ReactNode } ) {
  return <div className="store-switcher__label">{ children }</div>;
}

export function SwitcherDivider() {
  return <div className="store-switcher__divider" role="separator" />;
}

export function SwitcherRadio( {
  label,
  hint,
  checked,
  onClick,
}: {
  label: ReactNode;
  /** A second, muted line under the label — for picks that need a gloss. */
  hint?: string;
  checked: boolean;
  onClick: () => void;
} ) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={ checked }
      className={ `store-switcher__item${ checked ? ' is-selected' : '' }${
        hint ? ' store-switcher__item--stacked' : ''
      }` }
      onClick={ onClick }
    >
      <span className="store-switcher__radio" aria-hidden>
        <span className="store-switcher__radio-dot" />
      </span>
      <span className="store-switcher__item-text">
        { label }
        { hint && <span className="store-switcher__item-hint">{ hint }</span> }
      </span>
    </button>
  );
}

export function SwitcherToggle( {
  label,
  checked,
  onClick,
  /** A toggle that doubles as its section's heading (no separate label above). */
  heading = false,
}: {
  label: ReactNode;
  checked: boolean;
  onClick: () => void;
  heading?: boolean;
} ) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={ checked }
      className={ `store-switcher__item store-switcher__item--toggle${
        heading ? ' store-switcher__item--heading' : ''
      }${ checked ? ' is-selected' : '' }` }
      onClick={ onClick }
    >
      { label }
      <span className="store-switcher__switch" aria-hidden>
        <span className="store-switcher__switch-knob" />
      </span>
    </button>
  );
}
