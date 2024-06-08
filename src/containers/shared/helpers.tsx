import appConfig from '@appConfig';
import { COLOR_CODE } from '@components';
import { TableCell, styled, tableCellClasses } from '@mui/material';
import { StoreResponse } from '@queries/Store';
import { StoreService } from '@shared';

const getSelectedStoreLocation = (stores: StoreResponse[], storeId: string = null) => {
  const selectedStoreId = storeId || StoreService.getValue();
  return stores.find((store) => store.id === selectedStoreId)?.address;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: COLOR_CODE.GREY_50,
    color: COLOR_CODE.GREY_800,
    whiteSpace: 'nowrap',
    fontWeight: '700',
    fontSize: 16,
  },
}));

const getLocationByGoogleMap = async (address: string) => {
  const formattedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${appConfig.GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error('Geocode was not successful for the following reason: ' + data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    return null;
  }
}

const degreesToRadians = (degrees: number): number => {
  return degrees * Math.PI / 180;
}

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export { getSelectedStoreLocation, StyledTableCell, getLocationByGoogleMap, getDistanceFromLatLonInKm };
