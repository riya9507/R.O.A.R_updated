Place your locally packaged Pench raster map tiles here using the standard Leaflet XYZ layout:

public/maps/pench/{z}/{x}/{y}.png

Then change the tile URL in src/screens/MapScreen.tsx to:
/maps/pench/{z}/{x}/{y}.png

The current development build uses OpenStreetMap tiles so the real geographic map is visible immediately.
