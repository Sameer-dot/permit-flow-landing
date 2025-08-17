// Consolidated JavaScript from PermitFlow website
$(document).ready(function () {
  // Set current year
  $(".current-year").text(new Date().getFullYear());

  // Menu loading functionality
  var root = location.protocol + "//" + location.host;

  // Load various menu sections
  const menuSections = [
    "builder-stories",
    "faqs",
    "how-tos",
    "local-permitting",
    "permit-basics",
    "news",
  ];

  menuSections.forEach(function (section) {
    const url = section === "how-tos" ? "/menus/how-tos" : `/menus/${section}`;
    const className = section === "how-tos" ? "how-to-guides" : section;

    $.get(root + url, function (response) {
      var $data = $(response);
      var $data1 = $(response);
      $(
        `.resources-menu-second-block.${className} .resources-menu-second-content`
      ).html($data.filter("#menuload"));
      $(`.resources-menu-item.${className} .mobile-cards`).html(
        $data1.filter("#menuload")
      );
    });
  });

  // Header sticky functionality
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 60) {
      $(".header").addClass("stickyheader");
    } else {
      $(".header").removeClass("stickyheader");
    }
  });

  // Logo slider functionality
  function logoSlider() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      $(".builders-logos").infiniteslide({
        speed: 50,
        direction: "left",
        pauseonhover: true,
        responsive: false,
        clone: 2,
      });
    }
  }
  logoSlider();
  $(window).resize(function () {
    logoSlider();
  });

  // Mobile logo slider
  if (window.matchMedia("(max-width: 767px)").matches) {
    $(".builders-logos").slick({
      infinite: true,
      arrows: false,
      dots: false,
      speed: 600,
      autoplay: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 620,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 567,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  // Projects slider
  $(".projectsslider").slick({
    dots: false,
    arrow: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
          slidesToShow: 1,
        },
      },
    ],
  });

  // Client slider
  $(".clientslider").slick({
    dots: true,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Main vertical slider with progress bars
  $(".slider").slick({
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    infinite: true,
    arrows: false,
    dots: false,
    autoplay: false,
    speed: 1000,
    draggable: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          vertical: false,
          verticalSwiping: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
          fade: false,
          draggable: true,
        },
      },
    ],
  });

  // Progress bar functionality for main slider (desktop only)
  if (window.matchMedia("(min-width: 992px)").matches) {
    var percentTime = 0;
    var tick;
    var time = 1;
    var progressBarIndex = 0;

    $(".slidertopbox .progressbarslider").each(function (index) {
      var progress = "<div class='inProgress inProgress" + index + "'></div>";
      $(this).html(progress);
    });

    function startProgressbar() {
      resetProgressbar();
      percentTime = 0;
      tick = setInterval(interval, 10);
    }

    function interval() {
      if (
        $(
          '.slider .slick-track div[data-slick-index="' +
            progressBarIndex +
            '"]'
        ).attr("aria-hidden") === "true"
      ) {
        progressBarIndex = $(
          '.slider .slick-track div[aria-hidden="false"]'
        ).data("slickIndex");
        startProgressbar();
      } else {
        percentTime += 1 / (time + 5);
        $(".inProgress").parent().parent().removeClass("activestep");
        $(".inProgress" + progressBarIndex)
          .parent()
          .parent()
          .addClass("activestep");
        $(".inProgress" + progressBarIndex).css({
          width: percentTime + "%",
        });
        if (percentTime >= 100) {
          $(".singleitem").slick("slickNext");
          progressBarIndex++;
          if (progressBarIndex > 5) {
            progressBarIndex = 0;
          }
          startProgressbar();
        }
      }
    }

    function resetProgressbar() {
      $(".inProgress").css({
        width: 0 + "%",
      });
      clearInterval(tick);
    }

    $(".slidertopitem").click(function () {
      clearInterval(tick);
      var goToThisIndex = $(this).find(".progressbarslider").data("slickIndex");
      $(".singleitem").slick("slickGoTo", goToThisIndex, false);
      startProgressbar();
    });

    $(window).scroll(function () {
      var offset = $("#Howitworks").offset().top;
      if ($(window).scrollTop() >= offset) {
        if (percentTime === 0) {
          startProgressbar();
        }
      }
    });
  }

  // Permit slider functionality (desktop only)
  if (window.matchMedia("(min-width: 992px)").matches) {
    $(".singlepermitslider").slick({
      vertical: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: false,
      infinite: true,
      arrows: false,
      dots: false,
      autoplay: false,
      speed: 1000,
      draggable: false,
    });

    var percentTimeOne = 0;
    var tickOne;
    var timeBar = 1;
    var progressBarIndexOne = 0;

    $(".sliderpermitbox .progressbar").each(function (index) {
      var progressOne =
        "<div class='inProgressbox inProgressbox" + index + "'></div>";
      $(this).html(progressOne);
    });

    function startProgressbarOne() {
      resetProgressbarOne();
      percentTimeOne = 0;
      tickOne = setInterval(intervalBar, 10);
    }

    function intervalBar() {
      if (
        $(
          '.singlepermitslider .slick-track div[data-slick-index="' +
            progressBarIndexOne +
            '"]'
        ).attr("aria-hidden") === "true"
      ) {
        progressBarIndexOne = $(
          '.singlepermitslider .slick-track div[aria-hidden="false"]'
        ).data("slickIndex");
        startProgressbarOne();
      } else {
        percentTimeOne += 1 / (timeBar + 5);
        $(".inProgressbox").parent().parent().removeClass("activestep");
        $(".inProgressbox" + progressBarIndexOne)
          .parent()
          .parent()
          .addClass("activestep");
        $(".inProgressbox" + progressBarIndexOne).css({
          width: percentTimeOne + "%",
        });
        if (percentTimeOne >= 100) {
          $(".singlepermitslider").slick("slickNext");
          progressBarIndexOne++;
          if (progressBarIndexOne > 3) {
            progressBarIndexOne = 0;
          }
          startProgressbarOne();
        }
      }
    }

    function resetProgressbarOne() {
      $(".inProgressbox").css({
        width: 0 + "%",
      });
      clearInterval(tickOne);
    }

    $(".sliderpermittopitem").click(function () {
      clearInterval(tickOne);
      var goToThisIndex = $(this).find(".progressbar").data("slickIndex");
      $(".singlepermitslider").slick("slickGoTo", goToThisIndex, false);
      startProgressbarOne();
    });

    $(window).scroll(function () {
      var offsetOne = $("#Permitflow").offset().top;
      if ($(window).scrollTop() >= offsetOne) {
        if (percentTimeOne === 0) {
          startProgressbarOne();
        }
      }
    });
  }

  // Industry logo slider (mobile only)
  if (window.matchMedia("(max-width: 767px)").matches) {
    $(".industrylogobox").slick({
      fade: false,
      infinite: false,
      arrows: false,
      dots: false,
      autoplay: true,
      speed: 600,
      draggable: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 567,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  // Company logos slider
  $(".company-logos-slider").slick({
    infinite: true,
    arrows: false,
    dots: false,
    autoplay: true,
    speed: 600,
    draggable: true,
    centerMode: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });

  // Case studies slider
  $(".case-studies-slider").slick({
    infinite: true,
    arrows: true,
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 478,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});
