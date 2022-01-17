## Obsidian Sync RemoteStorage

This plugin aims to:

> Step1

-   Get list of vault contents
-   Upload vault contents TO RemoteStorage
    -   Ideally this would use a storage adapter to stream vault state (where content streams are present) directly to the cloud

> Step2

-   Retrieve and sync/merge vault contents FROM RemoteStorage.
    -   For this, look into how obisidian-livesync performs diffs/merges

> Step 3

-   0auth from plugin? or atleast link to site to get 0auth code

> Step 4

-   once basic up/down links and auth are setup, look into adding toggles for public/nonpublic notes
