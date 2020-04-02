---
layout: post
title: Happy Pi Day!
---

I decided to celebrate Pi day by using my second RasbperryPi as a Dnsmasq.

<br>
Previously I was blocking time wasting and malicious sites on my computer by editting /etc/hosts. I had some javascript that would loop through an array of hostnames and make a bunch of lines with the www. subdomain like the following:

```
0.0.0.0 timewaster.com
0.0.0.0 www.timewaster.com
```

Then running:
```
node script.js | pbcopy
```

I could just sudo vim /etc/hosts and paste over the existing file to block sites. This worked pretty well until I found myself reaching for my phone when I wanted to waste time since this only worked on devices where I changed the /etc/hosts file. Instead of editting the /etc/hosts of every device in the house I decided to tackle the problem at the router level.

<br>
The first thing I did was point my router's DNS to OpenDNS and block timewasting sites via OpenDNS. This worked pretty well until I reached the capacity of blocked sites that OpenDNS allows on their free account ( I believe around 25 ). Now I had the choice either to upgrade to a Business account on OpenDNS or find a different solution.

<br>
I browse hackernews quite a bit and I remembered an open source Dnsmasq called [pi-hole](https://pi-hole.net/). I went to their site and began setting it up. It was extremely easy to install on my RaspberryPi and began working flawlessly. Pi Hole allowed me to still use OpenDNS to resolve my DNS requests but allowed me to block DNS requests via my local RaspberryPi so the requests wouldn't get sent to OpenDNS. No enterprise account needed!

<br>
This was a fun way to spend an afternoon after work solving a real problem in my life! The open source community is so cool, and inexpensive hardware like the RaspberryPi makes for a perfect hacking tool!
