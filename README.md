This is a simple CORS API that allows any web page to issue a HEAD request
and obtain TLS information about any website.

## Quick Start

This will start up the server on port 3000.

    git clone git://github.com/toolness/head-cors-api.git
    cd head-cors-api
    npm install
    node app.js

## Examples

Obtaining header information about any URL:

    $ curl http://localhost:3000/?url=https://github.com/
    
    {
      "server": "nginx",
      "date": "Thu, 04 Oct 2012 16:36:13 GMT",
      "content-type": "text/html; charset=utf-8",
      "connection": "keep-alive",
      "status": "200 OK",
      "x-frame-options": "deny",
      "set-cookie": [
        ...
      ],
      "cache-control": "private, max-age=0, must-revalidate",
      "content-length": "23043",
      "x-runtime": "13",
      "strict-transport-security": "max-age=2592000",
      "etag": "\"9cb94bd366b6b201c7d27bbf07c145a3\""
    }
    
Obtaining TLS information about any URL:

    $ curl http://localhost:3000/tls/github.com/443
    
    {
      "cert": {
        "subject": {
          "businessCategory": "Private Organization",
          "1.3.6.1.4.1.311.60.2.1.3": "US",
          "1.3.6.1.4.1.311.60.2.1.2": "California",
          "serialNumber": "C3268102",
          "C": "US",
          "ST": "California",
          "L": "San Francisco",
          "O": "GitHub, Inc.",
          "CN": "github.com"
        },
        "issuer": {
          "C": "US",
          "O": "DigiCert Inc",
          "OU": "www.digicert.com",
          "CN": "DigiCert High Assurance EV CA-1"
        },
        "subjectaltname": "DNS:github.com, DNS:www.github.com",
        "modulus": "...",
        "exponent": "10001",
        "valid_from": "May 27 00:00:00 2011 GMT",
        "valid_to": "Jul 29 12:00:00 2013 GMT",
        "fingerprint": "CE:67:99:25:2C:AC:78:12:7D:94:B5:62:2C:31:C5:16:A6:34:73:53",
        "ext_key_usage": [
          "1.3.6.1.5.5.7.3.1",
          "1.3.6.1.5.5.7.3.2"
        ]
      },
      "cipher": {
        "name": "RC4-SHA",
        "version": "TLSv1/SSLv3"
      },
      "authorized": true
    }
    