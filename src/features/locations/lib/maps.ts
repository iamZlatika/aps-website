const TOVARYSKA_OFFICE_MAPS_URL =
  "https://www.google.com/maps/place/%D0%A1%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%BD%D1%8B%D0%B9+%D0%A6%D0%B5%D0%BD%D1%82%D1%80+%22Aps%22/@47.8900086,35.0634377,17z/data=!4m6!3m5!1s0x45b6c0ba7c5de5b7:0xedc27dfe0990c397!8m2!3d47.890005!4d35.0660126!16s%2Fg%2F11zfs38wd2?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D";
const TOVARYSKA_OFFICE_COORDS = "47.890005,35.0660126";

function isTovaryskaOffice(address: string): boolean {
  const normalized = address.toLowerCase();
  return normalized.includes("товарищеск") || normalized.includes("товариськ");
}

export function getMapsUrl(address: string): string {
  if (isTovaryskaOffice(address)) return TOVARYSKA_OFFICE_MAPS_URL;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function getMapEmbedSrc(address: string): string {
  const query = isTovaryskaOffice(address)
    ? TOVARYSKA_OFFICE_COORDS
    : encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${query}&zoom=15`;
}
