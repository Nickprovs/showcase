This project uses the "config" module.

Some key points on how it works.
1.) default.json provides a list of all our configuration keys and values.
2.) custom-environment-variables.json specifies a mapping from environment variables to some of our configuration keys.
    a.) These mappings allow for setting some config values as an environment variable.
3-Important.) You can make your own configuration files for each possible NODE_ENV variable. Anything omitted will be provided by the default file.
    a.) The default NODE_ENV setting is "development" -- development.json
    b.) When deployed -- the setting will most likely be "production" -- production.json
    c.) When using a testing framework -- the setting will most likely be "test" test.json
4.) Some functionality of the server app requires you to enter the correct data or the associated features will not work.
    a.) SMTP info for contact functionality.
