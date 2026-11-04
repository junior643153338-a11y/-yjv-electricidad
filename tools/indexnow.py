# Avisa a Bing/IndexNow de las URLs del sitemap publicado: python3 tools/indexnow.py
import json, re, sys, urllib.request
sys.path.insert(0, __file__.rsplit("/", 1)[0])
KEY = "c4f1a7e2b9d84e6fa3b05d7c1e9f2a68"
SITE = "https://junior643153338-a11y.github.io/-yjv-electricidad"
urls = re.findall(r"<loc>([^<]+)</loc>", urllib.request.urlopen(SITE + "/sitemap.xml").read().decode())
body = json.dumps({"host": "junior643153338-a11y.github.io", "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", body, {"Content-Type": "application/json; charset=utf-8"})
print(len(urls), "URLs ->", urllib.request.urlopen(req).status)
