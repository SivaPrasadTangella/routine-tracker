
import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

if not TOKEN:
    print("Error: TELEGRAM_BOT_TOKEN not found in .env")
    exit(1)

print(f"Checking updates for bot token: {TOKEN[:5]}...")
print("Please send a message to your bot on Telegram now.")

try:
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
    response = requests.get(url)
    data = response.json()
    
    if data.get('ok'):
        results = data.get('result', [])
        if results:
            chat_id = results[-1]['message']['chat']['id']
            user = results[-1]['message']['from']['first_name']
            print(f"\nSUCCESS! Found message from {user}.")
            print(f"Your TELEGRAM_CHAT_ID is: {chat_id}")
            print("\nCopy this ID to your .env file.")
        else:
            print("\nNo messages found yet. Please message the bot and run this script again.")
    else:
        print(f"\nError: {data}")

except Exception as e:
    print(f"\nError connecting to Telegram: {e}")
