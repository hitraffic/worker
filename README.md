# hitraffic-worker

[![Join the chat at https://gitter.im/hitraffic/worker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hitraffic/worker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Fetches and stores geocoded location data.
"Work" will provide geo-coordinate data to supplement data provided by Hawaii Open Data for Traffic Incidents, adding the capability to plot map locations.  Data will be stored in a separate database to be utilized by mid and front end developers.

## Team Members:
A = Andrew

B = Joanne

## Work Modules:

1) [A] getIncidentData - retrieves JSON data from Traffic API

2) [J] processAddress - prepares valid address

3) [J] getGeoCodes - provides valid address to Geo Code API to retrieve geo coordinates (lat=latitude, lng=longitude)

4) [A] storeIncidents - inserts incidents with valid geo coordinates to PostgreSQL database

## API Data:
incident_number, date, code, type, address, location, area

Source Data: https://data.honolulu.gov/api/views/INLINE/rows.json?accessType=DOWNLOAD

Notes: 2 hour delay, over 162,000+ records, dates back to Aug 2012

Source Data: http://www4.honolulu.gov/hpdtraffic/

Notes: Real-Time data, requires scrapping (later)

Source: http://open.mapquestapi.com/geocoding/

Notes: Account required (J)

## Database: PostgreSQL 9.4.1
Notes: development using Mac OS X version

Production: (TBD)

### database name: hitraffic (tbd)

#### table name: incidents

  index: [PK, INT, AUTO]

  number: [INT, over 160,000+]

  date: [DATE/TIME]

  code: [INT or code table?]

  type: [STRING or FK to code_index?]

  address: [STRING]

  location: [STRING]

  area: [STRING]

  geo_coord: gc_index [FK]

#### table name: geo_coords

  gc_index: [PK, INT, AUTO]

  col: lat [FLOAT]

  col: lng [FLOAT]
