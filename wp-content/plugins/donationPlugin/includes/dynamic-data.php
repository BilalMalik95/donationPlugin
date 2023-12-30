<?php
include('dynamic-functions.php');
?>


<script>
  const siteContent = {
    mainMenu: [
      <?php foreach ($mainMenuData as $menuItem) { ?> {
          text: <?= json_encode($menuItem['page_title']); ?>,
          link: <?= json_encode($menuItem['url']); ?>
        },
      <?php } ?> {
        text: "Donate Now",
        link: "#ticketsSection"
      }
    ],
    secondaryMenu: [
      <?php foreach ($getSecondaryMenu as $menuItem) { ?> {
          text: <?= json_encode($menuItem['page_title']); ?>,
          link: <?= json_encode($menuItem['url']); ?>
        },
      <?php } ?>
    ],
    logo: {
      img: "<?= $logo; ?>",
      text: "<?= $campaignInfo['title']; ?>"
    },
    promo: {
      title: "<?= $bannerMainContent ?>",
      titleAmount: "<?= $banner_amount ?>",
      subtitle: "<?= $bannerSubContent ?>",
      imageURL: "<?= $bgImg; ?>",
      isImgBg: "<?= $isImgBg ?>",
      button: [{
        text: "<?= $bannerMainButton ?>",
        link: "<?= $bannerMainButtonUrl ?>",
        class: "<?= $bannerButtonShow ?>"
      }],
      link: [{
        text: "About <?= $campaignInfo['title']; ?>",
        link: "#aboutSection",
        class: "<?= $bannerButtonShow ?>"
      }]
    },
    raffleOffer: {
      drawingDate: new Date("<?= date("Y, ", strtotime($campaignInfo['cs_end_date'])) . (date("m", strtotime($campaignInfo['cs_end_date'])) - 1) . date(", d", strtotime($campaignInfo['cs_end_date'])) ?>"),
      progressPercentage: "<?= $goalSponsored ?>",
      amount: "<?= $totalGoalSponsored; ?>",
      targetAmount: "<?= $goal; ?>",
      button: [{
        text: "Enter Now",
        link: "#ticketsSection"
      }]
    },
    countersStatistic: [{
        id: "fabulousPrizes",
        text: "Fabulous Prizes",
        value: <?= $allPrizesCount; ?>,
        hidden: "<?= $showFabulousPrize ?>"
      },
      {
        id: "totalDonors",
        text: "Total Donors",
        value: <?= $totalDoners ?>,
        hidden: "<?= $showDonors ?>"
      },
      {
        id: "ticketsSold",
        text: "Tickets Sold",
        value: <?= $ticketsSold ?>,
        hidden: "<?= $showTicketSold ?>"
      },
      {
        id: "largestDonation",
        text: "Largest Donation",
        value: <?= $largestDonationAmount ?>,
        hidden: "<?= $showLargestDonation ?>"
      }
    ],
    about: {
      title: "<?= $campaignInfo['enableIntroContent'] == 1 ? $campaignInfo['intro_header'] : 'About Raffle'; ?>",
      description: <?= json_encode($campaignInfo['main_content']); ?>,
      additionalContent: <?= json_encode($campaignInfo['additional_content']); ?>,
      button: [{
        text: "<?= $campaignInfo['button_content']; ?>",
        link: "#additionalContent",
        class: "<?= empty($campaignInfo['button_content']) ? 'd-none' : ''; ?>"
      }]
    },
    teamOverview: {
      teamOwner: "<?= $team_panel_title ?>",
      goal: <?= $team_panel_goal ?>,
      raised: <?= $team_panel_raiseAmount ?>,
      donors: <?= $team_panel_total_donations ?>,
      campaignLink: [{
        text: "<?= $causeTitle ?>",
        link: "<?= $team_panel_slug ? homeURL . '/campaign/' . $team_panel_slug : "" ?>"
      }]
    },
    tickets: {
      title: "Choose your tickets",
      packages: [
        <?php foreach ($getCampaignCustomPrices as $customPrice) { ?> {
            id: <?= $customPrice['id']  ?>,
            amount: <?= $customPrice['sub_price']  ?>,
            entry: <?= $customPrice['entries']  ?>,
            grandPrize: <?= !empty($customPrice['grand_prize']) ? $customPrice['grand_prize'] : "0"  ?>,
            prizesAmount: <?= $allPrizesCount  ?>,
            prizes: <?= $customPrice['cgp_count']  ?>
          },
        <?php } ?>
      ],
      prizes: [
        <?php
        $counter = 1;
        foreach ($getAllCampaignPrizes as $allPrizes) {
          $getPackageIDs = apiURL . causeApi . '?actionType=getSubPricesByPrizeID&causeId=' . urlencode($causeID) . '&allPrizeId=' . $allPrizes['id'];
          $packageId = file_get_contents($getPackageIDs);
          $PackagesId = $packageId !== false ? json_decode($packageId, true) : 0;
        ?> {
            number: <?= json_encode($counter); ?>,
            imageURL: <?= json_encode(baseURL . '/../uploads/' . $allPrizes['image']); ?>,
            title: <?= json_encode($allPrizes['title']); ?>,
            packageIds: <?= $PackagesId  ?>
          },
        <?php $counter++;
        } ?>
      ],
      grandPrize: {
        <?php if (!empty($getAllGrandPrizes)) {
          $GrandPrize = $getAllGrandPrizes[0];
          $getPackageIDs = $getPackagesId;
        ?>
          number: 1,
          packageIds: <?= $getPackageIDs   ?>,
          imageURL: <?= json_encode(baseURL . '/../uploads/grand_prizes/' . $GrandPrize['grand_prize_file']); ?>,
          defaultAmount: 100000,
          description: <?= json_encode($GrandPrize['grand_prize_title']); ?>
        <?php } ?>
      },
      gifts: [{
        id: 1,
        title: "2 days of Tesla 3 rental worth $1,000",
        imageURL: "<?= homeURL; ?>/images/prizes/prize1.jpg"
      }]
    },



    partners: {
      heading: "Donors & Teams",
      donors: [
        <?php foreach ($getDonations as $donation) { ?> {
            id: <?= json_encode($donation['doid']); ?>,
            name: <?= json_encode($donation['is_anonymous'] == 1 ? "Anonymous" : $donation['fname'] . ' ' . $donation['lname']); ?>,
            amount: <?= json_encode($donation['usd_amount']); ?>,
            comment: <?= json_encode($donation['comments']); ?>,
            time: "timeAgo placeholder",
            teamName: <?= json_encode($donation['display_name']); ?>
          },
        <?php } ?>
      ],
      teamMembers: [
        <?php foreach ($getTeams as $team) { ?> {
            id: <?= json_encode($team['team_id']); ?>,
            name: <?= json_encode($team['display_name']); ?>,
            totalDonations: <?= json_encode($team['total_donations']); ?>,
            amountRaised: <?= json_encode($team['total_amount']); ?>,
            teamGoal: <?= json_encode($team['team_goal']); ?>,
            teamSlug: <?= json_encode($team['team_slug']); ?>,
            linkUrl: "team link placeholder" // Modify as needed
          },
        <?php } ?>
      ],
      teamDoners: [
        <?php if (isset($getTeamsDonationsc)) {
          foreach ($getTeamsDonationsc as $teamDonation) { ?> {
              id: <?= json_encode($teamDonation['doid']); ?>,
              name: <?= json_encode($teamDonation['is_anonymous'] == 1 ? "Anonymous" : $teamDonation['fname'] . ' ' . $teamDonation['lname']); ?>,
              amount: <?= json_encode($teamDonation['usd_amount']); ?>,
              comment: <?= json_encode($teamDonation['comments']); ?>,
              time: "timeAgo placeholder",
              teamName: <?= json_encode($teamDonation['display_name']); ?>
            },
        <?php }
        } ?>
      ]
    },
    donations: [{
        name: "Alex Fried",
        amount: 1000,
        timestamp: Date.now()
      },
      {
        name: "Alex Fried",
        amount: 1800,
        timestamp: Date.now()
      },
      {
        name: "Alex Fried",
        amount: 3000,
        timestamp: Date.now()
      },
    ],
    cart: {
      heading: "Checkout",
      ticketsTitle: "Your Donation:",
      giftsTitle: "Selected Gifts",
    },
    aboutCampaign: {
      heading: "ABOUT THE CAMPAIGN",
      text: "",
      button: [{
        text: "More About CCHF",
        link: "#",
      }],
    },
    gallery: [{
      id: 1,
      title: "Lorem ipsum dolor sit amet",
      imageURL: "<?= homeURL; ?>/images/gallery/gallery-img1.jpg",
      linkUrl: ""
    }, ],
    galleryTitle: "Gallery",
    teamTitle: {
      title: "<?= $team_panel_title ?>",
      slug: "<?= $team_panel_slug ?>",
      donationsCount: <?= $donationsCount ?>,
      teamsCount: <?= $teamsCount ?>,
      teamsDonationCount: <?= !empty($teamsDonationsCount) ? $teamsDonationsCount : "0" ?>,
    },
    campaignSettings: {
      showDoners: <?= $show_donors ?>,
    },
    earlyBird: {
      banner: "<?= isset($earlyBirdBanner) ? $earlyBirdBanner : "" ?>",
    },
    footer: {
      footerTitle: "<?= $legalName ?>",
      taxId: "<?= $taxID ?>",
      addressLine1: "<?= $address ?>",
      addressLine2: "<?= $address2 ?>",
      country: "",
      email: "<?= $orgEmail ?>",
      phone: "<?= $phone ?>",
      terms: <?php echo json_encode($rules); ?>,
    }

  };
</script>