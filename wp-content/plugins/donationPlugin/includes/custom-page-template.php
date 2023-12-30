<?php


define('apiURL', "http://localhost/cchf/admin/api/");
define('homeURL', "http://localhost/cchf");
define('baseURL', "http://localhost/cchf/admin");
define('causeApi', "causeApi.php");
define('teamsApi', "teamsApi.php");
define('donationsApi', "donationsApi.php");
//change it to acctual URL


function dynamic_content_function($slug)
{
    $currentUrl = "http://localhost/wpMas/";
    $url = "http://localhost/cchf/campaign/" . $slug . '/?outsource&URLparam=' . $currentUrl;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    $output = curl_exec($ch);
    if ($output === FALSE) {
        echo "cURL Error: " . curl_error($ch);
    } else {
        echo $output;
    }
    curl_close($ch);

    // Define $causeSlug and $teamSlug before including other files
    $causeSlug = $slug; // Assuming $slug is a string
    $teamSlug = ""; // Default value or some logic to assign this

    // Now include your PHP files
    include('dynamic-functions.php');
    include('dynamic-data.php');
    include('footer-custom.php');
}

// This JS variable is defined but not used within the function.
// If you want to use it, make sure it's used within the PHP logic where needed.
