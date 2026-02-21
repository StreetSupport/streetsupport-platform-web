import type { Address } from '@/utils/organisation';
import { decodeText } from '@/utils/htmlDecode';

interface Props {
  address: Address;
}

function formatAddress(address: Address): string {
  const parts = [
    address.Street,
    address.City,
    address.Postcode,
  ]
    .filter(Boolean)
    .map(part => decodeText(part!));

  return parts.join(', ');
}

export default function ServiceAddress({ address }: Props) {
  const fullAddress = formatAddress(address);
  const coords = address.Location?.coordinates;

  const googleMapLink = coords
    ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
    : undefined;

  const appleMapLink = coords
    ? `https://maps.apple.com/?ll=${coords[1]},${coords[0]}`
    : undefined;

  return (
    <div className="mb-4">
      <p className="font-semibold mb-1">Address:</p>
      <p className="mb-2">{fullAddress || 'No address available'}</p>
      {(googleMapLink || appleMapLink) && (
        <div className="flex gap-4 text-sm">
          {googleMapLink && (
            <a
              href={googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View on Google Maps
            </a>
          )}
          {appleMapLink && (
            <a
              href={appleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View on Apple Maps
            </a>
          )}
        </div>
      )}
    </div>
  );
}
