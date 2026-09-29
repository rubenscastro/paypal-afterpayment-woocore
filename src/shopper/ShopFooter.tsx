/** Storefront footer — brand + link columns + "Designed with WordPress". */
const COLUMNS = [
  { title: 'About', links: [ 'Team', 'History', 'Careers' ] },
  { title: 'Privacy', links: [ 'Privacy Policy', 'Terms and Conditions', 'Contact Us' ] },
  { title: 'Social', links: [ 'Facebook', 'Instagram', 'Twitter/X' ] },
];

export default function ShopFooter() {
  return (
    <footer className="sh-footer">
      <div className="sh-footer__inner">
        <div className="sh-footer__brand">Raven Of Sacreds</div>
        <div className="sh-footer__cols">
          { COLUMNS.map( ( col ) => (
            <div key={ col.title } className="sh-footer__col">
              <span className="sh-footer__col-title">{ col.title }</span>
              { col.links.map( ( l ) => (
                <a key={ l } className="sh-footer__link">{ l }</a>
              ) ) }
            </div>
          ) ) }
        </div>
      </div>
      <div className="sh-footer__legal">
        Designed with <a href="#" onClick={ ( e ) => e.preventDefault() }>WordPress</a>
      </div>
    </footer>
  );
}
