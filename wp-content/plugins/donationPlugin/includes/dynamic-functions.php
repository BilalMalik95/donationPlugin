<?php


$getCampaignBySlug = apiURL . causeApi . '?actionType=getCampaignBySlug&raffleslug=' . urlencode($causeSlug);

$response = file_get_contents($getCampaignBySlug);
if ($response != false) {
    $campaignInfo = json_decode($response, true);
    $causeID = $campaignInfo['csid'];
    $causeTitle = $campaignInfo['title'];
    $menuPosition =    (isset($campaignInfo['menuPosition']) && $campaignInfo['menuPosition'] == "fixed") ? "" : "header-fixed";
    $show_donors =   $campaignInfo['show_donors'];
    $color =  (isset($campaignInfo['theme_color']) && !empty($campaignInfo['theme_color'])) ? $campaignInfo['theme_color'] : "#0089ff";
} else {

    header("Location:"  . "/404");
}
$team_panel_id = "";
$team_panel_title = "";
$team_panel_slug = "";
$team_panel_goal = 0;
$team_panel_raiseAmount = 0;
$team_panel_total_donations = 0;
$teamsSlug = $teamSlug;
if (!empty($teamSlug)) {
    $getTeamsBySlug = apiURL . teamsApi . '?actionType=getTeamsBySlug&raffleslug=' . urlencode($teamSlug);
    $teamResponse = file_get_contents($getTeamsBySlug);

    if ($teamResponse !== false) {
        $team = json_decode($teamResponse, true);
        $team_panel_id = $team['team_id'];
        $team_panel_title = $team['display_name'];
        $team_panel_goal = $team['team_goal'];
        $team_panel_slug = $team['team_slug'];
        $team_panel_raiseAmount =  $team['total_amount'];
        $team_panel_total_donations =  $team['total_donations'];
        $getTeamsDonations = apiURL . teamsApi . '?actionType=getTeamsDonations&raffleslug=' . urlencode($team['team_id']);
        $teamsDonations = file_get_contents($getTeamsDonations);
        $getTeamsDonationsc = $teamsDonations !== false ? json_decode($teamsDonations, true) : null;


        $teamsDonationsCount = apiURL . teamsApi . '?actionType=getTeamsDonationsCount&raffleslug=' . urlencode($team['team_id']);
    }
}
$getCampaignBySlug = apiURL . causeApi . '?actionType=getAdminSettings&causeId=' . urlencode($causeID);
$responses = file_get_contents($getCampaignBySlug);

if ($responses != false) {
    $adminSetting = json_decode($responses, true);

    $legalName = $adminSetting['legal_name'];
    $orgEmail = $adminSetting['email'];
    $bankStatement = $adminSetting['bank_statement'];
    $phone = $adminSetting['phone'];
    $address = $adminSetting['address'];
    $address2 = $adminSetting['address2'];
    $mailingAddress = $adminSetting['mailing_address'];
    $taxID = $adminSetting['tax_id'];
    $statementDescriptor = $adminSetting['statement_descriptor'];
} else {
    $legalName = "";
    $orgEmail = "";
    $bankStatement = "";
    $phone = "";
    $address = "";
    $address2 = "";
    $mailingAddress = "";
    $taxID = "";
    $statementDescriptor = "";
}

$bannerMainContent =  "";
$bannerSubContent =  "";
$bannerMainButton =  "";
$bannerMainButtonUrl =  "";
$bannerSecondaryButton = "";
$banner_amount = "";
$bannerButtonShow = "d-none";

// $campaignCustomPrices = apiURL . causeApi . '?actionType=getCampaignCustomPrices&causeId=' . urlencode($causeID);
// $responses = file_get_contents($campaignCustomPrices);
// if ($responses != false) {
//     $getCampaignCustomPrices = json_decode($responses, true);
// }


$campaignCustomPricesURL = apiURL . causeApi . '?actionType=getCampaignCustomPrices&causeId=' . urlencode($causeID);
$campaignCustomPricesResponse = file_get_contents($campaignCustomPricesURL);
$getCampaignCustomPrices = $campaignCustomPricesResponse !== false ? json_decode($campaignCustomPricesResponse, true) : null;



$totalGoalSponsoredURL = apiURL . causeApi . '?actionType=getCauseSponsoredAmount&causeId=' . urlencode($causeID);
$totalGoalSponsoredResponse = file_get_contents($totalGoalSponsoredURL);
$totalGoalSponsored = $totalGoalSponsoredResponse !== false ? json_decode($totalGoalSponsoredResponse, true) : null;


$campaignBannersURL = apiURL . causeApi . '?actionType=getCampaignBanners&causeId=' . urlencode($causeID);
$campaignBannersResponse = file_get_contents($campaignBannersURL);
$getCampaignBanners = $campaignBannersResponse !== false ? json_decode($campaignBannersResponse, true) : null;



$allPrizesURL = apiURL . causeApi . '?actionType=getAllPrizes&causeId=' . urlencode($causeID);
$allPrizesResponse = file_get_contents($allPrizesURL);
$getAllPrizes = $allPrizesResponse !== false ? json_decode($allPrizesResponse, true) : null;


$allCampaignPrizesURL = apiURL . causeApi . '?actionType=getCampaignPrizesFront&causeId=' . urlencode($causeID);
$allCampaignPrizesResponse = file_get_contents($allCampaignPrizesURL);
$getAllCampaignPrizes = $allCampaignPrizesResponse !== false ? json_decode($allCampaignPrizesResponse, true) : null;

$allGrandPrizesURL = apiURL . causeApi . '?actionType=getAllGrandPrizes';
$allGrandPrizesResponse = file_get_contents($allGrandPrizesURL);
$getAllGrandPrizes = $allGrandPrizesResponse !== false ? json_decode($allGrandPrizesResponse, true) : null;


$menuPagesURL = apiURL . causeApi . '?actionType=getMenuPages&causeId=' . urlencode($causeID) . '&menuType=general';
$menuPagesResponse = file_get_contents($menuPagesURL);
$mainMenuData = $menuPagesResponse !== false ? json_decode($menuPagesResponse, true) : null;




// $secondaryMenuPagesURL = apiURL . causeApi . '?actionType=getMenuPages&causeId=' . urlencode($causeID) . '&menuType=secondary';
// $secondaryMenuPagesResponse = file_get_contents($secondaryMenuPagesURL);

$getSecondaryMenu =  [];


$logo = !empty($campaignInfo['logo']) ? baseURL . '/cause_thumbs/' . $campaignInfo['logo'] : homeURL . "/images/logo.svg";
$goal =   (isset($campaignInfo['goal']) && !empty($campaignInfo['goal'])) ? $campaignInfo['goal'] : 0;
$bgImg = !empty($campaignInfo['logo']) ? baseURL . '/cause_thumbs/' . $campaignInfo['logo'] : homeURL . "/images/logo.svg";


if (is_array($getCampaignBanners)) {



    foreach ($getCampaignBanners as $banner) {

        // $banner['start_date'];
        // $banner['end_date'];
        // require __DIR__ . '/../MobileDetect/vendor/autoload.php';

        // $detect = new Detection\MobileDetect;
        if ($banner['type'] == 'media') {
            $isImgBg = false;
            $bannerMainContent =  "";
            $bannerSubContent =  "";
            $bannerMainButton =  "";
            $bannerMainButtonUrl =  "";
            $bannerSecondaryButton = "";
            $banner_amount = "";
            $bannerButtonShow = "d-none";
            if ($banner['media_type'] == 'file') {


                // if (($detect->isMobile() || $detect->isTablet()) && !empty($banner['mobile_media'])) {
                // $bgImg = baseURL . "/../uploads/banners/" . $banner['mobile_media'];
                // } else {
                $bgImg = baseURL . "/../uploads/banners/" . $banner['media'];
                // }
                $iframe  = false;
            } else {
                $bgImg =  $banner['media'];
                $iframe  = true;
            }
        } else {

            // if (($detect->isMobile() || $detect->isTablet())) {
            $isImgBg = true;
            // if (!empty($banner['custom_bg_mobile'])) {
            //     $bgImg = baseURL . "/../uploads/banners/" . $banner['custom_bg_mobile'];
            // } else {
            $bgImg = baseURL . "/../uploads/banners/" . $banner['custom_bg'];
            // }
            // } else {
            //     $isImgBg = false;
            //     $bgImg = baseURL . "/../uploads/banners/" . $banner['custom_bg'];
            // }

            $bannerMainButtonUrl = (isset($banner['button_url']) && !empty($banner['button_url'])) ? $banner['button_url'] : "#";
            $bannerMainContent = (isset($banner['mainContent']) && !empty($banner['mainContent'])) ? $banner['mainContent'] : "ENTER NOW FOR A CHANCE TO WIN";
            $bannerSubContent = (isset($banner['subContent']) && !empty($banner['subContent'])) ? $banner['subContent'] : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,";
            $bannerMainButton = (isset($banner['mainButtonContent']) && !empty($banner['mainButtonContent'])) ? $banner['mainButtonContent'] : "View Prizes";
            $bannerSecondaryButton = (isset($banner['subButtonContent']) && !empty($banner['subButtonContent'])) ? $banner['subButtonContent'] : "Buy the Raffle";
            $banner_amount = (isset($banner['banner_amount']) && !empty($banner['banner_amount'])) ? $banner['banner_amount'] : "";
            $bannerButtonShow = "";
        }
    }
}
$prizesCountURL = apiURL . causeApi . '?actionType=getPrizesCount&causeId=' . urlencode($causeID);
$prizesCountResponse = file_get_contents($prizesCountURL);


$allPrizesCount = 0;

if ($prizesCountResponse !== false && !empty($prizesCountResponse)) {
    $prizesData = json_decode($prizesCountResponse, true);
    $allPrizesCount = $prizesData['count'];
}





$showDonors =  (isset($campaignInfo['totalDonors']) && $campaignInfo['totalDonors'] == 0) ? true : false;
$showLargestDonation =    (isset($campaignInfo['largestDonation']) && $campaignInfo['largestDonation'] == 0) ? true : false;
$showFabulousPrize =    (isset($campaignInfo['fabulousPrize']) && $campaignInfo['fabulousPrize'] == 0) ? true : false;
$showTicketSold =    (isset($campaignInfo['ticketSold']) && $campaignInfo['ticketSold'] == 0) ? true : false;
$totalDoners = 0;
$ticketsSold = 0;
$largestDonationAmount = 0;

$campaignStatsURL = apiURL . causeApi . '?actionType=getCampgainStats&causeId=' . urlencode($causeID);
$campaignStatsResponse = file_get_contents($campaignStatsURL);
$totalDoners = $ticketsSold = $largestDonationAmount = 0;

if ($campaignStatsResponse !== false) {
    $campgainStats = json_decode($campaignStatsResponse, true);
    if (!empty($campgainStats)) {
        $totalDoners = $campgainStats['TotalDonors'] ?? 0;
        $ticketsSold = $campgainStats['TicketsSold'] ?? 0;
        $largestDonationAmount = $campgainStats['largestDonationAmount'] ?? 0;
    }
}



$goalSponsored = ($totalGoalSponsored > 0 && $goal > 0) ? number_format(($totalGoalSponsored / $goal) * 100, 0) : 0;



$getRulesURL = apiURL . causeApi . '?actionType=getRules&causeId=' . urlencode($causeID);
$getRulesResponse = file_get_contents($getRulesURL);
$rules = "";

if ($getRulesResponse !== false) {
    $getRules = json_decode($getRulesResponse, true);
    $rules = isset($getRules['rules']) ? htmlspecialchars_decode($getRules['rules']) : "";
}


$getDonationsURL = apiURL . donationsApi . '?actionType=getRecentDonationByCause&causeId=' . urlencode($causeID) . '&limit=12';


$getDonationsResponse = file_get_contents($getDonationsURL);
$getDonations = $getDonationsResponse !== false ? json_decode($getDonationsResponse, true) : 0;



$donationsCountURL = apiURL . donationsApi . '?actionType=getRecentDonationByCauseCount&causeId=' . urlencode($causeID);
$donationsCountResponse = file_get_contents($donationsCountURL);
$donationsCount = $donationsCountResponse !== false ? json_decode($donationsCountResponse, true) : 0;


$getTeamsURL = apiURL . teamsApi . '?actionType=getTeamsForDonations&causeId=' . urlencode($causeID) . '&limit=6';
$getTeamsResponse = file_get_contents($getTeamsURL);
$getTeams = $getTeamsResponse !== false ? json_decode($getTeamsResponse, true) : 0;


$teamsCountURL = apiURL . teamsApi . '?actionType=getCountTeams&causeId=' . urlencode($causeID);
$teamsCountResponse = file_get_contents($teamsCountURL);
$teamsCount = $teamsCountResponse !== false ? json_decode($teamsCountResponse, true) : 0;

$getPackages = apiURL . causeApi . '?actionType=getSubPricesByGrandPrizeID&causeId=' . urlencode($causeID);
$packageId = file_get_contents($getPackages);
$getPackagesId = $packageId !== false ? json_decode($packageId, true) : 0;
