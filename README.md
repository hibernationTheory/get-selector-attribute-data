# Get Selector Attribute Data

Given a starting url (say "http://google.com") the script can fetch the target attribute value (say 'href') for given selector (like 'a') and returns the collected results in a output.json file. It is built with search engines in mind, so the configuration file can first submit a search query and then get the data collection. But it works equally well with a non-search engine page (search query submission is not mandatory).

## How to Use

- Run `npm install` to get the dependencies
- Configure the `config.json` according to your needs.
- Execute the script with `npm start`

## TO DO

- Include an actionable configuration file. (The current one points to an arbitrary locally running project)
- Include more examples for the configuration options.
- Make the output path to be configurable.
