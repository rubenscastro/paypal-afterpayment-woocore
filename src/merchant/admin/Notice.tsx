/**
 * Warning Notice — token-accurate layout (matches the Figma DS Notice) with the
 * real `@wordpress/ui` Button and IconButton for the action + dismiss, so those
 * carry proper Gutenberg hover/focus/active states.
 */
import type { ReactNode } from 'react';
import { Button, IconButton } from '@wordpress/ui';
import { closeSmall } from '@wordpress/icons';

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.75v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="15.75" r="0.95" fill="currentColor" />
    </svg>
  );
}

export default function Notice( {
  title,
  children,
  actionLabel,
  onAction,
  onDismiss,
}: {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
} ) {
  return (
    <div className="wc-notice wc-notice--warning" role="status">
      <span className="wc-notice__icon" aria-hidden><WarningIcon /></span>
      <div className="wc-notice__content">
        <div className="wc-notice__text">
          <p className="wc-notice__title">{ title }</p>
          <p className="wc-notice__desc">{ children }</p>
        </div>
        { actionLabel && (
          <div className="wc-notice__actions">
            <Button variant="solid" tone="neutral" size="compact" onClick={ onAction }>{ actionLabel }</Button>
          </div>
        ) }
      </div>
      { onDismiss && (
        <IconButton
          className="wc-notice__close"
          icon={ closeSmall }
          label="Dismiss"
          variant="minimal"
          tone="neutral"
          size="small"
          onClick={ onDismiss }
        />
      ) }
    </div>
  );
}
