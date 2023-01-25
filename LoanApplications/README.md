Eric Uehling 
11.3.2022

Terminal Usage: node index.js

The index.js file parses the payments.csv file and creates a new output file (applied.json) containing an array of objects that identifies how much money should be applied to each user's account. This also identifies how much they underpaid if the user did not pay their full amount. The amount to apply is tied to a user's username, which is stored in the db.json file.