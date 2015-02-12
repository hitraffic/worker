# hitraffic-worker

[![Join the chat at https://gitter.im/hitraffic/worker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hitraffic/worker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Fetches and stores geocoded location data.
"Work" will provide geo-coordinate data to supplement data provided by Hawaii Open Data for Traffic Incidents, adding the capability to plot map locations.  Data will be stored in a separate database to be utilized by mid and front end developers.

## Team Members:

A = Andrew

B = Joanne

## Worker Modules:

1) [A] getIncidentData - retrieves JSON data from Traffic API (and later, HPD real-time site) and stores them in a database

2) [J] processIncidents - retrieves records from the database

    a) [J] fixDate - converts date from epoch to local

    b) [J] processAddress - prepares valid address

    c) [J] getGeoCodes - provides valid address to Geo Code API to retrieve geo coordinates (lat=latitude, lng=longitude)

    d) [A] storeIncidents - inserts incidents with valid geo coordinates to the database
    
3) [A] getRealTimeData - retrieves JSON data from HPD site and stores them on the database daily, and processed by step 2)

## API Data:
incident_number, date, code, type, address, location, area

Source Data: https://data.honolulu.gov/api/views/ix32-iw26/rows.json?accessType=DOWNLOAD

Notes: 2 hour delay, over 163,000+ records, dates back to Aug 2012

Source Data: http://www4.honolulu.gov/hpdtraffic/ or https://twitter.com/hpdtraffic

Notes: Real-Time data, requires scrapping (later)

Source: http://open.mapquestapi.com/geocoding/

Notes: Account required (J)

## Database: PostgreSQL 9.4.1
Notes: development using Mac OS X version

Production: (TBD)

### database name: hitraffic

#### table name: incidents

  index: [PK, INT, AUTO INCREMENT, UNIQUE]

  number: [INT, over 160,000+]

  date: [DATE/TIME]

  code: [INT]

  type: [STRING]

  address: [STRING]

  location: [STRING]

  area: [STRING]

  lat: [FLOAT]

  lng: [FLOAT]
  
  Note: postgis.net may provide extensive capability with geography and geometry in the future.
