/**
 * The "Official" mark shown after a first-party plugin's title — the Woo mark
 * plus the word "Official". Rendered inside each layout's native title slot
 * (`titleField.render`, which both the list and grid layouts call), so the mark
 * sits right after the title in either view from one shared component.
 */
import { __ } from '@wordpress/i18n';

export default function OfficialMark() {
  return (
    <span className="pay-official">
      <img
        className="pay-official__mark"
        src="/logos/officialbadge.svg"
        width={ 16 }
        height={ 16 }
        alt=""
        aria-hidden="true"
        draggable={ false }
      />
      { __( 'Official', 'core-nesting' ) }
    </span>
  );
}
