# ea4api-mock
This program generates API gateway log files for EA absorption

It is based on a cron job that triggers every minute '* * * * *' 

It takes up to 5 input parameters though app.properties

- DataSetFile
    - path to a CSV file with the following headers client_app,api,method,org,success,responseTimeSLABreach,failure,exception
    - For each combination of client_app,api,method,org we can define a number for 
        - success: successful API call
        - responseTimeSLABreach: successful API call with a duration above 1s to trigger a response time issue
        - failure: failed API call
        - exception: API call with an exception
- OutputDirectory
    - Directory path where log files should be written
- Trigger
    - This is an optional input
    - If set to 'once', the program will only generate one log file. This is for testing purpose
    - Default behavior is cron based for every minute
- Mode
    - Fixed
        - The number defined is interpreted as the number of transactions desired
    - RandomWeighted - allows get distributed data insteas
        - Requires NumberOfTransactions input
        - Will generate NumberOfTransactions using the data set in a random fashion
        - Randomness is controlled by the numbers we define for each record in the csv
- NumberOfTransactions
    - Required if Mode is set to 'RandomWeighted'
    - this will be the number of transactions that will be written to logs at every execution


     
