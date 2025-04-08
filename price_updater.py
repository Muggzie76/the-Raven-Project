import requests
import json
import time
from datetime import datetime
import os

# Constants
RAVEN_TOKEN_ID = "4k7jk-vyaaa-aaaam-qcyaa-cai"
ICP_TOKEN_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai"
ICPSWAP_API_URL = f"https://app.icpswap.com/swap/pro?input={RAVEN_TOKEN_ID}&output={ICP_TOKEN_ID}"
UPDATE_INTERVAL = 1800  # 30 minutes in seconds
PRICE_FILE = "token_price.json"

def fetch_token_price():
    try:
        # Make request to ICPSwap
        response = requests.get(ICPSWAP_API_URL)
        response.raise_for_status()
        
        # Extract price from response
        # Note: You'll need to adjust the parsing based on ICPSwap's actual response format
        price_data = response.json()
        price = price_data.get('price', 0)  # Adjust this based on actual response structure
        
        return {
            'price': price,
            'timestamp': datetime.now().isoformat(),
            'token_id': RAVEN_TOKEN_ID
        }
    except Exception as e:
        print(f"Error fetching price: {e}")
        return None

def save_price_data(price_data):
    try:
        with open(PRICE_FILE, 'w') as f:
            json.dump(price_data, f, indent=4)
        print(f"Price updated: {price_data['price']} at {price_data['timestamp']}")
    except Exception as e:
        print(f"Error saving price data: {e}")

def main():
    print("Starting price updater...")
    while True:
        price_data = fetch_token_price()
        if price_data:
            save_price_data(price_data)
        time.sleep(UPDATE_INTERVAL)

if __name__ == "__main__":
    main() 