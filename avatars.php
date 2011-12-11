<?php

// Enable errors for easy debugging.
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Configurable stuff.
define('URL', 'http://search.twitter.com/search.json');
define('SEARCH_PREFIX', '(ivegotmybluebeanieonnowwhat.com OR movethewebforward.com OR movethewebforward.org) AND ');
define('RPP', 100);

// Hashtags to search twitter for.
$queries = array(
  "#learn",
  "#ask4help",
  "#helpothers",
  "#feedback",
  "#explore",
  "#write",
  "#filebugs",
  "#hack"
);

// Don't let random scallywags run this script.
if ((isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] !== '127.0.0.1') || PHP_SAPI !== 'cli')
  die('☹');

// Search twitter, return full json_decode()'d response.
function search($query, $page = 1) {
  $url = URL . '?' . http_build_query(array(
    'q' => SEARCH_PREFIX . $query,
    'rpp' => RPP,
    'page' => $page
  ));

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_NOBODY, 0);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_USERAGENT, 'movethewebforward.org');
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  $response = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($status == 200) {
    return json_decode($response);
  }
  else {
    die("Twitter error: " . $status);
  }
}

// Get all results for a query.
function getAll($query) {
  $page = 0;
  $avatars = array();

  do {
    $results = search($query, ++$page);

    foreach ($results->results as $result) {
      $avatars[$result->from_user] = $result->profile_image_url;
    }
  }
  while (count($results->results) == RPP);

  return $avatars;
}

// Merge new avatars into our file of existing avatars.
$avatars = json_decode(file_get_contents('avatars.json'));

foreach ($queries as $query) {
  $avatars->$query = array_merge((array)$avatars->$query, getAll($query));
}

file_put_contents('avatars.json', json_encode($avatars));
