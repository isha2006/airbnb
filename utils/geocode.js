const axios = require('axios');

const geocode = async (location) => {
  const mapToken = process.env.MAP_TOKEN;
  const endpoint = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`;

  const res = await axios.get(endpoint);
  const feature = res.data.features[0];

  if (!feature) {
    throw new Error("Location not found");
  }
  return {
    type: 'Point',
    coordinates: feature.geometry.coordinates 
  };
};

module.exports = geocode;
