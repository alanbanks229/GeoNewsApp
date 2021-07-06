#! /bin/bash
# Export the Google and Bing API keys as env(s)
# When running this script, precede with 'source' like such:
# $ source ./export_keys.sh
# This will ensure the parent shell you're working from will
# have visbility into the env variables set.

# Place your own API key values here, replacing what you see with your own.
GOOGLE_KEY=AIzaSyAJl8cHlF33w5ePQlxpfVxEh34Sow_uhac
BING_KEY=a743e8ea9e8749089234756f0681648a

export GOOGLE_API_KEY=GOOGLE_KEY
export BING_API_KEY=BING_KEY
echo "Google key set as:"
echo $GOOGLE_KEY
echo "Bing key set as:"
echo $BING_KEY

