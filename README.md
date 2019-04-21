<h1>All-Gender Bathroom Finder</h1>

<h2>Summary</h2>
<p>This is the server behind the  <a href="https://github.com/alexmanzo/bathroom-finder-app">All-Gender Bathroom Finder App.</a></p>
<p>Functionality of the server includes:</p>
<ul>
  <li>GET all bathroom locations.</li>
  <li>GET bathroom locations based on geography.</li>
  <li>GET bathroom locations based on query.</li>
  <li>POST new bathroom locations, with checks for unique locations.</li>
  <li>DELETE bathroom locations by ID.</li>
  <li>PUT bathroom locations by ID</li>
</ul>

<h2>API Documentation</h2>
<p><strong>Base URL:</strong> https://gentle-lake-28954.herokuapp.com/api</p>

<h3>GET Locations</h3>
<em>/locations</em>
<p>Returns all locations.</p>
<em>/locations/geography?lat=VALUE&lng=VALUE</em>
<p>Returns all locations based on latitude and longitude.</p>
<em>/locations/search?query</em>
<p>Returns locations by query.</p>
<em>/locations/id/:id</em>
<p>Returns locations by ID.</p>

<h3>POST Locations</h3>
<em>/locations</em>
<p>Posts new location to the server. First searches server based on location name and zipcode to check for unique values.</p>

<h3>PUT Location</h3>
<em>/locations/:id</em>
<p>Edits & returuns location</p>

<h3>DELETE Location</h3>
<em>/locations/:id</em>
<p>Deletes location</p>

<h3>Location Object</h3>
<code>
{

        "_id": "5c32bc8ccdfffe0017336520",
        "loc": {
            "type": "Point",
            "coordinates": [
                -78.9577334,
                36.0403879
            ]
        },
        "type": [
            "restaurant",
            "point_of_interest",
            "food",
            "establishment"
        ],
        "googlePlaceId": [
            "ChIJ24c6XRHhrIkRA18898mTQ6Y"
        ],
        "name": "Picnic",
        "street": "1647 Cole Mill Road",
        "city": "Durham",
        "state": "NC",
        "zip": "27705",
        "dist": {
            "calculated": 0
        }     
  }
  </code>
<p><strong>_id</strong>: Generated by server when location is created</p>
<p><strong>loc</strong>: Location object for Mongoose. Type is always Point. Coordinates MUST be longitude first, latitude second.</p>
<p><strong>type</strong>: Array pulled from Google Places API.</p>
<p><strong>googlePlaceId</strong>: ID for Google Places API.</p>
<p><strong>name</strong>: Name of location.</p>
<p><strong>street</strong>: Street Address.</p>
<p><strong>city</strong>: City</p>
<p><strong>state</strong>: State.</p>
<p><strong>zip</strong>: Zipcode (String)</p>
<p><strong>dist</strong>: Returned from <em>/locations/geography</em> endpoint. Distance in meters from queried location.</p>

<h2>Technologies Used</h2>
<p>This server was created using the following technologies:</p>
<ul>
<li>Node.js</li>
<li>Express</li>
<li>MongoDB</li>
<li>Mongoose</li>
  <li>Mocha/Chai Testing</li>
  <li>Travis CI</li>
</ul>
<h2>Author</h2>
<p>This project was created by Alex Manzo.</p>