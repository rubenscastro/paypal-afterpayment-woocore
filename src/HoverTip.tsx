import type { ReactElement } from 'react';
// @wordpress/components fallback — the @wordpress/ui Tooltip (base-ui) didn't
// render reliably wrapped around the table chevron/badge triggers; the
// components Tooltip is the proven, widely-used one for this hover affordance.
import { Tooltip } from '@wordpress/components';

/**
 * Shows `label` on hover/focus of the wrapped trigger element. Used for the
 * expand/collapse chevron and the count badge on the products / categories /
 * brands trees. The label also serves as the accessible name (it overrides the
 * visible count for screen-reader users).
 */
export default function HoverTip( {
  label,
  children,
  disabled = false,
}: {
  label: string;
  children: ReactElement;
  /** Render the child WITHOUT a tooltip (e.g. when the wrapped element is only a
      visual cue, not the action it would otherwise describe). */
  disabled?: boolean;
} ) {
  if ( disabled ) return children;
  return (
    <Tooltip text={ label } placement="top" delay={ 200 }>
      { children }
    </Tooltip>
  );
}
