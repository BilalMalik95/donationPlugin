import formatDate from "./dateFormatter.js";
import { CountUp } from "./countUp.min.js";

$(document).ready(function () {
  // alert("hi");
  // toggleMenu();
  // populateLogo();
  // renderMenu(siteContent.mainMenu, ".main-menu");
  // renderMenu(siteContent.secondaryMenu, ".secondary-menu");
  renderPromoContent();
  renderPrizes();
  renderGifts();
  renderDonors();
  renderTeamMembers();
  renderTeamDonors();

  // handleRafflePosition();
  setTimeout(function () {
    handleRafflePosition();
  }, 300);
  renderGallerySlides();
  floatingBtnVisibility();
  // displayDonations();

  function getTicketData(ticketID) {
    const grandPrize = siteContent.tickets.grandPrize.packageIds.includes(
      ticketID
    )
      ? siteContent.tickets.grandPrize
      : null;

    const ticket = siteContent.tickets.packages.find((p) => p.id === ticketID);

    const entryPluralized = ticket.entry === 1 ? "entry" : "entries";

    return {
      grandPrize,
      ticket,
      entryPluralized,
    };
  }

  function isVideoUrl(url) {
    var videoExtensions = ["mp4", "webm", "ogg"];
    let extension = url.split(".").pop().toLowerCase();
    return videoExtensions.includes(extension.trim());
  }

  function formatNumber(number) {
    if (number >= 1000) {
      return number / 1000 + "k";
    } else {
      return number.toString();
    }
  }

  function formatCurrency(
    amount,
    minimumFractionDigits,
    maximumFractionDigits
  ) {
    amount = parseInt(amount);
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
    });
  }

  function calculateProgress(amountRaised, goal) {
    if (!goal || goal <= 0) {
      return 0;
    }
    const progress = (amountRaised / goal) * 100;
    const roundedProgress = Math.round(progress);
    return roundedProgress;
  }

  function updateColumns(activePrizesLength) {
    let columns;
    if (activePrizesLength > 7) {
      columns = "3";
    } else if (activePrizesLength > 3) {
      columns = "2";
    } else {
      columns = "1";
    }

    $(".cart__summary-block").css("columns", columns);
  }

  function renderMenu(menu, targetClass) {
    menu.forEach(function (item) {
      $(targetClass).append(
        $("<li>").append($("<a>", { href: item.link, text: item.text }))
      );
    });
  }

  function handleRafflePosition() {
    handleRafflePositionMobile();
    $(window).resize(handleRafflePositionMobile);
    handleRafflePositionHeight();
  }

  function handleRafflePositionMobile() {
    const windowWidth = $(window).width();
    const raffleOffer = $(".raffle-offer");
    const mobileContainer = $(".about__mobile-container");
    const promoContainer = $(".promo__content-wrapper");

    const isMobileContainer =
      mobileContainer.length &&
      raffleOffer.parent().hasClass("about__mobile-container");
    const isPromoContainer =
      promoContainer.length &&
      raffleOffer.parent().hasClass("promo__content-wrapper");

    if ($(".raffle-offer").hasClass("static")) {
      return;
    }

    if (windowWidth <= 991 && isMobileContainer) {
      return;
    } else if (windowWidth > 991 && isPromoContainer) {
      return;
    }

    if (windowWidth <= 991) {
      raffleOffer.prependTo(mobileContainer);
    } else {
      raffleOffer.appendTo(promoContainer);
    }
  }

  function handleRafflePositionHeight() {
    let bannerHeight;
    let promoContentHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      const isHeaderFixedHeight = $("body").hasClass("header-fixed") ? 150 : 30;
      const raffleOffer = $(".raffle-offer");
      const aboutInfoWrapper = $(".about-info__wrapper");

      if ($(window).width() < 992) {
        aboutInfoWrapper.removeClass("flex");
        return;
      }

      for (const entry of entries) {
        if (entry.target.className === "promo__images") {
          bannerHeight = entry.target.clientHeight;
        }
        if (entry.target.className === "raffle-offer") {
          promoContentHeight = entry.target.clientHeight;
        }
      }

      if (bannerHeight === 0) return;
      if (bannerHeight <= promoContentHeight + isHeaderFixedHeight) {
        aboutInfoWrapper.addClass("flex");
        raffleOffer.appendTo(aboutInfoWrapper);
      } else {
        aboutInfoWrapper.removeClass("flex");
      }
    });

    $(".promo__images, .raffle-offer").each(function () {
      resizeObserver.observe(this);
    });
  }

  function populateLogo() {
    const logoExtension = siteContent.logo.img.split(".").pop().toLowerCase();

    if (siteContent.logo.text) {
      const logoTitle = siteContent.logo.text.split(" ");
      let remaingWords = logoTitle.slice(1);
      remaingWords = remaingWords.join(" ");

      const Logo = () => `
        <span class="overlay">
        </span>
        <span class="logo-content"><b>${logoTitle[0]}</b> ${remaingWords}</span>
      `;
      $(".logo").html(Logo);
    }

    if (logoExtension === "svg") {
      // Handle SVG
      $.get(
        siteContent.logo.img,
        function (data) {
          var $svg = $(data).find("svg");

          $svg.find("[fill]").attr("fill", "var(--accent-color)");

          $(".logo span.overlay").append($svg);
        },
        "xml"
      );
    } else {
      const imageElement = new Image();
      imageElement.src = siteContent.logo.img;
      imageElement.height = 50;
      $(".logo").html(imageElement);
    }
  }

  // Close menu
  function toggleMenu() {
    const links = $(".menu a");

    links.on("click", function () {
      $("#menu-toggle").prop("checked", false);
    });

    // Mobile menu toggle
    function toggleCheckbox(checkbox) {
      checkbox.prop("checked", !checkbox.prop("checked"));
    }

    const checkboxBtn = $("#menu-toggle");
    const labelBtn = $('label[for="menu-toggle"]');

    labelBtn.on("click", function (e) {
      e.preventDefault();
      toggleCheckbox(checkboxBtn);
      $(".menu").slideToggle();
    });
  }

  // Populate promo content

  function renderPromoContent() {
    $(".promo__title").html(
      `${siteContent.promo.title} <mark>${siteContent.promo.titleAmount}</mark>`
    );

    let promoUrl = siteContent.promo.imageURL;

    if (isVideoUrl(promoUrl)) {
      $(".promo__video video").attr("src", promoUrl);
      $(".promo__images img").hide();
      $(".promo__video").show();
    } else {
      if (siteContent.promo.isImgBg == "1") {
        $(".promo").css("background-image", "url(" + promoUrl + ")");
        $(".promo").css("border-radius", "0px 0px 50px 50px");
        $(".promo__images").hide();
        $(".promo__video").hide();
      } else {
        $(".promo__images img").attr("src", promoUrl);
        $(".promo__video").hide();
        $(".promo__images img").show();
      }
    }
    $(".promo__subtitle").text(siteContent.promo.subtitle);
    $(".promo__content .btn").text(siteContent.promo.button[0].text);
    $(".promo__content .btn").addClass(siteContent.promo.button[0].class);
    $(".promo__content .promo__link span").addClass(
      siteContent.promo.link[0].class
    );
    $(".promo__link").addClass(siteContent.promo.link[0].class);
    $(".promo__content .btn").attr("href", siteContent.promo.button[0].link);
    $(".promo__content .promo__link span").text(siteContent.promo.link[0].text);
    $(".promo__content .promo__link").attr(
      "href",
      siteContent.promo.link[0].link
    );
  }
  // Populate about section
  $(".about__info .section-title").text(siteContent.about.title);
  $(".about__info .text").html(siteContent.about.description);
  $(".about__info .btn").text(siteContent.about.button[0].text);
  $(".about__info .btn").addClass(siteContent.about.button[0].class);
  $(".about__info .btn").attr("href", siteContent.about.button[0].link);
  if (siteContent.earlyBird.banner) {
    let newImage = $("<img class='mt-5'>").attr(
      "src",
      siteContent.earlyBird.banner
    );
    $(".text-img").html(newImage);
  }
  // Populate additional section
  $(".additionalContent .text").html(siteContent.about.additionalContent);
  // Populate team overview
  $(".team-overview-wrapper .text-link span").text(
    //siteContent.teamOverview.campaignLink[0].text
    "Visit Campaign Homepage"
  );
  $(".team-overview-wrapper .text-link").attr(
    "href",
    siteContent.teamOverview.campaignLink[0].link
  );
  $(".team-overview .team-overview__owner").text(
    siteContent.teamOverview.teamOwner
  );
  $("#team-overview-raised").text(
    formatCurrency(siteContent.teamOverview.raised)
  );
  $("#team-overview-goal").text(
    formatCurrency(siteContent.teamOverview.goal, 0, 0)
  );
  $("#team-overview-donors").text(siteContent.teamOverview.donors);
  $(".team-overview__progress .percentage").html(
    calculateProgress(
      siteContent.teamOverview.raised,
      siteContent.teamOverview.goal
    ) + "%"
  );
  $(".team-overview__progress .goal").html(
    `of ${formatCurrency(siteContent.teamOverview.goal)}`
  );
  $(".team-overview__progress-bar .progress-inner").css(
    "width",
    `${calculateProgress(
      siteContent.teamOverview.raised,
      siteContent.teamOverview.goal
    )}%`
  );
  // Populate raffle offer content
  const formattedDate = formatDate(siteContent.raffleOffer.drawingDate);

  const RaffleOffer = () => {
    const isRegularTemplate = $(".raffle-offer").hasClass("static");

    return `<div class="raffle-offer__timer overlay">
      <ul class="timer__items">
        <li class="timer__item timer__days">00</li>
        <li class="timer__item timer__hours">00</li>
        <li class="timer__item timer__minutes">00</li>
        <li class="timer__item timer__seconds">00</li>
      </ul>
    </div>
    <div class="raffle-offer__body">
      <p class="raffle-offer__body-title">Drawing <mark>${formattedDate}</mark></p>
      <div class="raffle-offer__progress">
        <div class="raffle-offer__progress-inner" style="width:${
          siteContent.raffleOffer.progressPercentage
        }%"></div>
      </div>
      <p class="raffle-offer__amount">${formatCurrency(
        siteContent.raffleOffer.amount
      )}</p>
      <span class="raffle-offer__subtitle">${
        siteContent.raffleOffer.progressPercentage
      }% of ${formatCurrency(siteContent.raffleOffer.targetAmount)}</span>
    </div>
    <div class="raffle-offer__btn">
      ${
        isRegularTemplate
          ? `<button class="btn overlay" data-bs-toggle="collapse" data-bs-target="#collapseCart">Donate</button>`
          : `<a href=${siteContent.raffleOffer.button[0].link} class="btn overlay">${siteContent.raffleOffer.button[0].text}</a>`
      }
    </div>`;
  };

  $(".raffle-offer").html(RaffleOffer);

  let ticketAmount = null;

  $("#regularAmount").on("input", function () {
    let inputValue = $(this).val().replace(/\D/g, "");
    ticketAmount = inputValue;

    if (parseInt(inputValue) <= 0) {
      inputValue = "";
    }

    $(this).val(inputValue);

    if ($(this).val()) {
      $(".checkout-btn__amount, .checkout-btn .divider").css(
        "display",
        "block"
      );
      $(".checkout-btn__amount").html(`${formatCurrency(inputValue)}`);
    } else {
      $(".checkout-btn__amount, .checkout-btn .divider").css("display", "none");
    }
  });

  //Raffle Timer
  function raffleTimer() {
    const deadline = siteContent.raffleOffer.drawingDate;
    let timerId = null;

    function pluralize(num, words) {
      return num === 1 ? words[0] : words[1];
    }

    function countdownTimer() {
      const diff = deadline - new Date();
      if (diff <= 0) {
        clearInterval(timerId);
      }
      const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
      const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
      const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
      const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

      const $days = document.querySelector(".timer__days");
      const $hours = document.querySelector(".timer__hours");
      const $minutes = document.querySelector(".timer__minutes");
      const $seconds = document.querySelector(".timer__seconds");

      if ($days && $hours && $minutes && $seconds) {
        $days.textContent = days < 10 ? "0" + days : days;
        $hours.textContent = hours < 10 ? "0" + hours : hours;
        $minutes.textContent = minutes < 10 ? "0" + minutes : minutes;
        $seconds.textContent = seconds < 10 ? "0" + seconds : seconds;
        $days.dataset.title = pluralize(days, ["Day", "Days"]);
        $hours.dataset.title = pluralize(hours, ["Hour", "Hours"]);
        $minutes.dataset.title = pluralize(minutes, ["Min", "Mins"]);
        $seconds.dataset.title = pluralize(seconds, ["Sec", "Secs"]);
      }
    }

    countdownTimer();

    timerId = setInterval(countdownTimer, 1000);
  }

  raffleTimer();

  //Number Counter
  function startCounters() {
    const Item = ({ id, text }) => `
      <dl>
        <dd id=${id}>0</dd>
        <dt>${text.replace(/\n/g, "<br>")}</dt>
        </dl>
      <span class="divider"></span>
    `;

    const filteredArr = siteContent.countersStatistic.filter(
      (obj) => obj.hidden !== "1"
    );

    if (filteredArr.length !== 0) {
      $(".about__statistics-list").html(filteredArr.map(Item).join(""));

      $(".about__statistics-list span:last-child").remove();

      filteredArr.forEach((config) => {
        const counter = new CountUp(config.id, config.value);
        counter.start();
      });
    } else {
      $(".about__statistics").remove();
    }
  }

  startCounters();

  // Populate footer address
  const phoneTrimmed = siteContent.footer.phone.replace(/\s/g, "");

  const Address = () => `
    <h2>${siteContent.footer.footerTitle}</h2>
    <address>
      <p>${siteContent.footer.addressLine1}<br>
      ${siteContent.footer.addressLine2}<br>
      ${siteContent.footer.country}
      </p><br>
      <a class="footer__email" href="mailto:${siteContent.footer.email}">${siteContent.footer.email}</a>
      <a href="tel:${phoneTrimmed}">${siteContent.footer.phone}</a>
    </address>
    <br>
    <h2>Tax ID : ${siteContent.footer.taxId}</h2>
  `;

  // $(".footer__address").html(Address);

  // siteContent.footer.terms.forEach(function (item) {
  //   $(".footer__terms").append("<p id='text'>" + item + "</p>");
  // });

  // Populate tickets section
  $(".tickets .section-title").text(siteContent.tickets.title);

  // Populate ticket packages
  function renderTicketPages() {
    const highestGrandPrize = siteContent.tickets.packages.reduce(
      (max, current) => (current.grandPrize > max ? current.grandPrize : max),
      0
    );

    const isTwoColumns = $(window).width() > 991 || $(window).width() < 768;
    const packagesLength = siteContent.tickets.packages.length;

    if (
      (!isTwoColumns && packagesLength % 3 !== 0) ||
      (isTwoColumns && packagesLength % 2 !== 0)
    ) {
      $("#options-grid__label").addClass("hide");
    }

    const TicketPackage = ({
      id,
      amount,
      entry,
      grandPrize,
      prizesAmount,
      prizes,
    }) => {
      const prizeDescription =
        prizes === prizesAmount
          ? `All ${prizesAmount} Prizes`
          : `${prizes}<span>/${prizesAmount}</span> Prizes`;

      const colorClass = grandPrize > 0 ? "blue" : "";
      const topPrize = grandPrize > 0 ? grandPrize : highestGrandPrize;

      return `<label class="option-card" data-id="${id}">
        <input class="card-input" type="radio" name="option-card" />
        <div class="card-body">
          <span class="option-card__checkbox overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="17.87" height="12.849" viewBox="0 0 17.87 12.849">
              <g id="Group_2" data-name="Group 2" transform="translate(-436.858 -1650.344)">
                <rect id="Rectangle_31" data-name="Rectangle 31" width="10" height="3" rx="1.5"
                  transform="translate(438.979 1654) rotate(45)" fill="#fff" />
                <rect id="Rectangle_32" data-name="Rectangle 32" width="15" height="3" rx="1.5"
                  transform="translate(442 1660.95) rotate(-45)" fill="#fff" />
              </g>
            </svg>
          </span>
          <div class="option-card__header d-flex align-items-center justify-content-between">
            <span class="option-card__amount">${formatCurrency(
              amount,
              0,
              0
            )}</span>
            <div class="voucher">
              <span class="entry-number">${entry}</span>
              <span class="entry-label">${
                entry === 1 ? `Entry` : `Entries`
              }</span>
            </div>
          </div>
          <span class="divider"></span>
          <div class="d-flex align-items-center justify-content-between">
            <div class="option-card__grand-prize ${colorClass} ">
              ${
                grandPrize === 0
                  ? `<svg xmlns="http://www.w3.org/2000/svg" width="37.074" height="29.372" viewBox="0 0 37.074 29.372">
                    <path id="Path_20" data-name="Path 20" d="M13.959,13.892a10.2,10.2,0,0,0,9.249,0c2.552-1.478,2.53-3.878-.03-5.356a10.2,10.2,0,0,0-9.249,0C11.384,10.014,11.4,12.407,13.959,13.892Zm1.173-2.56c.2-.061.389-.13.579-.19a.4.4,0,0,1,.29-.023.259.259,0,0,1,.091.107,2.049,2.049,0,0,0,.61.655.97.97,0,0,0,.145.1,1.774,1.774,0,0,0,.5.19c.5.107.937-.084.884-.389a.7.7,0,0,0-.137-.3,5.506,5.506,0,0,1-.5-.747c-.183-.427-.1-.808.488-1.112a3.024,3.024,0,0,1,2.2-.152c.32.091.32.091.571-.053.084-.046.168-.1.251-.145a.356.356,0,0,1,.45,0c.061.03.114.069.175.1.4.229.4.229.008.465-.282.16-.282.16-.046.35a2.062,2.062,0,0,1,.434.465c.061.091.023.16-.122.206-.221.069-.442.145-.663.213a.407.407,0,0,1-.282.015.39.39,0,0,1-.091-.1,1.848,1.848,0,0,0-.663-.61c-.038-.023-.084-.046-.13-.069a1.668,1.668,0,0,0-.312-.122c-.427-.1-.8.061-.747.328a.9.9,0,0,0,.19.381,5.574,5.574,0,0,1,.427.648c.358.716-.419,1.417-1.661,1.486a3.439,3.439,0,0,1-1.265-.16.481.481,0,0,0-.434.038c-.13.084-.274.16-.4.236a.365.365,0,0,1-.373.008c-.091-.046-.175-.1-.267-.145-.061-.038-.122-.069-.183-.107-.13-.076-.114-.152.008-.229.1-.061.2-.114.29-.175.221-.13.221-.137.038-.282a2.4,2.4,0,0,1-.564-.587C14.843,11.462,14.866,11.424,15.133,11.332Zm8.907,3.032a2.809,2.809,0,0,1,2.56,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0A.785.785,0,0,1,24.039,14.365Zm-13.5-7.794a2.825,2.825,0,0,1,2.568,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0C9.838,7.645,9.83,6.982,10.538,6.571ZM.946,9.748,21.159,21.412a4.633,4.633,0,0,0,4.221,0l10.827-6.293a1.294,1.294,0,0,0-.008-2.446L15.986,1a4.673,4.673,0,0,0-4.229,0L.931,7.3A1.294,1.294,0,0,0,.946,9.748ZM5.335,7.271a3.42,3.42,0,0,0-.411-.2l6.469-3.756a2.453,2.453,0,0,0,.343.236,4.721,4.721,0,0,0,4.274,0,1.8,1.8,0,0,0,.35-.251L32.1,12.391a3.437,3.437,0,0,0-.587.267,1.307,1.307,0,0,0,.015,2.476,3.518,3.518,0,0,0,.594.267l-6.529,3.794a2.535,2.535,0,0,0-.465-.343,4.7,4.7,0,0,0-4.274,0,1.958,1.958,0,0,0-.244.168L4.916,9.953a3.165,3.165,0,0,0,.427-.206A1.308,1.308,0,0,0,5.335,7.271ZM.42,12.079a2.06,2.06,0,0,1,1.806.061l21.12,12.19,11.421-6.636a1.97,1.97,0,0,1,1.8,0,.551.551,0,0,1,.008,1.044L24.435,25.793a2.389,2.389,0,0,1-2.156,0l-.427-.244-.3-.175L.375,13.153C-.136,12.848-.128,12.361.42,12.079ZM36.6,22.555,24.458,29.61a2.389,2.389,0,0,1-2.156,0l-.427-.244-.3-.175L.4,16.963c-.518-.3-.5-.785.046-1.074a2.06,2.06,0,0,1,1.806.061l21.12,12.19,11.413-6.628a1.986,1.986,0,0,1,1.806,0A.552.552,0,0,1,36.6,22.555Z" transform="translate(0 -0.495)" fill="currentColor"/>
                  </svg>`
                  : grandPrize < highestGrandPrize
                  ? `<svg xmlns="http://www.w3.org/2000/svg" width="37.074" height="25.555"
                      viewBox="0 0 37.074 25.555">
                      <path id="Path_20" data-name="Path 20"
                        d="M13.959,13.892a10.2,10.2,0,0,0,9.249,0c2.552-1.478,2.53-3.878-.03-5.356a10.2,10.2,0,0,0-9.249,0C11.384,10.014,11.4,12.407,13.959,13.892Zm1.173-2.56c.2-.061.389-.13.579-.19a.4.4,0,0,1,.29-.023.259.259,0,0,1,.091.107,2.049,2.049,0,0,0,.61.655.97.97,0,0,0,.145.1,1.774,1.774,0,0,0,.5.19c.5.107.937-.084.884-.389a.7.7,0,0,0-.137-.3,5.506,5.506,0,0,1-.5-.747c-.183-.427-.1-.808.488-1.112a3.024,3.024,0,0,1,2.2-.152c.32.091.32.091.571-.053.084-.046.168-.1.251-.145a.356.356,0,0,1,.45,0c.061.03.114.069.175.1.4.229.4.229.008.465-.282.16-.282.16-.046.35a2.062,2.062,0,0,1,.434.465c.061.091.023.16-.122.206-.221.069-.442.145-.663.213a.407.407,0,0,1-.282.015.39.39,0,0,1-.091-.1,1.848,1.848,0,0,0-.663-.61c-.038-.023-.084-.046-.13-.069a1.668,1.668,0,0,0-.312-.122c-.427-.1-.8.061-.747.328a.9.9,0,0,0,.19.381,5.574,5.574,0,0,1,.427.648c.358.716-.419,1.417-1.661,1.486a3.439,3.439,0,0,1-1.265-.16.481.481,0,0,0-.434.038c-.13.084-.274.16-.4.236a.365.365,0,0,1-.373.008c-.091-.046-.175-.1-.267-.145-.061-.038-.122-.069-.183-.107-.13-.076-.114-.152.008-.229.1-.061.2-.114.29-.175.221-.13.221-.137.038-.282a2.4,2.4,0,0,1-.564-.587C14.843,11.462,14.866,11.424,15.133,11.332Zm8.907,3.032a2.809,2.809,0,0,1,2.56,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0A.785.785,0,0,1,24.039,14.365Zm-13.5-7.794a2.825,2.825,0,0,1,2.568,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0C9.838,7.645,9.83,6.982,10.538,6.571ZM.946,9.748,21.159,21.412a4.633,4.633,0,0,0,4.221,0l10.827-6.293a1.294,1.294,0,0,0-.008-2.446L15.986,1a4.673,4.673,0,0,0-4.229,0L.931,7.3A1.294,1.294,0,0,0,.946,9.748ZM5.335,7.271a3.42,3.42,0,0,0-.411-.2l6.469-3.756a2.453,2.453,0,0,0,.343.236,4.721,4.721,0,0,0,4.274,0,1.8,1.8,0,0,0,.35-.251L32.1,12.391a3.437,3.437,0,0,0-.587.267,1.307,1.307,0,0,0,.015,2.476,3.518,3.518,0,0,0,.594.267l-6.529,3.794a2.535,2.535,0,0,0-.465-.343,4.7,4.7,0,0,0-4.274,0,1.958,1.958,0,0,0-.244.168L4.916,9.953a3.165,3.165,0,0,0,.427-.206A1.308,1.308,0,0,0,5.335,7.271ZM.42,12.079a2.06,2.06,0,0,1,1.806.061l21.12,12.19,11.421-6.636a1.97,1.97,0,0,1,1.8,0,.551.551,0,0,1,.008,1.044L24.435,25.793a2.389,2.389,0,0,1-2.156,0l-.427-.244-.3-.175L.375,13.153C-.136,12.848-.128,12.361.42,12.079Z"
                        transform="translate(0 -0.495)" fill="currentColor" />
                      </svg>`
                  : `<svg xmlns="http://www.w3.org/2000/svg" width="37.074" height="29.372" viewBox="0 0 37.074 29.372">
                        <path id="Path_20" data-name="Path 20" d="M13.959,13.892a10.2,10.2,0,0,0,9.249,0c2.552-1.478,2.53-3.878-.03-5.356a10.2,10.2,0,0,0-9.249,0C11.384,10.014,11.4,12.407,13.959,13.892Zm1.173-2.56c.2-.061.389-.13.579-.19a.4.4,0,0,1,.29-.023.259.259,0,0,1,.091.107,2.049,2.049,0,0,0,.61.655.97.97,0,0,0,.145.1,1.774,1.774,0,0,0,.5.19c.5.107.937-.084.884-.389a.7.7,0,0,0-.137-.3,5.506,5.506,0,0,1-.5-.747c-.183-.427-.1-.808.488-1.112a3.024,3.024,0,0,1,2.2-.152c.32.091.32.091.571-.053.084-.046.168-.1.251-.145a.356.356,0,0,1,.45,0c.061.03.114.069.175.1.4.229.4.229.008.465-.282.16-.282.16-.046.35a2.062,2.062,0,0,1,.434.465c.061.091.023.16-.122.206-.221.069-.442.145-.663.213a.407.407,0,0,1-.282.015.39.39,0,0,1-.091-.1,1.848,1.848,0,0,0-.663-.61c-.038-.023-.084-.046-.13-.069a1.668,1.668,0,0,0-.312-.122c-.427-.1-.8.061-.747.328a.9.9,0,0,0,.19.381,5.574,5.574,0,0,1,.427.648c.358.716-.419,1.417-1.661,1.486a3.439,3.439,0,0,1-1.265-.16.481.481,0,0,0-.434.038c-.13.084-.274.16-.4.236a.365.365,0,0,1-.373.008c-.091-.046-.175-.1-.267-.145-.061-.038-.122-.069-.183-.107-.13-.076-.114-.152.008-.229.1-.061.2-.114.29-.175.221-.13.221-.137.038-.282a2.4,2.4,0,0,1-.564-.587C14.843,11.462,14.866,11.424,15.133,11.332Zm8.907,3.032a2.809,2.809,0,0,1,2.56,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0A.785.785,0,0,1,24.039,14.365Zm-13.5-7.794a2.825,2.825,0,0,1,2.568,0,.785.785,0,0,1,.008,1.486,2.809,2.809,0,0,1-2.56,0C9.838,7.645,9.83,6.982,10.538,6.571ZM.946,9.748,21.159,21.412a4.633,4.633,0,0,0,4.221,0l10.827-6.293a1.294,1.294,0,0,0-.008-2.446L15.986,1a4.673,4.673,0,0,0-4.229,0L.931,7.3A1.294,1.294,0,0,0,.946,9.748ZM5.335,7.271a3.42,3.42,0,0,0-.411-.2l6.469-3.756a2.453,2.453,0,0,0,.343.236,4.721,4.721,0,0,0,4.274,0,1.8,1.8,0,0,0,.35-.251L32.1,12.391a3.437,3.437,0,0,0-.587.267,1.307,1.307,0,0,0,.015,2.476,3.518,3.518,0,0,0,.594.267l-6.529,3.794a2.535,2.535,0,0,0-.465-.343,4.7,4.7,0,0,0-4.274,0,1.958,1.958,0,0,0-.244.168L4.916,9.953a3.165,3.165,0,0,0,.427-.206A1.308,1.308,0,0,0,5.335,7.271ZM.42,12.079a2.06,2.06,0,0,1,1.806.061l21.12,12.19,11.421-6.636a1.97,1.97,0,0,1,1.8,0,.551.551,0,0,1,.008,1.044L24.435,25.793a2.389,2.389,0,0,1-2.156,0l-.427-.244-.3-.175L.375,13.153C-.136,12.848-.128,12.361.42,12.079ZM36.6,22.555,24.458,29.61a2.389,2.389,0,0,1-2.156,0l-.427-.244-.3-.175L.4,16.963c-.518-.3-.5-.785.046-1.074a2.06,2.06,0,0,1,1.806.061l21.12,12.19,11.413-6.628a1.986,1.986,0,0,1,1.806,0A.552.552,0,0,1,36.6,22.555Z" transform="translate(0 -0.495)" fill="currentColor"/>
                      </svg>`
              }
              <span class="option-card__grand-prize-amount">$${formatNumber(
                topPrize
              )} Cash</span>
            </div>
            <span class="option-card__plus">+</span>
            <div class="option-card__prizes">
              <svg xmlns="http://www.w3.org/2000/svg" width="19.813" height="20" viewBox="0 0 19.813 20">
                <g id="Group_28" data-name="Group 28" transform="translate(-3.112 -3)">
                  <path id="Path_18" data-name="Path 18"
                    d="M21.456,6.861h-2.15A2.708,2.708,0,0,0,19.269,4.5a2.741,2.741,0,0,0-4.649-.38l-1.6,2.178-1.6-2.176a2.741,2.741,0,0,0-4.648.375,2.711,2.711,0,0,0-.038,2.369H4.574A1.466,1.466,0,0,0,3.112,8.33v1.56a1.459,1.459,0,0,0,1.461,1.461H21.456a1.466,1.466,0,0,0,1.469-1.461V8.33A1.473,1.473,0,0,0,21.456,6.861Zm-5.5-1.768a1.089,1.089,0,0,1,1.846.151,1.094,1.094,0,0,1-.959,1.591l-2.18.015ZM8.239,5.24a1.088,1.088,0,0,1,1.845-.146L11.377,6.85,9.2,6.835A1.093,1.093,0,0,1,8.239,5.24Z"
                    fill="var(--accent-color)" />
                  <path id="Path_19" data-name="Path 19"
                    d="M4.787,22.582A2.424,2.424,0,0,0,7.214,25H19.382a2.424,2.424,0,0,0,2.427-2.419V15H4.787Z"
                    transform="translate(-0.279 -2.001)" fill="var(--accent-color)" />
                </g>
              </svg>
              <p class="option-card__prizes-desc desktop">${prizeDescription}</p>
              <p class="option-card__prizes-desc mobile">${prizes}/<span>${prizesAmount}</span> Prizes</p>
            </div>
          </div>
        </div>
      </label>
    `;
    };

    $(".options-grid").prepend(
      siteContent.tickets.packages.map(TicketPackage).join("")
    );
  }

  renderTicketPages();

  //Select the nearest card amount rounding down
  $("#customAmount, #regularAmount").on("blur", function () {
    let inputVal = $(this).val();
    let formattedValue = parseInt(inputVal).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
    if (isNaN(parseFloat(formattedValue))) {
      formattedValue = "";
    }
    $(this).val(formattedValue);
  });

  $("#customAmount, #regularAmount").on("focus", function () {
    let formattedValue = $(this).val().replace(/,/g, "");

    if (formattedValue.includes(".00")) {
      formattedValue = formattedValue.replace(".00", "");
    }
    $(this).val(formattedValue);
  });

  $("#customAmount").on("input", function () {
    var timeout;
    clearTimeout(timeout);

    var inputValue = $(this).val().replace(/\D/g, "");
    ticketAmount = inputValue;

    if (parseInt(inputValue) <= 0) {
      inputValue = "";
    }

    $(this).val(inputValue);
    $("#donate_amount").val(inputValue);
    $("#usd_amount").val(inputValue);
    $("#pricing_options").val("");
    var proFeeAmt = $("#fee_percentage").val();
    var processFee = (inputValue * proFeeAmt) / 100;
    var currency = "$";
    $("#process_fee").html(
      "Add " +
        currency +
        processFee.toFixed(2) +
        " to your payment to cover the " +
        proFeeAmt +
        "% credit card processing fee"
    );
    $("#don_process_fee").val(processFee.toFixed(2));
    $("#rec_amount_full").html(currency + inputValue);

    var cards = $(".options-grid .option-card");
    var selectedCard = null;
    var closestDifference = Infinity;

    cards.find("input[name='option-card']").prop("checked", false);
    $(".prizes-grid .prize").removeClass("selected");
    $(".cart").slideUp();

    timeout = setTimeout(function () {
      cards.each(function () {
        var card = $(this);
        var cardNumberValue = card.find(".option-card__amount").text();
        var cardNumber = parseInt(cardNumberValue.replace(/[\$,]/g, ""));
        var difference = inputValue - cardNumber;

        if (difference >= 0 && difference < closestDifference) {
          closestDifference = difference;
          selectedCard = card;
        }
      });

      $("#customAmountCard").addClass("selected");

      if (selectedCard) {
        const ticketId = selectedCard.data("id");

        const { grandPrize, ticket, entryPluralized } = getTicketData(ticketId);

        const titleString = grandPrize
          ? `<mark>$${inputValue}</mark> for ${
              ticket.entry
            } ${entryPluralized} to win ${formatNumber(
              ticket.grandPrize
            )} and ${ticket.prizes} selected prizes`
          : `<mark>$${inputValue}</mark> for ${ticket.entry} ${entryPluralized} to win the ${ticket.prizes} prizes.`;

        $(".card-input", selectedCard).prop("checked", true);
        handleFloatingBtnPosition(selectedCard);
        handleEvent(selectedCard, "click", true);

        $(".ticket-options__control-title").html(titleString);

        $(".cart").slideDown();
      } else if (closestDifference && inputValue) {
        const lowestTicketAmount = Math.min.apply(
          null,
          siteContent.tickets.packages.map(function (p) {
            return p.amount;
          })
        );
        const addValue = lowestTicketAmount - inputValue;

        $(".prizes__subtitle").html(
          "Select a ticket<br> to see the included prizes"
        );

        $(".ticket-options__control-title").html(
          `Add <mark>${formatCurrency(
            addValue
          )}</mark> to your donation to be entered to win a prize`
        );

        $(".checkout-btn__amount").html(`${formatCurrency(inputValue, 0, 0)}`);
        $(".js-cart-summary-amount").html(
          `${siteContent.cart.ticketsTitle} <span>${formatCurrency(
            inputValue
          )}</span>`
        );
        $(".selected-tickets .cart__summary-list").empty();
        $(".cart__subtitle, .entry-quantity").empty();
        $(".items-quantity").css("display", "none");
        cards.find("input[name='option-card']").prop("checked", false);

        $("#viewPrizes").removeClass("visible");
        $("#viewTicketOptions").addClass("animate");
        $(".cart").slideDown();
      } else {
        $(".ticket-options__control-title").html(
          `Enter custom amount to see entry details`
        );
        $("#customAmountCard").removeClass("selected");
        $(".cart").slideUp();
      }
    }, 1000);
  });

  // Populate prizes
  function renderPrizes() {
    const highestTicketGrandPrize = Math.max.apply(
      null,
      siteContent.tickets.packages.map(function (p) {
        return p.grandPrize;
      })
    );

    const Prize = ({ number, imageURL, title }) => `
    <div class="prize" data-number="${number}">
      <div class="prize__body">
        <span class="option-card__checkbox overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="17.87" height="12.849" viewBox="0 0 17.87 12.849">
            <g id="Group_2" data-name="Group 2" transform="translate(-436.858 -1650.344)">
              <rect id="Rectangle_31" data-name="Rectangle 31" width="10" height="3" rx="1.5"
                transform="translate(438.979 1654) rotate(45)" fill="#fff" />
              <rect id="Rectangle_32" data-name="Rectangle 32" width="15" height="3" rx="1.5"
                transform="translate(442 1660.95) rotate(-45)" fill="#fff" />
            </g>
          </svg>
        </span>
        <div class="prize__image">
          <img src="${imageURL}" alt="">
        </div>
        <div class="prize__desc">
          <div class="d-flex align-items-start">
            <span class="prize__number overlay">${number}</span>
            <p class="prize__name">${title}</p>
          </div>
          <div class="prize__btns">
            <button class="btn">Details</button>
            <button class="btn overlay">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  `;

    const GrandPrize = () => `
    <div class="prize grand-prize">
      <div class="prize__body">
        <span class="option-card__checkbox overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="17.87" height="12.849" viewBox="0 0 17.87 12.849">
            <g id="Group_2" data-name="Group 2" transform="translate(-436.858 -1650.344)">
              <rect id="Rectangle_31" data-name="Rectangle 31" width="10" height="3" rx="1.5"
                transform="translate(438.979 1654) rotate(45)" fill="#fff" />
              <rect id="Rectangle_32" data-name="Rectangle 32" width="15" height="3" rx="1.5"
                transform="translate(442 1660.95) rotate(-45)" fill="#fff" />
            </g>
          </svg>
        </span>
        <div class="grand-prize__img">
          <img src="${siteContent.tickets.grandPrize.imageURL}" alt="">
          <div class="position-relative z-1">
            <p class="grand-prize__amount">${formatCurrency(
              highestTicketGrandPrize,
              0,
              0
            )}</p>
            <span class="grand-prize__subtitle">Grand Prize</span>
            <!-- <p class="grand-prize__desc">${
              siteContent.tickets.grandPrize.description
            }</p> -->
            <button class="btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  `;

    $(".prizes-grid").html(
      `${GrandPrize()} ${siteContent.tickets.prizes.map(Prize).join("")}`
    );
  }

  $("#detailsSummaryBtnMobile, #checkoutSummaryBtnMobile").on(
    "click",
    function () {
      $(".cart-mobile__summary").css("display", "none");
      $(".cart__summary").css("display", "flex");
    }
  );

  $("#summaryCheckoutBtn").on("click", function () {
    const isExpanded = $(this).attr("aria-expanded");
    if ($(window).width() < 768 && isExpanded === "false") {
      $(".cart-mobile__summary").css("display", "block");
      $(".cart__summary").css("display", "none");
    }
  });

  $("#collapseCart").on("show.bs.collapse hide.bs.collapse", function (e) {
    const isRegularTemplate = $(".cart").hasClass("cart--regular");

    if (e.type === "show") {
      $(".cart__summary .checkout-btn").text("Back");
    } else {
      $(".cart__summary .checkout-btn").html(`<span>${
        isRegularTemplate ? "Donate" : "Checkout"
      }</span>
      <span class="divider"></span>
      <span class="checkout-btn__amount">${formatCurrency(
        ticketAmount,
        0,
        0
      )}</span>`);

      if (isRegularTemplate && ticketAmount > 0) {
        $(
          ".cart--regular .checkout-btn__amount, .cart--regular .checkout-btn .divider"
        ).css("display", "block");
      }
    }
  });

  $(".options-grid").on("click mouseenter", ".option-card", function (e) {
    if ($(e.target).is("input")) {
      return;
    }

    if (e.type === "click") {
      $("#customAmount").val("");
      handleFloatingBtnPosition(this);
    }

    handleEvent(this, e.type);
  });

  $(".options-grid .option-card").on("mouseleave", function () {
    $(".prizes-grid .prize").removeClass("highlighted");
    if (!$(".grand-prize").hasClass("selected")) {
      $(".grand-prize .grand-prize__amount").html(
        `${formatCurrency(siteContent.tickets.grandPrize.defaultAmount, 0, 0)}`
      );
    }
  });

  function handleFloatingBtnPosition(el) {
    const btnHalfHeight = $("#viewPrizes").height() / 2;
    const elHalfHeight = $(el).height() / 2;
    const elOffset = $(el).offset();
    const parentOffset = $(el).parent().offset();
    const topPosition =
      elOffset.top - parentOffset.top + elHalfHeight - btnHalfHeight;
    $("#viewPrizes")
      .css("margin-top", topPosition + "px")
      .addClass("visible");
    $("#viewTicketOptions").removeClass("animate").hide();
  }

  function floatingBtnVisibility() {
    $(document).on("scroll", function () {
      const scrollAmt = $(window).scrollTop();
      if ($("#prizesSection").length > 0) {
        const elementTop = $("#prizesSection").offset().top;
        if (scrollAmt + $(window).height() * 0.65 >= elementTop) {
          $("#viewPrizes").hide();
          $("#viewTicketOptions").css("display", "flex");
        } else {
          $("#viewPrizes").css("display", "flex");
          if ($("#viewPrizes").width() !== 0) {
            $("#viewTicketOptions").hide();
          }
        }
      }
    });
  }

  function handleEvent(el, type, suppressCustomAmountUnselect) {
    const ticketId = parseInt($(el).data("id"));
    const className = type === "click" ? "selected" : "highlighted";

    const { grandPrize, ticket, entryPluralized } = getTicketData(ticketId);

    const activePrizes = siteContent.tickets.prizes.filter((prize) =>
      prize.packageIds.includes(ticketId)
    );

    ticketAmount =
      $("#customAmount").val() === ""
        ? ticket.amount
        : $("#customAmount").val();

    $(".prizes-grid .prize").removeClass(className);
    if (grandPrize) {
      $(".prizes-grid .grand-prize").addClass(className);
    } else {
      $(".prizes-grid .grand-prize").removeClass(className);
    }

    activePrizes.forEach((p) => {
      $(`.prizes-grid .prize[data-number='${p.number}']`).addClass(className);
    });

    if (!$(".grand-prize").hasClass("selected")) {
      $(".grand-prize .grand-prize__amount").html(
        `${formatCurrency(
          grandPrize
            ? ticket.grandPrize
            : siteContent.tickets.grandPrize.defaultAmount,
          0,
          0
        )}`
      );
    }

    if (type === "click") {
      $(".prizes__subtitle").html(
        `Your donation includes <b>${ticket.entry} ${entryPluralized}</b><br>
        into the ${
          grandPrize
            ? `<mark>${formatCurrency(
                ticket.grandPrize,
                0,
                0
              )}</mark> Grand Prize + `
            : ""
        }<b>${activePrizes.length} Prizes</b>`
      );

      if (!suppressCustomAmountUnselect) {
        $("#customAmountCard").removeClass("selected");
      }

      $(".ticket-options__control-title").html(
        `Enter <mark>custom amount</mark> to see entry details`
      );

      $(".cart__subtitle, .entry-quantity").text(
        `${ticket.entry} ${entryPluralized}`
      );
      $(".items-quantity").css("display", "flex");
      if (getSelectedTeam() != undefined || getSelectedTeam() != null) {
        $(".cart__team").text(`Team: ${getSelectedTeam()}`);
      }
      $(".prizes-quantity").text(`${ticket.prizes} Prizes`);

      $(".selected-tickets .cart__summary-list").empty();

      activePrizes.forEach((p) => {
        $(".selected-tickets .cart__summary-list").append(
          $("<li>").text(p.title)
        );
      });

      $(".grand-prize .grand-prize__amount").html(
        `${formatCurrency(
          grandPrize
            ? ticket.grandPrize
            : siteContent.tickets.grandPrize.defaultAmount,
          0,
          0
        )}`
      );

      updateColumns(activePrizes.length);

      if (grandPrize) {
        $(".selected-tickets .cart__summary-list").prepend(
          $("<li>").text(`$${formatNumber(ticket.grandPrize)} Grand Prize`)
        );
      }

      $(".js-cart-summary-amount").html(
        `${siteContent.cart.ticketsTitle} <span>${formatCurrency(
          ticketAmount
        )}</span>`
      );
      $("#donate_amount").val(`${ticketAmount}`);
      $("#usd_amount").val(`${ticketAmount}`);
      $("#pricing_options").val(ticketId);
      var proFeeAmt = $("#fee_percentage").val();
      var processFee = (`${ticketAmount}` * proFeeAmt) / 100;
      var currency = "$";
      $("#process_fee").html(
        "Add " +
          currency +
          processFee.toFixed(2) +
          " to your payment to cover the " +
          proFeeAmt +
          "% credit card processing fee"
      );
      $("#don_process_fee").val(processFee.toFixed(2));
      $("#rec_amount_full").html(currency + `${ticketAmount}`);

      showPaymentSection();
      $(".checkout-btn__amount").text(formatCurrency(ticketAmount, 0, 0));
      $(".cart").slideDown();
    }
  }

  function getSelectedTeam() {
    let selectedTeam = $(".active-team-member").data("name");
    return selectedTeam;
  }
  // Populate cart
  $(".cart .cart__heading").text(siteContent.cart.heading);
  $(".cart .selected-gifts .cart__title").text(siteContent.cart.giftsTitle);

  // Populate donors and Teams
  $(".team h2.section-title").text(siteContent.partners.heading);
  if (siteContent.teamTitle.slug) {
    $("#donors-btn").text(
      `All Donors (${siteContent.teamTitle.donationsCount})`
    );
  } else {
    $("#donors-btn").text(`Donors (${siteContent.teamTitle.donationsCount})`);
  }

  $("#team-donors-btn").text(
    `Team ${siteContent.teamTitle.title}` +
      (siteContent.partners.teamDoners.length === 1
        ? "'s Donor"
        : "'s Donors") +
      ` (${siteContent.teamTitle.teamsDonationCount})`
  );

  if (siteContent.teamTitle.slug) {
    $("#members-btn").text(`All Teams (${siteContent.teamTitle.teamsCount})`);
  } else {
    $("#members-btn").text(`Teams (${siteContent.teamTitle.teamsCount})`);
  }
  // Populate donors
  function renderDonors() {
    const DonorCard = ({ name, amount, comment, time, teamName }) => `
      <div class="donor-card">
        <div class="team-card__header">
          <span class="title">${name}</span>
          <span class="amount">${formatCurrency(amount)}</span>
        </div>
        <div class="donor-card__body">
         
        ${
          teamName
            ? `<p class="donor-card__info">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_341_5)">
          <path d="M11.1238 9.28305C10.753 8.91202 10.3199 8.6092 9.84408 8.38845C10.515 7.84488 10.9431 7.01545 10.9431 6.08531C10.9431 4.44423 9.57452 3.09789 7.93344 3.12307C6.31753 3.14825 5.01563 4.46496 5.01563 6.08531C5.01563 7.01545 5.44515 7.84488 6.11462 8.38845C5.63875 8.60903 5.20554 8.91188 4.83493 9.28305C4.02624 10.0932 3.56709 11.1626 3.53747 12.303C3.53708 12.3189 3.53985 12.3346 3.54563 12.3493C3.5514 12.364 3.56007 12.3774 3.57111 12.3888C3.58215 12.4001 3.59535 12.4091 3.60992 12.4152C3.6245 12.4213 3.64015 12.4245 3.65596 12.4245H4.48539C4.54908 12.4245 4.6024 12.3741 4.60388 12.3105C4.63202 11.4514 4.98008 10.6472 5.59179 10.0369C5.9048 9.72225 6.27713 9.47278 6.68721 9.30295C7.09729 9.13312 7.53698 9.04631 7.98083 9.04755C8.88283 9.04755 9.73151 9.39857 10.3699 10.0369C10.9801 10.6472 11.3282 11.4514 11.3578 12.3105C11.3593 12.3741 11.4126 12.4245 11.4763 12.4245H12.3057C12.3215 12.4245 12.3372 12.4213 12.3517 12.4152C12.3663 12.4091 12.3795 12.4001 12.3906 12.3888C12.4016 12.3774 12.4103 12.364 12.416 12.3493C12.4218 12.3346 12.4246 12.3189 12.4242 12.303C12.3946 11.1626 11.9354 10.0932 11.1238 9.28305ZM7.98083 7.98114C7.47429 7.98114 6.99737 7.78415 6.64042 7.42572C6.46128 7.248 6.31978 7.03601 6.22435 6.80241C6.12893 6.5688 6.08153 6.31837 6.085 6.06605C6.08944 5.58025 6.28347 5.11073 6.62264 4.76267C6.97811 4.39831 7.45355 4.1954 7.96158 4.18948C8.46368 4.18503 8.95097 4.38054 9.3094 4.73156C9.67671 5.09148 9.87815 5.57284 9.87815 6.08531C9.87815 6.59185 9.68116 7.06729 9.32273 7.42572C9.14688 7.60241 8.93773 7.74248 8.7074 7.83782C8.47707 7.93315 8.23011 7.98187 7.98083 7.98114ZM4.27063 6.47632C4.2573 6.34747 4.24989 6.21713 4.24989 6.08531C4.24989 5.84981 4.27211 5.62024 4.31358 5.39659C4.32395 5.34327 4.29581 5.28847 4.24693 5.26625C4.0455 5.1759 3.86036 5.05149 3.7004 4.89449C3.51191 4.71173 3.36359 4.49169 3.26489 4.2484C3.1662 4.00511 3.11931 3.74392 3.1272 3.4815C3.14053 3.00606 3.3316 2.55432 3.66485 2.21366C4.03069 1.83894 4.52242 1.63454 5.04525 1.64047C5.51773 1.64491 5.97391 1.82709 6.31901 2.14997C6.43602 2.25958 6.53674 2.38103 6.62116 2.51137C6.65079 2.55728 6.70855 2.57654 6.75891 2.55876C7.01958 2.46841 7.29507 2.40473 7.57797 2.3751C7.66091 2.36622 7.70831 2.27735 7.67128 2.20329C7.18991 1.25093 6.20645 0.593316 5.06895 0.575543C3.42639 0.550364 2.05783 1.8967 2.05783 3.5363C2.05783 4.46644 2.48588 5.29587 3.15682 5.83944C2.68583 6.05717 2.25186 6.35783 1.87566 6.73404C1.064 7.54421 0.604855 8.61358 0.575232 9.75552C0.574837 9.77133 0.57761 9.78706 0.583387 9.80178C0.589165 9.8165 0.59783 9.82991 0.608872 9.84123C0.619915 9.85255 0.633111 9.86154 0.647683 9.86768C0.662256 9.87382 0.677909 9.87698 0.693722 9.87697H1.52463C1.58832 9.87697 1.64164 9.82662 1.64312 9.76293C1.67126 8.90388 2.01932 8.09963 2.63103 7.48941C3.06648 7.05396 3.59968 6.75181 4.18176 6.60518C4.23952 6.59037 4.27803 6.53557 4.27063 6.47632Z" fill="#999999"/>
          </g>
          <defs>
          <clipPath id="clip0_341_5">
          <rect width="13" height="13" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          <span class="description">${teamName}</span>
        </p>`
            : ""
        }
          
        ${
          comment
            ? `<p class="donor-card__info" tooltip="${comment}">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_341_2)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.463867 8.5002C0.463867 4.0651 4.01694 0.469727 8.39987 0.469727C12.7828 0.469727 16.3359 4.0651 16.3359 8.5002V14.7173C16.3359 14.9359 16.245 15.1443 16.0854 15.2915C15.9259 15.4388 15.7124 15.5113 15.4974 15.4912L12.7263 15.2328C10.3363 16.8059 7.28608 16.9639 4.74262 15.6274L5.09655 14.9377L4.74261 15.6274C2.11356 14.246 0.463731 11.4979 0.463867 8.5002ZM1.23187 8.5002H0.463867H1.23187ZM8.39987 2.02401C4.86525 2.02401 1.99987 4.92351 1.99987 8.5002V8.50024C1.99976 10.9177 3.33026 13.134 5.45048 14.248C7.5707 15.3621 10.1276 15.1885 12.0817 13.7978C12.2308 13.6916 12.4124 13.6426 12.594 13.6596L14.7999 13.8653V8.5002C14.7999 4.9235 11.9345 2.02401 8.39987 2.02401Z" fill="#999999"/>
            <path d="M5.32757 9.79509C4.90342 9.79509 4.55957 10.143 4.55957 10.5722C4.55957 11.0014 4.90342 11.3494 5.32757 11.3494V9.79509ZM9.42357 11.3494C9.84771 11.3494 10.1916 11.0014 10.1916 10.5722C10.1916 10.143 9.84771 9.79509 9.42357 9.79509V11.3494ZM5.32757 6.68652C4.90342 6.68652 4.55957 7.03448 4.55957 7.46367C4.55957 7.89286 4.90342 8.24081 5.32757 8.24081V6.68652ZM11.4716 8.24081C11.8957 8.24081 12.2396 7.89286 12.2396 7.46367C12.2396 7.03448 11.8957 6.68652 11.4716 6.68652V8.24081ZM5.32757 11.3494H9.42357V9.79509H5.32757V11.3494ZM5.32757 8.24081H11.4716V6.68652H5.32757V8.24081Z" fill="#999999"/>
            </g>
          <defs>
            <clipPath id="clip0_341_2">
            <rect width="17" height="17" fill="white"/>
            </clipPath>
            </defs>
          </svg>
          <span class="description">${comment}</span>
        </p>`
            : ""
        }
          
        <p class="donor-card__info">
          <svg xmlns="http://www.w3.org/2000/svg" width="14.346" height="12.552" viewBox="0 0 14.346 12.552">
            <g id="history" transform="translate(0 -32.222)">
              <path id="Path_44" data-name="Path 44" d="M8.069,32.222a6.281,6.281,0,0,0-6.2,5.38H0l2.69,2.69L5.38,37.6h-1.7a4.482,4.482,0,1,1,.752,3.514L2.974,42.163a6.276,6.276,0,1,0,5.1-9.941Z" fill="#999"/>
              <path id="Path_45" data-name="Path 45" d="M257.778,161.111v3.646l2.677,1.606.923-1.538-1.806-1.084v-2.63Z" transform="translate(-250.605 -125.303)" fill="#999"/>
            </g>
          </svg>
          <time>${time}</time>
        </p>
      </div>
    </div>`;
    if (siteContent.campaignSettings.showDoners == 1) {
      if (!siteContent.partners.donors?.length) {
        $("#donors-btn").parent().addClass("d-none");
      }

      if (siteContent.teamTitle.donationsCount < 12) {
        $(".load-more-donors").addClass("d-none");
      }

      $(".donors-grid").html(
        siteContent.partners.donors.map(DonorCard).join("")
      );
    } else {
      $(".donors-grid").hide();
      $("#donors-btn").parent().hide("");
      $(".load-more-donors").hide("");
    }
  }

  // Populate teamDonors
  function renderTeamDonors() {
    const TeamDonorCard = ({ name, amount, comment, time, teamName }) => `
        <div class="donor-card team-card-donor">
          <div class="team-card__header">
            <span class="title">${name}</span>
            <span class="amount">${formatCurrency(amount)}</span>
          </div>
          <div class="donor-card__body">
           
          ${
            teamName
              ? `<p class="donor-card__info">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_341_5)">
            <path d="M11.1238 9.28305C10.753 8.91202 10.3199 8.6092 9.84408 8.38845C10.515 7.84488 10.9431 7.01545 10.9431 6.08531C10.9431 4.44423 9.57452 3.09789 7.93344 3.12307C6.31753 3.14825 5.01563 4.46496 5.01563 6.08531C5.01563 7.01545 5.44515 7.84488 6.11462 8.38845C5.63875 8.60903 5.20554 8.91188 4.83493 9.28305C4.02624 10.0932 3.56709 11.1626 3.53747 12.303C3.53708 12.3189 3.53985 12.3346 3.54563 12.3493C3.5514 12.364 3.56007 12.3774 3.57111 12.3888C3.58215 12.4001 3.59535 12.4091 3.60992 12.4152C3.6245 12.4213 3.64015 12.4245 3.65596 12.4245H4.48539C4.54908 12.4245 4.6024 12.3741 4.60388 12.3105C4.63202 11.4514 4.98008 10.6472 5.59179 10.0369C5.9048 9.72225 6.27713 9.47278 6.68721 9.30295C7.09729 9.13312 7.53698 9.04631 7.98083 9.04755C8.88283 9.04755 9.73151 9.39857 10.3699 10.0369C10.9801 10.6472 11.3282 11.4514 11.3578 12.3105C11.3593 12.3741 11.4126 12.4245 11.4763 12.4245H12.3057C12.3215 12.4245 12.3372 12.4213 12.3517 12.4152C12.3663 12.4091 12.3795 12.4001 12.3906 12.3888C12.4016 12.3774 12.4103 12.364 12.416 12.3493C12.4218 12.3346 12.4246 12.3189 12.4242 12.303C12.3946 11.1626 11.9354 10.0932 11.1238 9.28305ZM7.98083 7.98114C7.47429 7.98114 6.99737 7.78415 6.64042 7.42572C6.46128 7.248 6.31978 7.03601 6.22435 6.80241C6.12893 6.5688 6.08153 6.31837 6.085 6.06605C6.08944 5.58025 6.28347 5.11073 6.62264 4.76267C6.97811 4.39831 7.45355 4.1954 7.96158 4.18948C8.46368 4.18503 8.95097 4.38054 9.3094 4.73156C9.67671 5.09148 9.87815 5.57284 9.87815 6.08531C9.87815 6.59185 9.68116 7.06729 9.32273 7.42572C9.14688 7.60241 8.93773 7.74248 8.7074 7.83782C8.47707 7.93315 8.23011 7.98187 7.98083 7.98114ZM4.27063 6.47632C4.2573 6.34747 4.24989 6.21713 4.24989 6.08531C4.24989 5.84981 4.27211 5.62024 4.31358 5.39659C4.32395 5.34327 4.29581 5.28847 4.24693 5.26625C4.0455 5.1759 3.86036 5.05149 3.7004 4.89449C3.51191 4.71173 3.36359 4.49169 3.26489 4.2484C3.1662 4.00511 3.11931 3.74392 3.1272 3.4815C3.14053 3.00606 3.3316 2.55432 3.66485 2.21366C4.03069 1.83894 4.52242 1.63454 5.04525 1.64047C5.51773 1.64491 5.97391 1.82709 6.31901 2.14997C6.43602 2.25958 6.53674 2.38103 6.62116 2.51137C6.65079 2.55728 6.70855 2.57654 6.75891 2.55876C7.01958 2.46841 7.29507 2.40473 7.57797 2.3751C7.66091 2.36622 7.70831 2.27735 7.67128 2.20329C7.18991 1.25093 6.20645 0.593316 5.06895 0.575543C3.42639 0.550364 2.05783 1.8967 2.05783 3.5363C2.05783 4.46644 2.48588 5.29587 3.15682 5.83944C2.68583 6.05717 2.25186 6.35783 1.87566 6.73404C1.064 7.54421 0.604855 8.61358 0.575232 9.75552C0.574837 9.77133 0.57761 9.78706 0.583387 9.80178C0.589165 9.8165 0.59783 9.82991 0.608872 9.84123C0.619915 9.85255 0.633111 9.86154 0.647683 9.86768C0.662256 9.87382 0.677909 9.87698 0.693722 9.87697H1.52463C1.58832 9.87697 1.64164 9.82662 1.64312 9.76293C1.67126 8.90388 2.01932 8.09963 2.63103 7.48941C3.06648 7.05396 3.59968 6.75181 4.18176 6.60518C4.23952 6.59037 4.27803 6.53557 4.27063 6.47632Z" fill="#999999"/>
            </g>
            <defs>
            <clipPath id="clip0_341_5">
            <rect width="13" height="13" fill="white"/>
            </clipPath>
            </defs>
            </svg>
            <span class="description">${teamName}</span>
          </p>`
              : ""
          }
            
          ${
            comment
              ? `<p class="donor-card__info">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_341_2)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.463867 8.5002C0.463867 4.0651 4.01694 0.469727 8.39987 0.469727C12.7828 0.469727 16.3359 4.0651 16.3359 8.5002V14.7173C16.3359 14.9359 16.245 15.1443 16.0854 15.2915C15.9259 15.4388 15.7124 15.5113 15.4974 15.4912L12.7263 15.2328C10.3363 16.8059 7.28608 16.9639 4.74262 15.6274L5.09655 14.9377L4.74261 15.6274C2.11356 14.246 0.463731 11.4979 0.463867 8.5002ZM1.23187 8.5002H0.463867H1.23187ZM8.39987 2.02401C4.86525 2.02401 1.99987 4.92351 1.99987 8.5002V8.50024C1.99976 10.9177 3.33026 13.134 5.45048 14.248C7.5707 15.3621 10.1276 15.1885 12.0817 13.7978C12.2308 13.6916 12.4124 13.6426 12.594 13.6596L14.7999 13.8653V8.5002C14.7999 4.9235 11.9345 2.02401 8.39987 2.02401Z" fill="#999999"/>
              <path d="M5.32757 9.79509C4.90342 9.79509 4.55957 10.143 4.55957 10.5722C4.55957 11.0014 4.90342 11.3494 5.32757 11.3494V9.79509ZM9.42357 11.3494C9.84771 11.3494 10.1916 11.0014 10.1916 10.5722C10.1916 10.143 9.84771 9.79509 9.42357 9.79509V11.3494ZM5.32757 6.68652C4.90342 6.68652 4.55957 7.03448 4.55957 7.46367C4.55957 7.89286 4.90342 8.24081 5.32757 8.24081V6.68652ZM11.4716 8.24081C11.8957 8.24081 12.2396 7.89286 12.2396 7.46367C12.2396 7.03448 11.8957 6.68652 11.4716 6.68652V8.24081ZM5.32757 11.3494H9.42357V9.79509H5.32757V11.3494ZM5.32757 8.24081H11.4716V6.68652H5.32757V8.24081Z" fill="#999999"/>
              </g>
            <defs>
              <clipPath id="clip0_341_2">
              <rect width="17" height="17" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <span class="description">${comment}</span>
          </p>`
              : ""
          }
            
          <p class="donor-card__info">
            <svg xmlns="http://www.w3.org/2000/svg" width="14.346" height="12.552" viewBox="0 0 14.346 12.552">
              <g id="history" transform="translate(0 -32.222)">
                <path id="Path_44" data-name="Path 44" d="M8.069,32.222a6.281,6.281,0,0,0-6.2,5.38H0l2.69,2.69L5.38,37.6h-1.7a4.482,4.482,0,1,1,.752,3.514L2.974,42.163a6.276,6.276,0,1,0,5.1-9.941Z" fill="#999"/>
                <path id="Path_45" data-name="Path 45" d="M257.778,161.111v3.646l2.677,1.606.923-1.538-1.806-1.084v-2.63Z" transform="translate(-250.605 -125.303)" fill="#999"/>
              </g>
            </svg>
            <time>${time}</time>
          </p>
        </div>
      </div>`;
    if (siteContent.campaignSettings.showDoners == 1) {
      if (!siteContent.partners.teamDoners?.length) {
        $("#team-donors-btn").addClass("d-none");
      }

      if (siteContent.teamTitle.teamsDonationCount < 12) {
        $(".load-more-team-donors").addClass("d-none");
      }
      $(".team-donors").html(
        siteContent.partners.teamDoners.map(TeamDonorCard).join("")
      );
    } else {
      $(".team-donors").hide();
      $("#team-donors-btn").hide();
      $(".load-more-team-donors").hide();
    }
  }
  // Populate Teams
  function renderTeamMembers() {
    const TeamMemberCard = ({
      id,
      name,
      teamSlug,
      amountRaised,
      teamGoal,
      totalDonations,
      linkUrl,
    }) => {
      return `<div class="team-member-card" data-id="${id}" data-name="${name}" data-slug="${teamSlug}">
      <span class="option-card-teams overlay">
      <svg xmlns="http://www.w3.org/2000/svg" width="17.87" height="12.849" viewBox="0 0 17.87 12.849">
        <g id="Group_2" data-name="Group 2" transform="translate(-436.858 -1650.344)">
          <rect id="Rectangle_31" data-name="Rectangle 31" width="10" height="3" rx="1.5"
            transform="translate(438.979 1654) rotate(45)" fill="#fff" />
          <rect id="Rectangle_32" data-name="Rectangle 32" width="15" height="3" rx="1.5"
            transform="translate(442 1660.95) rotate(-45)" fill="#fff" />
        </g>
      </svg>
    </span>
        <div class="team-member__wrapper">
          <div class="team-card__header">
         
            <div class="left">
              <span class="title">${name}</span>
              <span class="donors"> ${totalDonations} ${
        totalDonations <= 1 ? "donor" : "donors"
      }</span>
            </div>
            <div class="right">
              <span class="amount">${formatCurrency(amountRaised, 0, 0)}</span>
              <span class="raised">of ${formatCurrency(
                teamGoal,
                0,
                0
              )} raised</span>
            </div>
          </div>
          <div class="progress" role="progressbar">
            <div class="progress-bar" style="width: ${calculateProgress(
              amountRaised,
              teamGoal
            )}%"></div>
          </div>
          <div class="team-card__btns">
          ${
            siteContent.teamTitle && siteContent.teamTitle.title
              ? ""
              : '<button type="button" class="btn overlay select-team">Select Team</button>'
          }
            <a href="${linkUrl}">
              <button type="button" class="btn overlay donate-btn">Visit Team</button>
            </a>
          </div>
        </div>
      </div>`;
    };
    if (siteContent.campaignSettings.showDoners == 0) {
      $("#members-btn").addClass("active");
      $("#members").addClass("active show");
      $(".search-text").attr("data-id", "team");
      $(".team__select ").val("alphabatics");
    }
    if (!siteContent.teamTitle.teamsCount) {
      $("#members-btn").parent().addClass("d-none");
    }

    if (siteContent.teamTitle.teamsCount < 6) {
      $(".load-more-teams").addClass("d-none");
    }
    $(".team-members-grid").html(
      siteContent.partners.teamMembers.map(TeamMemberCard).join("")
    );
  }

  //Render gifts
  function renderGifts() {
    const Gift = ({ id, imageURL, title }) => `
      <div class="swiper-slide" data-id="${id}">
        <label class="gift">
          <input class="card-input" type="checkbox" name="gift-card" />
          <div class="prize__body">
            <span class="option-card__checkbox overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="17.87" height="12.849" viewBox="0 0 17.87 12.849">
                <g id="Group_2" data-name="Group 2" transform="translate(-436.858 -1650.344)">
                  <rect id="Rectangle_31" data-name="Rectangle 31" width="10" height="3" rx="1.5"
                    transform="translate(438.979 1654) rotate(45)" fill="#fff" />
                  <rect id="Rectangle_32" data-name="Rectangle 32" width="15" height="3" rx="1.5"
                    transform="translate(442 1660.95) rotate(-45)" fill="#fff" />
                </g>
              </svg>
            </span>
            <div class="prize__image">
            <img src="${imageURL}" alt="">
            </div>
            <div class="prize__desc">
              <div class="d-flex align-items-start">
                <p class="prize__name">${title}</p>
              </div>
            </div>
          </div>
        </label>
      </div>`;
    $(".swiper-gift .swiper-wrapper").html(
      siteContent.tickets.gifts.map(Gift).join("")
    );
  }
  //Gifts slider
  new Swiper(".swiper-gift", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-gift-button-next",
      prevEl: ".swiper-gift-button-prev",
    },
  });

  //Populate about campaign
  $(".about-campaign .section-title").text(siteContent.aboutCampaign.heading);
  // $(".about-campaign__info p").text(siteContent.aboutCampaign.text);
  $(".about-campaign .btn").attr(
    "href",
    siteContent.aboutCampaign.button[0].link
  );
  $(".about-campaign .btn").text(siteContent.aboutCampaign.button[0].text);

  //Render gallery slides
  function renderGallerySlides() {
    const GalleryItem = ({ id, imageURL, linkUrl, title }) => `
      <div class="swiper-slide" data-id="${id}">
      <a href="${linkUrl}" class="swiper-slide gallery-item">
        <span class="gallery-item__media">
          <img src="${imageURL}" alt="">
        </span>
        <span class="gallery-item__description">
          <p>${title}</p>
        </span>
      </a>
    </div>`;
    $(".gallery-grid").html(siteContent.gallery.map(GalleryItem).join(""));
  }

  //Swiper-gallery
  let swiperGalleryInit = false;
  let swiperGallery;

  function gallerySwiper() {
    if ($(window).width() <= 767 && $(".swiper-gallery").length) {
      if (!swiperGalleryInit) {
        swiperGalleryInit = true;
        swiperGallery = new Swiper(".swiper-gallery", {
          slidesPerView: 1,
          spaceBetween: 40,
          grid: {
            rows: 2,
          },
          navigation: {
            nextEl: ".swiper-gallery-button-next",
            prevEl: ".swiper-gallery-button-prev",
          },
        });
      }
    } else if (swiperGalleryInit) {
      swiperGallery.destroy();
      swiperGalleryInit = false;
    }
  }
  gallerySwiper();
  $(window).on("resize", gallerySwiper);

  function displayDonations() {
    var index = 0;

    toastr.options = {
      positionClass: "toast-top-right",
      preventDuplicates: true,
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      timeOut: 5000,
    };

    setInterval(function () {
      var recentDonations = [];
      var currentTime = Date.now();

      siteContent.donations.forEach(function (donation) {
        if (currentTime - donation.timestamp <= 20000) {
          recentDonations.push(
            `<div><b>${donation.name}</b> just donated <b>${formatCurrency(
              donation.amount
            )}</b></div>`
          );
        }
      });

      recentDonations.forEach(function (donationText, donationIndex) {
        toastr.info(donationText, "", { iconClass: "toast-info-noicon" });
      });

      index = 0;
    }, 15000);
  }

  function setDonorsHeight() {
    function getEl() {
      const windowWidth = $(window).width();
      let index = 2;

      if (windowWidth > 1203) {
        index = 8;
      } else if (windowWidth < 1204 && windowWidth > 767) {
        index = 6;
      }
      return $(`.donors-grid .donor-card:eq(${index})`);
    }

    const container = $(".donors-grid");
    const el = getEl();

    if (el.length === 0) return;

    const elHeight = el.outerHeight();
    const distanceToContainerTop = el.offset().top - container.offset().top;
    const containerHeight = Math.ceil(elHeight + distanceToContainerTop);
    container.css("max-height", containerHeight);
  }

  setDonorsHeight();
});
