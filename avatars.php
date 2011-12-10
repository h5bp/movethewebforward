<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

define('URL', 'http://search.twitter.com/search.json');
define('SEARCH_PREFIX', '(ivegotmybluebeanieonnowwhat.com OR movethewebforward.com OR movethewebforward.org) AND ');
define('RPP', 100);

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

if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1')
  die('☹');

function search($query, $page = 1) {
  $url = URL . '?' . http_build_query(array(
    'q' => SEARCH_PREFIX . $query,
    'rpp' => RPP,
    'page' => $page
  ));

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_VERBOSE, 1);
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
  return FALSE;
}

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

$avatars = json_decode(file_get_contents('avatars.json'));

foreach ($queries as $query) {
  $avatars->$query = array_merge((array)$avatars->$query, getAll($query));
}

$fp = fopen('avatars.json', 'w');
fwrite($fp, json_encode($avatars));
fclose($fp);
