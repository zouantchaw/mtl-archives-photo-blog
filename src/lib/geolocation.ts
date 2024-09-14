import { headers } from 'next/headers';

export function getGeolocation() {
  const headersList = headers();
  return {
    ip: headersList.get('x-real-ip'),
    country: headersList.get('x-vercel-ip-country'),
    city: headersList.get('x-vercel-ip-city'),
    latitude: headersList.get('x-vercel-ip-latitude'),
    longitude: headersList.get('x-vercel-ip-longitude'),
  }
}