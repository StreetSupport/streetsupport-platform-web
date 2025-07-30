import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container container--footer">
        <div className="footer__col">
          <h3 className="h3 footer__header">Follow Street Support Network</h3>
          <ul className="footer__social-list">
            <li className="footer__social-item">
              <a href="https://www.facebook.com/streetsupport" target="_blank" rel="noopener noreferrer">
                {/* Facebook icon placeholder - will style later */}
                <span>Facebook</span>
              </a>
            </li>
            <li className="footer__social-item">
              <a href="https://bsky.app/profile/streetsupport.net" target="_blank" rel="noopener noreferrer">
                {/* Bluesky icon placeholder - will style later */}
                <span>Bluesky</span>
              </a>
            </li>
          </ul>
          {/* App store links commented out as in original
          <p className="footer__header">Download our app here:</p>
          <div className="app-store-links">
            <a href="https://itunes.apple.com/gb/app/street-support/id1154666716?mt=8" className="app-store-links__itunes-appstore">
              App Store Link
            </a>
          </div>
          */}
        </div>
        <div className="footer__col">
          <div className="footer__logo-container">
            <Image
              src="/assets/img/StreetSupport_logo_land.png"
              alt="Street Support Network Logo"
              width={100}
              height={50}
              className="icon"
            />
            <p>Street Support
              <br />Network</p>
          </div>
          <div>
            <p>
              <a href="https://beta.companieshouse.gov.uk/company/10348840" target="_blank" rel="noopener noreferrer">
                Street Support Network Ltd
              </a> is a{' '}
              <a href="http://apps.charitycommission.gov.uk/Showcharity/RegisterOfCharities/CharityFramework.aspx?RegisteredCharityNumber=1177546&SubsidiaryNumber=0" target="_blank" rel="noopener noreferrer">
                Registered Charity: 1177546
              </a>
            </p>
            <p className="footer__copy">
              &copy; 2025 Street Support Network{' '}
              <Link href="/about/privacy-and-data/privacy-policy" className="footer__link">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}