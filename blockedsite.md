---
layout: default
title:
permalink: /blockedsite/
---

<style>

  body, html {
    height: 100%;
    display: grid;
    background-color: black;
    color: white;
  }

  .center {
    margin: auto;
    text-align: center;
    width: 50%;
    border: 3px solid green;
    padding: 10px;
  }

</style>

<body>

  <div class="center">
    <h2> Site Blocked! </h2>
    <h1 id="todo"></h1>
  </div>

</body>

<script>
var tasks = [
	'Do 10 push ups',
  'Do 10 jumping jacks',
  'Drink a glass of water',
];

var idx = Math.floor(Math.random() * tasks.length);

document.getElementById('todo').innerHTML = tasks[idx];

</script>
