export const locateAddress = async (apiKey, address) => {
  let lng = 0;
  let lat = 0;
  let message = "";
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
  );
  const data = await response.json();
  if (data.status == "OK") {
    const location = data.results[0].geometry.location;
    lat = location.lat;
    lng = location.lng;
    return { lat, lng };
  } else {
    message = "Sorry, unable to locate address";
    return { message };
  }
};
