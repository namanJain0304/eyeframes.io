import scrapy
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access MongoDB Atlas URL from environment variables
mongo_url = os.environ["MONGOATLAS_URL"]
client = MongoClient(mongo_url)
db = client["test"]

def insertToDb(modelname, brandname, price):
    collection = db["scrapedframes"]
    collection.insert_one({
        "frameName": modelname,
        "brandName": brandname,
        "scrapedPrice": price
    })

class WebframesSpider(scrapy.Spider):
    name = "webframes"
    allowed_domains = ["go-optic.com"]
    start_urls = ["https://go-optic.com"]

    def start_requests(self):
        urls = [
            "https://www.go-optic.com/rayban-eyeglasses",
            "https://www.go-optic.com/versace-eyeglasses",
            "https://www.go-optic.com/tom-ford-eyeglasses",
            "https://www.go-optic.com/calvin-klein-eyeglasses",
            "https://www.go-optic.com/prada-eyeglasses",
            "https://www.go-optic.com/gucci-eyeglasses",
            "https://www.go-optic.com/coach-eyeglasses",
            "https://www.go-optic.com/rayban-sunglasses"
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-1]
        items = response.css("div.item")  # Select all item containers

        # Iterate through each item and extract details
        for item in items:
            brand = item.css("span.brand a::text").get()  # Extract brand name
            model = item.css("span.model a::text").get()  # Extract model name
            price = item.css("div.price span.og::text").get()  # Extract price

            # Print the extracted details (for debugging or logging purposes)
            self.log(f"Brand: {brand}, Model: {model}, Price: {price}")

            # You can also yield the data as an item/dict
            yield {
                "brand": brand,
                "model": model,
                "price": price
            }
            insertToDb(model, brand, price)

        # Save the HTML page to a file (optional)
        filename = f"frames-{page}.html"
        Path(filename).write_bytes(response.body)
        self.log(f"Saved file {filename}")
